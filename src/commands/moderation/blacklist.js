const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const BlacklistEntry = require('../../models/BlacklistEntry');

module.exports = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Permanently restrict an entity from accessing the protocol.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The operative to de-authorize.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The protocol violation reason.')
                .setRequired(false))
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        try {
            await BlacklistEntry.findOneAndUpdate(
                { targetId: target.id },
                { 
                    targetTag: target.tag,
                    reason: reason,
                    moderatorId: interaction.user.id,
                    timestamp: new Date()
                },
                { upsert: true }
            );

            const blacklistEmbed = embedBuilder({
                title: '🚫 Protocol Exclusion // Success',
                description: `**Target:** ${target.tag} (\`${target.id}\`)\n**Status:** DE-AUTHORIZED\n**Reason:** ${reason}`,
                color: '#ED4245'
            });

            await interaction.reply({ embeds: [blacklistEmbed] });
        } catch (error) {
            console.error('Blacklist error:', error);
            await interaction.reply({ content: 'Failed to update global blacklist registry.', ephemeral: true });
        }
    },
};
