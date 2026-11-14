# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [1.1.0] - 2026-11-14

### Changed

- The scratch path is now resolved by the **host** half at startup and baked into `lib/client.js`, instead of being written by the installer. This removes the last machine-specific value from the source, so the package can be published to a registry and installed with `dsh plugin add`.
- Startup creates `~/dsh-blank-sessions` (override with `DSH_BLANK_SESSION_DIR`) before the client needs it.
- `install.mjs` is still supported for zip installs and performs the same rewrite; both paths are idempotent.

### Fixed

- The button only worked when the installer had rewritten the source. On a registry install the client kept reading an unsubstituted placeholder, so every click failed with "scratch directory not configured". Root cause: DSH reads the client bundle from disk at load time and caches it under a revision derived from the file's stat, so nothing injected into `index.html` — or served from a new URL — could ever reach the module already running in the renderer.

## [1.0.1] - 2026-11-14

### Fixed

- Installer picked the wrong profile on machines that have both a `web` and a `desktop` profile — it stopped at the first readable one and wrote there, so the plugin looked installed but never loaded. It now prefers a profile that already registers the plugin, then `desktop`, and refuses to guess when several candidates remain. Found and verified on a real machine with two profiles.

## [1.0.0] - 2026-11-14

### Added

- One-click **New chat** button in the `sidebar.footer.action` slot, independent of the selected workspace.
- Dedicated scratch workspace (`~/dsh-blank-sessions`), created idempotently via `workspaces.create({ path })`.
- Official `uiWorkspace.openWorkspace()` path with `sessions.create()` + `openSession()` fallback; blank sessions are reused instead of piling up.
- Visible failure state: red label, error tooltip, console error.
- Cross-platform zero-dependency installer (`install.mjs`) with `--lang`, `--profile`, `--dir`, `--dry-run`, `--force`, `--uninstall`.
- Bilingual README, install / architecture / GitHub beginner / promotion docs, issue & PR templates, MIT license.

### Notes

- Verified end-to-end on the Windows desktop build; web profile not yet tested.
- A dedicated workspace is required because DSH disables the composer for blank sessions without one. See [docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md).

[1.1.0]: https://github.com/prog656/dsh-one-click-new-session/releases/tag/v1.1.0
[1.0.1]: https://github.com/prog656/dsh-one-click-new-session/releases/tag/v1.0.1
[1.0.0]: https://github.com/prog656/dsh-one-click-new-session/releases/tag/v1.0.0
