const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Adjusts the transmission throttling delay for the current sector.')
        .addIntegerOption(option => 
            option.setName('seconds')
                .setDescription('The throttle duration in seconds (0 to disable).')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600))
        ,
    async execute(interaction) {
        const seconds = interaction.options.getInteger('seconds');
        const channel = interaction.channel;

        try {
            await channel.setRateLimitPerUser(seconds);

            logger.info(`${interaction.user.tag} set slowmode in #${channel.name} to ${seconds}s`);

            const desc = seconds === 0 
                ? '\`[STATUS]\` Sector transmission throttling has been **DISABLED**.' 
                : `\`[STATUS]\` Sector transmission throttling active. \nEntities must wait **${seconds} seconds** between data bursts.`;

            const embed = createEmbed({
                title: '⏱️ Transmission Throttle Updated',
                description: desc,
                color: '#00FFCC',
                footer: 'Nexus Security | SEC-THROTTLE-SET'
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            logger.error(`Failed to set slowmode in #${channel.name}: ${error}`);
            await interaction.reply({
                embeds: [createEmbed({
                    title: '❌ Override Failed',
                    description: '\`[FATAL]\` Could not adjust sector throttle. Check uplink permissions.',
                    color: 0xED4245
                })],
                flags: 64
            });
        }
    },
};
