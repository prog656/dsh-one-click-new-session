## What changed

<!-- Short summary -->

## Why

<!-- Link the issue: Closes #123 -->

## Checklist

- [ ] `node --check install.mjs` passes
- [ ] `node install.mjs --dry-run --profile <temp-dir>` shows the expected plan
- [ ] Installed and clicked through in a real DSH window (composer enabled)
- [ ] `src/lib/client.js` still keeps the `__DSH_BLANK_SESSION_DIR__` placeholder and label constants at the top
- [ ] No DSH source code, `app.asar` contents, credentials, or personal paths included
- [ ] `CHANGELOG.md` and relevant docs updated
