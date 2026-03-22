const Collection = require('discord.js').Collection;

class CooldownManager {
    constructor() {
        // Map<commandName, Map<userId, expiresAt>>
        this.cooldowns = new Collection();
    }

    /**
     * Check if a user is on cooldown for a command.
     * @param {string} commandName 
     * @param {string} userId 
     * @param {number} durationMs - Cooldown duration in milliseconds
     * @returns {{ onCooldown: boolean, remaining: number }} 
     */
    check(commandName, userId, durationMs = 3000) {
        if (!this.cooldowns.has(commandName)) {
            this.cooldowns.set(commandName, new Collection());
        }

        const timestamps = this.cooldowns.get(commandName);
        const now = Date.now();

        if (timestamps.has(userId)) {
            const expiresAt = timestamps.get(userId);
            if (now < expiresAt) {
                const remaining = Math.ceil((expiresAt - now) / 1000);
                return { onCooldown: true, remaining };
            }
        }

        // Set new cooldown
        timestamps.set(userId, now + durationMs);

        // Auto-cleanup after expiry
        setTimeout(() => timestamps.delete(userId), durationMs);

        return { onCooldown: false, remaining: 0 };
    }

    /**
     * Reset a user's cooldown for a specific command.
     */
    reset(commandName, userId) {
        if (this.cooldowns.has(commandName)) {
            this.cooldowns.get(commandName).delete(userId);
        }
    }
}

module.exports = new CooldownManager();
