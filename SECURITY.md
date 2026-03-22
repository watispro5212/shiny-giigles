# Security Policy — Nexus Protocol

## Supported Versions

| Version | Status | Support |
|---------|--------|---------|
| 3.x     | ✅ Current | Full security patches |
| 2.x     | ⚠️ Legacy  | Critical patches only |
| < 2.0   | ❌ EOL     | No support |

## Security Architecture

Nexus Protocol implements the following security measures:

### Bot-Level Security
- **Owner Gate** — Root commands restricted to a single hardcoded user ID
- **Blacklist System** — Severed operatives cannot use any bot functions
- **Cooldown Engine** — Per-command, per-user rate limiting prevents abuse
- **Guild-Only Lock** — All commands blocked in DMs
- **Module Toggles** — Server admins can disable entire categories (economy, casino, fun, leveling)
- **Anti-Spam Detection** — Auto-moderation for message flooding
- **Bad Word Filter** — Configurable per-server word blacklist
- **Error Isolation** — Double try-catch pattern prevents command crashes from killing the bot
- **Memory Leak Prevention** — Automatic pruning of expired tracking data
- **Input Validation** — Discord.js slash command option types enforce input constraints

### Infrastructure Security
- **Environment Variables** — Tokens and credentials stored in `.env`, never committed
- **Sharded Architecture** — Isolated shard processes prevent cascade failures
- **MongoDB Authentication** — Secure connection string with Atlas TLS
- **Graceful Error Handling** — `unhandledRejection` and `uncaughtException` catches

## Reporting a Vulnerability

> ⚠️ **Do NOT open public GitHub issues for security vulnerabilities.**

1. Email **williamdelilah3@gmail.com** or **altericjohnson2@gmail.com** with:
   - Clear description of the vulnerability
   - Steps to reproduce (if possible)
   - Affected files, versions, or logs
   - Severity assessment (Critical / High / Medium / Low)

2. We will acknowledge your report within **48 hours**

3. We will provide a fix timeline within **7 days**

4. Public disclosure is coordinated after a patch is released

## Security Contact

**Email:** williamdelilah3@gmail.com, altericjohnson2@gmail.com  
**Response SLA:** 48 hours

---

*Thank you for helping keep the Nexus Protocol secure.*