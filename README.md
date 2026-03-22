# Nexus Protocol

<div align="center">

**⚡ Elite-Tier Discord Integration. Neural Economy. Real-Time Diagnostics. ⚡**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-BSL-FF4444?style=for-the-badge)](LICENSE)
[![Commands](https://img.shields.io/badge/Commands-62+-00FFCC?style=for-the-badge)](https://github.com/watispro5212/shiny-giigles)
[![Version](https://img.shields.io/badge/Version-3.0.0-BC13FE?style=for-the-badge)](CHANGELOG.md)

</div>

---

## Overview

Nexus Protocol is a high-performance Discord bot featuring a neural economy system, casino games, leveling, advanced moderation, and a full companion website — all wrapped in a cyberpunk aesthetic.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Discord.js v14** | Discord API gateway |
| **Node.js 18+** | Runtime environment |
| **MongoDB + Mongoose** | Persistent data storage |
| **Canvas** | Dynamic rank card generation |
| **Nodemon** | Development hot-reload |

## Features

### 🔧 Utility (13 commands)
`ping` · `info` · `serverinfo` · `userinfo` · `avatar` · `servericon` · `math` · `timer` · `remind` · `poll` · `translate` · `weather` · `profile`

### 💰 Economy (9 commands)
`balance` · `daily` · `work` · `rob` · `transfer` · `leaderboard` · `shop` · `buy` · `inventory`

### 🎰 Casino (3 commands)
`blackjack` · `slots` · `coinflip`

### 📈 Leveling (2 commands)
`rank` · `leaderboard`

### 🛡️ Moderation (10 commands)
`ban` · `kick` · `warn` · `purge` · `lock` · `unlock` · `slowmode` · `say` · `verify-setup` · `ticket-setup`

### 🎲 Fun (9 commands)
`8ball` · `roll` · `rps` · `trivia` · `hack` · `emojify` · `joke` · `fact` · `quote`

### ⚡ Advanced Operations (4 commands)
`cyber-heist` · `giveaway` · `network-stats` · `shards`

### 📸 Media (4 commands)
`cat` · `dog` · `meme` · `urban`

### 🔐 Owner-Only (8 commands, hidden)
`shutdown` · `eval` · `set-credits` · `set-level` · `announce` · `blacklist` · `server-list` · `reload`

## Security Architecture

Nexus Protocol implements a multi-layered security system:

| Layer | Protection |
|-------|-----------|
| **Blacklist Gate** | Severed operatives cannot execute any command |
| **Guild-Only Lock** | Commands blocked in DMs |
| **Owner Command Gate** | Root commands restricted to a single user ID |
| **Cooldown Engine** | Per-command, per-user rate limiting (category-based) |
| **Module Toggle** | Server admins can disable entire command categories |
| **Anti-Spam** | Message-level spam detection and auto-moderation |
| **Bad Word Filter** | Configurable per-server word blacklist |
| **Permission Checks** | Role-based access for moderation commands |

## Project Structure

```
nexus-protocol/
├── src/
│   ├── bot.js              # Client initialization
│   ├── index.js             # Shard manager
│   ├── commands/            # 62 slash commands
│   ├── events/              # Event handlers
│   ├── models/              # Mongoose schemas
│   └── utils/               # Shared utilities
│       ├── embed.js          # Embed builder
│       ├── logger.js         # Console logger
│       ├── ownerGate.js      # Owner ID verification
│       ├── cooldownManager.js # Rate limiting
│       ├── EconomyManager.js  # User data CRUD
│       └── ShopManager.js     # Item catalog
├── *.html                   # Companion website (9 pages)
├── style.css                # Website styles
├── script.js                # Website interactivity
├── deploy-commands.js       # Slash command registration
└── package.json
```

## Installation

```bash
# Clone the repository
git clone https://github.com/watispro5212/shiny-giigles.git
cd shiny-giigles

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

```env
TOKEN=your_discord_bot_token
CLIENT_ID=your_application_client_id
MONGODB_URI=your_mongodb_connection_string
GUILD_ID=your_dev_guild_id  # Optional, for faster development
```

### Running

```bash
# Production
npm start

# Development (hot-reload)
npm run dev

# Deploy slash commands
node deploy-commands.js
```

## Companion Website

The Nexus Protocol includes a full companion website with:
- **Home** — Feature showcase with animated stats and live operations feed
- **Commands** — Searchable, filterable command reference
- **Wiki** — Technical glossary and system documentation
- **Staff** — Team profiles
- **Premium** — Tier comparison
- **Changelog** — Version history timeline
- **Status** — Real-time shard diagnostics
- **Privacy & Terms** — Legal documentation

## Authors

**watispro5212** · **watispro1**

## License

This project is licensed under the [Nexus BSL](LICENSE) — see the LICENSE file for details.
