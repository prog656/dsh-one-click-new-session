#!/usr/bin/env node
/**
 * Installer for dsh-one-click-new-session.
 * Zero dependencies, cross-platform (Node.js 18+).
 *
 * Usage:
 *   node install.mjs                          auto-detect profile, English UI
 *   node install.mjs --lang zh                Chinese button labels / messages
 *   node install.mjs --profile <dir>          use an explicit DSH profile dir
 *   node install.mjs --dir <path>             use an explicit scratch folder
 *   node install.mjs --dry-run                show the plan, write nothing
 *   node install.mjs --force                  overwrite an existing install
 *   node install.mjs --uninstall              remove the plugin registration
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, "src");
const PKG = "@local/dsh-one-click-new-session";
const TOKEN = "__DSH_BLANK_SESSION_DIR__";
const VERSION = JSON.parse(fs.readFileSync(path.join(SRC, "package.json"), "utf8")).version;

const I18N = {
	en: {
		SCRATCH_TITLE: "Quick Chats",
		LABEL: "New chat",
		HINT: "New chat (no workspace needed)",
		FAIL_LABEL: "New chat failed"
	},
	zh: {
		SCRATCH_TITLE: "临时对话",
		LABEL: "新建对话",
		HINT: "新建对话（不需要选择工作区）",
		FAIL_LABEL: "新建对话失败"
	}
};

let lang = "en";
const t = (zh, en) => (lang === "zh" ? zh : en);

function printHelp() {
	console.log(`
${PKG} installer v${VERSION}

Options:
  --lang <en|zh>     Button labels and console language (default: en)
  --profile <dir>    DSH profile directory (contains package.json)
  --dir <path>       Scratch folder for workspace-free chats
  --dry-run          Print the plan without writing anything
  --force            Overwrite an existing installation
  --uninstall        Remove the plugin from the profile
  -h, --help         Show this help
`);
}

function parseArgs(argv) {
	const opts = { dryRun: false, uninstall: false, force: false };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === "--lang") lang = argv[++i];
		else if (a === "--profile") opts.profile = argv[++i];
		else if (a === "--dir") opts.dir = argv[++i];
		else if (a === "--dry-run") opts.dryRun = true;
		else if (a === "--force") opts.force = true;
		else if (a === "--uninstall") opts.uninstall = true;
		else if (a === "-h" || a === "--help") { printHelp(); process.exit(0); }
		else { console.error("Unknown option: " + a); process.exit(1); }
	}
	if (!I18N[lang]) {
		console.error("--lang must be en or zh");
		process.exit(1);
	}
	return opts;
}

/** Candidate profile directories, most standard first. */
function profileCandidates(explicit) {
	const home = os.homedir();
	const appdata = process.env.APPDATA || path.join(home, "AppData", "Roaming");
	return [...new Set([
		explicit,
		process.env.DSH_PROFILE,
		path.join(home, ".dsh", "profiles", "web"),
		path.join(home, ".dsh", "profiles", "desktop"),
		path.join(appdata, "@deepseek-ai", "dsh-desktop", "profiles", "desktop"),
		"D:/Program Files (x86)/deepseek harness skins/dsh-home/profiles/desktop"
	].filter(Boolean))];
}

function readProfile(dir) {
	const file = path.join(dir, "package.json");
	if (!fs.existsSync(file)) return null;
	try {
		const json = JSON.parse(fs.readFileSync(file, "utf8"));
		if (!Array.isArray(json && json.dsh && json.dsh.profile && json.dsh.profile.bundles)) return null;
		return { dir, file, json };
	} catch {
		return null;
	}
}

function findProfile(explicit) {
	const candidates = profileCandidates(explicit);
	for (const dir of candidates) {
		const found = readProfile(dir);
		if (found) return found;
	}
	console.error(t("找不到 DSH profile 目录。已尝试：", "Could not find a DSH profile. Tried:"));
	candidates.forEach((d) => console.error("  - " + d));
	console.error(t(
		"\n请用 --profile <目录> 指定包含 package.json 且带 dsh.profile.bundles 的 profile。",
		"\nPass --profile <dir> pointing at a profile whose package.json has dsh.profile.bundles."
	));
	process.exit(1);
}

