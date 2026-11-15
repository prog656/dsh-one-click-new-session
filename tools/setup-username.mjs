#!/usr/bin/env node
/**
 * Replace the YOUR_USERNAME placeholder across the repository.
 * Usage: node setup-username.mjs your-github-name
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PLACEHOLDER = "YOUR" + "_USERNAME";
const SKIP_DIRS = new Set([".git", "node_modules", "dist"]);
// These files mention the placeholder as documentation / as a concatenated
// token; replacing them would corrupt the tutorial text.
const SKIP_FILES = new Set(["GITHUB-GUIDE.md", "setup-username.mjs"]);
const TEXT_EXT = new Set([".md", ".json", ".yml", ".yaml", ".js", ".mjs", ".bat", ".txt", ".svg"]);

const username = process.argv[2];
if (!username || !/^[A-Za-z0-9][A-Za-z0-9-]{0,38}$/.test(username)) {
	console.error("Usage: node setup-username.mjs <your-github-username>");
	console.error("Username must be 1-39 chars: letters, digits or hyphens.");
	process.exit(1);
}

let changed = 0;
function walk(dir) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name) || SKIP_FILES.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) { walk(full); continue; }
		if (!entry.isFile()) continue;
		const ext = path.extname(entry.name).toLowerCase();
		if (!TEXT_EXT.has(ext) && entry.name !== ".gitignore") continue;
		const before = fs.readFileSync(full, "utf8");
		if (!before.includes(PLACEHOLDER)) continue;
		fs.writeFileSync(full, before.split(PLACEHOLDER).join(username), "utf8");
		console.log("  " + path.relative(HERE, full));
		changed++;
	}
}

walk(HERE);
console.log("");
console.log("Replaced in " + changed + " files -> github.com/" + username + "/dsh-one-click-new-session");
console.log("Do NOT run this twice with a different name.");
