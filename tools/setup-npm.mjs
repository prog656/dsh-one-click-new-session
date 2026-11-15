// Discover the local HTTP proxy by probing CONNECT to registry.npmjs.org,
// then write it into the user's .npmrc so npm can reach the public registry.
// The proxy port on this machine changes between sessions, so it is probed
// rather than configured. The mirror registry is excluded from the proxy.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execSync } from "node:child_process";

const TARGET = "registry.npmjs.org:443";
const TIMEOUT = 1500;

function candidatePorts() {
	let out = "";
	try {
		out = execSync("netstat -ano", { encoding: "utf8", windowsHide: true });
	} catch (error) {
		return [];
	}
	const ports = new Set();
	for (const line of out.split(/\r?\n/)) {
		const m = line.match(/TCP\s+127\.0\.0\.1:(\d+)\s+\S+\s+LISTENING/i);
		if (m) ports.add(Number(m[1]));
	}
	return [...ports].filter((p) => p > 1024);
}

function probe(port) {
	return new Promise((resolve) => {
		let settled = false;
		const done = (ok) => {
			if (settled) return;
			settled = true;
			resolve(ok);
		};
		const req = http.request({
			host: "127.0.0.1",
			port,
			method: "CONNECT",
			path: TARGET,
			timeout: TIMEOUT,
			headers: { Host: TARGET }
		});
		req.on("connect", (res, socket) => {
			socket.destroy();
			done(res.statusCode === 200);
		});
		req.on("error", () => done(false));
		req.on("timeout", () => {
			req.destroy();
			done(false);
		});
		req.end();
	});
}

const npmrcPath = path.join(os.homedir(), ".npmrc");
// Only the transport is configured here. The registry stays on whatever the
// user already has (a mirror); login and publish pass --registry explicitly,
// so downloads keep using the mirror after this runs.
const wanted = [["strict-ssl", "false"]];

function updateNpmrc(proxyUrl) {
	let lines = [];
	try {
		lines = fs.readFileSync(npmrcPath, "utf8").split(/\r?\n/);
	} catch {
		lines = [];
	}
	if (lines.length > 0) {
		const backup = npmrcPath + ".bak-" + Date.now();
		fs.copyFileSync(npmrcPath, backup);
		console.log("  已备份原 .npmrc -> " + path.basename(backup));
	}
	const set = new Map([
		["proxy", proxyUrl],
		["https-proxy", proxyUrl],
		["noproxy", "registry.npmmirror.com,localhost,127.0.0.1"],
		...wanted
	]);
	const kept = [];
	for (const line of lines) {
		const key = line.split("=")[0].trim();
		if (set.has(key)) continue;
		if (line.trim() === "") continue;
		kept.push(line);
	}
	for (const [k, v] of set) kept.push(k + "=" + v);
	fs.writeFileSync(npmrcPath, kept.join("\n") + "\n", "utf8");
	console.log("  已写入 .npmrc: proxy / https-proxy / noproxy / strict-ssl=false（registry 保持不变）");
}

const ports = candidatePorts();
console.log("  本地可疑端口 " + ports.length + " 个，正在探测...");

const results = await Promise.all(ports.map(async (p) => ({ port: p, ok: await probe(p) })));
const hit = results.find((r) => r.ok);

if (!hit) {
	console.log("");
	console.log("  ✗ 没找到可用的代理端口。");
	console.log("    请确认代理软件正在运行，然后重新双击本脚本所在的 bat。");
	process.exit(1);
}

const proxyUrl = "http://127.0.0.1:" + hit.port;
console.log("  ✓ 找到可用代理: " + proxyUrl + "（已通过 CONNECT 验证能到 npm 官方）");
updateNpmrc(proxyUrl);
console.log("");
console.log("  下一步：npm login（浏览器会弹授权页）");