/** Render src/lib/client.js for the target machine. */
function renderClient(code, scratchPosix) {
	if (!code.includes(TOKEN)) {
		throw new Error("src/lib/client.js is missing " + TOKEN + " — the template may have been modified.");
	}
	let out = code.replace(TOKEN, () => scratchPosix);
	for (const [key, value] of Object.entries(I18N[lang])) {
		const re = new RegExp("(const " + key + " = )\"[^\"]*\"(;)");
		out = out.replace(re, (_m, head, tail) => head + JSON.stringify(value) + tail);
	}
	if (out.includes(TOKEN)) throw new Error("Failed to replace " + TOKEN);
	return out;
}

function writeFile(file, content, dryRun) {
	if (dryRun) {
		console.log("  [dry-run] write " + file);
		return;
	}
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(file, content, "utf8");
}

function main() {
	const opts = parseArgs(process.argv.slice(2));
	const profile = findProfile(opts.profile);
	const target = path.join(profile.dir, "node_modules", PKG);
	const scratch = path.resolve(opts.dir || path.join(os.homedir(), "dsh-blank-sessions"));
	const scratchPosix = scratch.replace(/\\/g, "/");

	console.log(t("DSH profile : ", "DSH profile : ") + profile.dir);
	console.log(t("插件目录    : ", "Plugin dir  : ") + target);
	console.log(t("临时对话目录: ", "Scratch dir : ") + scratch);
	console.log("");

	// --- uninstall -------------------------------------------------------
	if (opts.uninstall) {
		const json = profile.json;
		if (json.dependencies) delete json.dependencies[PKG];
		json.dsh.profile.bundles = json.dsh.profile.bundles.filter((b) => b !== PKG);
		console.log(t("将移除注册项并删除插件目录（会话数据保留）。", "Will remove the registration and delete the plugin folder (chat data is kept)."));
		if (!opts.dryRun) {
			fs.writeFileSync(profile.file, JSON.stringify(json, null, 2) + "\n", "utf8");
			fs.rmSync(target, { recursive: true, force: true });
		}
		console.log(t("卸载完成，请重启 DSH。", "Uninstalled. Restart DSH."));
		return;
	}

	// --- safety: never clobber an existing install by accident ------------
	if (fs.existsSync(target) && !opts.force) {
		console.error(t(
			"检测到该 profile 已安装本插件。为保护现有配置，安装已停止。\n如需覆盖请加 --force，或先运行 --uninstall。",
			"This profile already has the plugin installed. Aborting to protect your setup.\nUse --force to overwrite, or run --uninstall first."
		));
		process.exit(1);
	}

	// --- render files ----------------------------------------------------
	const clientSrc = fs.readFileSync(path.join(SRC, "lib", "client.js"), "utf8");
	const rendered = renderClient(clientSrc, scratchPosix);
	const files = {
		"package.json": fs.readFileSync(path.join(SRC, "package.json"), "utf8"),
		"cordis.patch.yml": fs.readFileSync(path.join(SRC, "cordis.patch.yml"), "utf8"),
		"lib/index.js": fs.readFileSync(path.join(SRC, "lib", "index.js"), "utf8"),
		"lib/client.js": rendered
	};

	if (!opts.dryRun) fs.mkdirSync(scratch, { recursive: true });
	for (const [rel, content] of Object.entries(files)) {
		writeFile(path.join(target, rel), content, opts.dryRun);
	}

	// --- register in the profile manifest --------------------------------
	const json = profile.json;
	json.dependencies = json.dependencies || {};
	json.dependencies[PKG] = VERSION;
	const bundles = json.dsh.profile.bundles;
	if (!bundles.includes(PKG)) bundles.push(PKG);
	if (opts.dryRun) {
		console.log("  [dry-run] update " + profile.file + " (dependencies + bundles)");
	} else {
		fs.writeFileSync(profile.file, JSON.stringify(json, null, 2) + "\n", "utf8");
	}

	console.log("");
	if (opts.dryRun) {
		console.log(t("预演完成，未写入任何文件。", "Dry run complete. Nothing was written."));
		return;
	}
	console.log(t("安装完成。下一步：", "Done. Next steps:"));
	console.log(t("  1. 完全退出并重启 DeepSeek Harness", "  1. Fully quit and restart DeepSeek Harness"));
	console.log(t("  2. 展开左侧边栏，底部出现「" + I18N[lang].LABEL + "」", "  2. Expand the sidebar; a \"" + I18N[lang].LABEL + "\" button appears at the bottom"));
	console.log(t("  3. 点一下，直接进入可输入的空白对话", "  3. Click it once to land in a ready-to-type blank conversation"));
}

try {
	main();
} catch (error) {
	console.error(t("安装失败：", "Install failed: ") + (error && error.message ? error.message : String(error)));
	process.exit(1);
}
