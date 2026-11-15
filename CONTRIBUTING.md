# Contributing

Thanks for taking the time. Bug reports, docs fixes and small PRs are all welcome — you don't need to be a DSH expert.

## Before you start

- This is an **unofficial** plugin. Don't paste DSH source code, `app.asar` contents, credentials, or personal paths into issues or PRs.
- Repository layout:
  - `src/` — the actual plugin (4 files, this is what gets installed)
  - `install.mjs` / `install.bat` — installer
  - `docs/` — install, architecture, GitHub guide, promotion notes
  - `.github/` — issue & PR templates

## Reporting a bug

Open an issue using the bug template and include: OS, DSH version, install method, console output, and exact reproduction steps. Screenshots help a lot.

## Sending a change

1. Fork the repo, create a branch (`fix/scratch-path`, `feat/per-chat-folder`, ...).
2. Keep the plugin dependency-free. `lib/client.js` runs in the browser renderer — no Node built-ins there.
3. If you change `lib/client.js`, keep the `__DSH_BLANK_SESSION_DIR__` placeholder and the four label constants at the top; `install.mjs` relies on their exact shape.
4. Update `CHANGELOG.md` (under "Unreleased") and the relevant doc.
5. Verify locally: `node --check install.mjs`, `node install.mjs --dry-run --profile <temp-dir>`, then a real install and a click-through in DSH.
6. Open a PR describing **what changed and why**. Link the issue if there is one.

Commit messages: `type: short summary` (`fix:`, `feat:`, `docs:`, `chore:`).

## Ideas that would be genuinely useful

- Per-chat isolated folders (with a clean sidebar story)
- A visible entry point when the sidebar is collapsed
- End-to-end verification on the web profile / macOS / Linux
- Publishing as an npm package for `dsh plugin --profile web add ...`

## Conduct

Be respectful. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
