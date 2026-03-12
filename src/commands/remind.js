const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('Set a personal reminder.')
        .addStringOption(option => 
            option.setName('time')
                .setDescription('Time for the reminder (e.g., 10s, 5m, 1h).')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('What I should remind you about.')
                .setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const reason = interaction.options.getString('reason');

        const timeMatch = timeStr.match(/^(\d+)([smh])$/);
        if (!timeMatch) {
            return interaction.reply({ content: 'Invalid time format. Use something like 10s, 5m, or 1h.', ephemeral: true });
        }

        const value = parseInt(timeMatch[1]);
        const unit = timeMatch[2];

        let ms = 0;
        if (unit === 's') ms = value * 1000;
        else if (unit === 'm') ms = value * 60 * 1000;
        else if (unit === 'h') ms = value * 60 * 60 * 1000;

        if (ms > 24 * 60 * 60 * 1000) {
            return interaction.reply({ content: 'Reminder cannot be longer than 24 hours.', ephemeral: true });
        }

        const embed = createEmbed({
            title: '⏰ Reminder Set',
            description: `I will remind you about: **${reason}** in **${timeStr}**.`,
            color: '#F1C40F'
        });

        await interaction.reply({ embeds: [embed], ephemeral: true });

        setTimeout(async () => {
            try {
                const reminderEmbed = createEmbed({
                    title: '🔔 Reminder!',
                    description: `Hey! You asked me to remind you about: **${reason}**`,
                    color: '#E67E22'
                });

                await interaction.user.send({ embeds: [reminderEmbed] });
            } catch (error) {
                console.warn(`Could not send DM to ${interaction.user.tag} for reminder.`);
            }
        }, ms);
    },
};
