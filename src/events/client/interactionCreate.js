const { Events, Collection } = require('discord.js');
const logger = require('../../utils/logger');
const embedBuilder = require('../../utils/embedBuilder');
const BlacklistEntry = require('../../models/BlacklistEntry');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        logger.command(interaction.commandName, interaction.user.tag);

        // ── Blacklist Check ──
        try {
            const isBlacklisted = await BlacklistEntry.findOne({ targetId: interaction.user.id });
            if (isBlacklisted) {
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '🚫 Access Denied',
                        description: `You are blacklisted from the Nexus Protocol.\n**Reason:** ${isBlacklisted.reason}`,
                        color: '#ED4245'
                    })],
                    ephemeral: true
                });
            }
        } catch (err) {
            logger.error('Blacklist check failed (allowing command):', err);
        }

        // ── Owner Only Check ──
        if (command.ownerOnly && !client.owners.includes(interaction.user.id)) {
            logger.warn(`Unauthorized execution attempt of /${command.data.name} by ${interaction.user.tag}`);
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '🔐 Clearance Required',
                    description: 'This command is restricted to **Nexus Protocol Architects** only.',
                    color: '#ED4245'
                })],
                ephemeral: true
            });
        }

        // ── Cooldown System ──
        if (!client.cooldowns.has(command.data.name)) {
            client.cooldowns.set(command.data.name, new Collection());
        }

        const now = Date.now();
        const timestamps = client.cooldowns.get(command.data.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        // Skip cooldown for owners
        const isOwner = client.owners.includes(interaction.user.id);

        if (!isOwner && timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
                return interaction.reply({
                    embeds: [embedBuilder({
                        title: '⏳ Cooldown Active',
                        description: `Please wait **${timeLeft}s** before using \`/${command.data.name}\` again.`,
                        color: '#F1C40F'
                    })],
                    ephemeral: true
                });
            }
        }

        if (!isOwner) {
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        }

        // ── Execute Command ──
        try {
            await command.execute(interaction, client);
        } catch (error) {
            const errorId = Date.now().toString(36).toUpperCase();
            logger.error(`[EXEC_ERR] [ID:${errorId}] /${interaction.commandName}:`, error);

            const errEmbed = embedBuilder({
                title: '⚠️ Execution Error',
                description: `An internal error occurred during protocol execution.\n**Error ID:** \`${errorId}\`\nThis incident has been logged.`,
                color: '#ED4245'
            });

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [errEmbed], ephemeral: true });
                }
            } catch (replyErr) {
                logger.error('Failed to send error response:', replyErr);
            }
        }
    },
};

