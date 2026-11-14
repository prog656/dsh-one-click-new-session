// Host-side cordis plugin.
//
// Why this bakes the path into lib/client.js instead of injecting it:
//
// The client bundle is read from disk when the plugin is loaded, and DSH keys
// its cache by a revision derived from the file's stat. Injecting a value
// through index.html or config.json therefore never reaches the code the
// renderer already holds, and a CSP blocks inline <script> on top of that.
// Rewriting the placeholder in client.js before the page loads is the only
// transport that does not depend on when the client bundle is read: the value
// is simply part of the source, and the rewritten file also bumps the
// revision, so the renderer picks up the new bytes.
//
// install.mjs still does the same rewrite for zip installs; this runs at every
// startup and is a no-op when the placeholder is already gone.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TAG = "[dsh-one-click-new-session]";
const DEFAULT_DIR_NAME = "dsh-blank-sessions";
const META_NAME = "dsh-blank-dir";
const TOKEN = "__DSH_BLANK_SESSION_DIR__";

const HERE_DIR = path.dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = path.dirname(HERE_DIR);
const CLIENT_FILE = path.join(HERE_DIR, "client.js");

function scratchDirForLogs() {
	const override = process.env.DSH_BLANK_SESSION_DIR;
	try {
		return typeof override === "string" && override.trim() !== ""
			? path.resolve(override.trim())
			: path.join(os.homedir(), DEFAULT_DIR_NAME);
	} catch {
		return path.join(os.homedir(), DEFAULT_DIR_NAME);
	}
}

const LOG_FILE = (() => {
	const dir = scratchDirForLogs();
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch {
		/* ignore */
	}
	return path.join(dir, "host-debug.log");
})();

let tapCount = 0;

function log(message) {
	try {
		fs.appendFileSync(LOG_FILE, new Date().toISOString() + " " + message + "\n", "utf8");
	} catch {
		/* ignore */
	}
}

function resolveScratchDir() {
	const dir = scratchDirForLogs();
	try {
		fs.mkdirSync(dir, { recursive: true });
	} catch (error) {
		log("mkdir failed: " + (error && error.message ? error.message : error));
	}
	return dir.replace(/\\/g, "/");
}

/**
 * Replace the placeholder inside the client bundle with the real path. The
 * rewritten file changes mtime, which changes the revision DSH advertises, so
 * the renderer requests fresh bytes instead of a cached chunk.
 * @param {string} dir absolute path with forward slashes
 */
function bakeScratchDir(dir) {
	try {
		const code = fs.readFileSync(CLIENT_FILE, "utf8");
		if (!code.includes(TOKEN)) {
			log("client.js already baked; nothing to do");
			return;
		}
		fs.writeFileSync(CLIENT_FILE, code.split(TOKEN).join(dir), "utf8");
		log("baked " + dir + " into " + CLIENT_FILE);
	} catch (error) {
		log("bake FAILED: " + (error && error.message ? error.message : error));
	}
}

/** Secondary transport, kept in case the bundle is read-only. */
function writeRuntimeConfig(dir) {
	const body = JSON.stringify({ scratchDir: dir }, null, 2) + "\n";
	for (const target of [path.join(PLUGIN_ROOT, "config.json"), path.join(HERE_DIR, "config.json")]) {
		try {
			fs.writeFileSync(target, body, "utf8");
		} catch (error) {
			log("could not write " + target + ": " + (error && error.message ? error.message : error));
		}
	}
}

// Bake at import time: this runs when the host plugin is loaded, which is the
// earliest hook available and may precede the moment the client bundle is read.
const BOOT_DIR = resolveScratchDir();
bakeScratchDir(BOOT_DIR);

/**
 * @param {import("@deepseek-ai/cordis").Context} ctx Host context
 */
export function apply(ctx) {
	const dir = resolveScratchDir();
	log("=== apply start; dir=" + dir + " ===");

	bakeScratchDir(dir);
	writeRuntimeConfig(dir);

	const meta = '<meta name="' + META_NAME + '" content="' + dir + '">';

	ctx.inject(
		["webServer"],
		(ctx) => {
			ctx.effect(() =>
				ctx.webServer.tapIndex((html) => {
					tapCount += 1;
					if (typeof html !== "string") return html;
					if (html.indexOf('name="' + META_NAME + '"') !== -1) return html;
					const headEnd = html.indexOf("</head>");
					if (tapCount <= 2) log("tapIndex #" + tapCount + " headEnd=" + headEnd);
					if (headEnd === -1) return html;
					return html.slice(0, headEnd) + meta + html.slice(headEnd);
				})
			);
		},
		"one-click-new-session: inject scratch dir meta"
	);

	log("=== apply end ===");
}
