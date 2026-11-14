# Security Policy

This plugin runs inside the DSH renderer with the user's own permissions. It only reads/writes a local scratch folder and calls first-party client services; it does not phone home, collect telemetry, or touch credentials.

## Supported versions

| Version | Supported |
| --- | --- |
| 1.0.x | ✅ |

## Reporting a vulnerability

**Please do not open a public issue for security problems.** Use GitHub's private vulnerability reporting: repository → **Security** tab → **Report a vulnerability**, or open an issue that only says "security concern, please contact me" so we can move to a private channel.

Include: affected version, impact, reproduction steps, and a suggested fix if you have one. You can expect an acknowledgement within 7 days.

## What is out of scope

Issues in DeepSeek Harness itself, in other plugins, or in third-party desktop shells should go to their respective maintainers.
