const { Events } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');
const GuildConfig = require('../models/GuildConfig');

// Anti-spam cooldown (1 minute for XP)
const cooldowns = new Set();
const COOLDOWN_MS = 30000;

// Spam tracker (5 messages in 5 seconds)
const spamTracker = new Map();
const SPAM_LIMIT = 5;
const SPAM_TIME = 5000; 

// Auto-prune spam tracker every 60 seconds to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [userId, timestamps] of spamTracker.entries()) {
        const recent = timestamps.filter(t => now - t < SPAM_TIME);
        if (recent.length === 0) {
            spamTracker.delete(userId);
        } else {
            spamTracker.set(userId, recent);
        }
    }
}, 60000);

// XP required = 100 * (level ^ 1.5)
function getXpRequirement(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        // Ignore bots and webhooks
        if (message.author.bot || !message.guild) return;

        const userId = message.author.id;
        const guildId = message.guild.id;

        // Fetch Guild Config
        let config = await GuildConfig.findOne({ guildId });
        if (!config) config = { levelingEnabled: true, antiSpam: false, badWords: [] }; // Fallback

        // --- AUTO-MODERATION: BAD WORDS ---
        if (config.badWords && config.badWords.length > 0) {
            const contentLimit = message.content.toLowerCase();
            const containsBadWord = config.badWords.some(word => contentLimit.includes(word.toLowerCase()));

            if (containsBadWord) {
                try {
                    await message.delete();
                    await message.channel.send({
                        content: `<@${userId}>`,
                        embeds: [createEmbed({ title: '🚨 Action Blocked', description: 'Your message contained blacklisted terminology and was removed.', color: '#ED4245' })]
                    });
                } catch (e) { /* ignore if missing perms */ }
                return; // Stop processing further
            }
        }

        // --- AUTO-MODERATION: ANTI-SPAM ---
        if (config.antiSpam) {
            const now = Date.now();
            if (!spamTracker.has(userId)) {
                spamTracker.set(userId, []);
            }
            
            const userMessages = spamTracker.get(userId);
            // Remove messages older than SPAM_TIME
            const recentMessages = userMessages.filter(timestamp => now - timestamp < SPAM_TIME);
            recentMessages.push(now);
            spamTracker.set(userId, recentMessages);

            if (recentMessages.length > SPAM_LIMIT) {
                try {
                    await message.delete();
                    await message.channel.send({
                        content: `<@${userId}>`,
                        embeds: [createEmbed({ title: '⚠️ Slow Down!', description: 'You are sending messages too quickly. Please wait a moment.', color: '#E67E22' })]
                    });
                } catch (e) { /* ignore */ }
                return; // Stop processing further
            }
        }

        // --- LEVELING MODULE CHECK ---
        if (!config.levelingEnabled) return;

        // Check if user is on cooldown to prevent spam grinding XP
        if (cooldowns.has(userId)) return;

        // Apply XP cooldown
        cooldowns.add(userId);
        setTimeout(() => cooldowns.delete(userId), COOLDOWN_MS);

        // Fetch user data
        const data = await economy.getUser(userId, guildId);

        // Grant 20 to 35 XP (Boosted)
        const xpGained = Math.floor(Math.random() * 16) + 20;
        data.xp += xpGained;

        // Level Up Logic (While loop to handle potential multi-level jumps)
        let leveledUp = false;
        let totalReward = 0;
        
        while (data.xp >= getXpRequirement(data.level)) {
            data.xp -= getXpRequirement(data.level);
            data.level += 1;
            leveledUp = true;
            
            const reward = data.level * 500; // E.g., level 5 = 2500 credits
            data.wallet += reward;
            totalReward += reward;
        }

        if (leveledUp) {
            const embed = createEmbed({
                title: '🎉 Level Up!',
                description: `Congratulations <@${userId}>, you reached **Level ${data.level}**!\n\nYou earned **${totalReward.toLocaleString()} Credits** and ascended in the Nexus!`,
                color: '#FEE75C'
            });

            // Try to find a good channel to send the message in
            try {
                await message.channel.send({ content: `<@${userId}>`, embeds: [embed] });
            } catch (err) {
                // Ignore if bot can't send messages there
            }
        }

        // Save
        await data.save();
    },
};
