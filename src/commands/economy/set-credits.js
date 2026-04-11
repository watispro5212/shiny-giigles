const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User'); // Assuming this is the model name for economy

module.exports = {
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-credits')
        .setDescription('Directly modify an operative\'s credit allocation.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The operative to modify.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The new credit balance.')
                .setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

        try {
            await User.findOneAndUpdate(
                { userId: target.id },
                { $set: { balance: amount } },
                { upsert: true }
            );

            const economyEmbed = embedBuilder({
                title: '💳 Registry Mod // Success',
                description: `**Target:** ${target.tag}\n**New Balance:** \`${amount.toLocaleString()}\` credits`,
                color: '#2ECC71'
            });

            await interaction.reply({ embeds: [economyEmbed] });
        } catch (error) {
            console.error('Set-credits error:', error);
            await interaction.reply({ content: 'Failed to modify global economy registry.', ephemeral: true });
        }
    },
};
