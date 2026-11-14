# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

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

[1.0.0]: https://github.com/prog656/dsh-one-click-new-session/releases/tag/v1.0.0
