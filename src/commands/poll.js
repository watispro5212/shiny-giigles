const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a simple reaction-based poll.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question to ask in the poll.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('options')
                .setDescription('Up to 10 options separated by commas.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const optionsList = interaction.options.getString('options').split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (optionsList.length < 2) {
            return interaction.reply({ content: 'Please provide at least 2 options for a poll.', ephemeral: true });
        }

        if (optionsList.length > 10) {
            return interaction.reply({ content: 'Maximum of 10 options allowed.', ephemeral: true });
        }

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let description = '';

        for (let i = 0; i < optionsList.length; i++) {
            description += `${emojis[i]} ${optionsList[i]}\n\n`;
        }

        const embed = createEmbed({
            title: `📊 ${question}`,
            description: description,
            color: '#3498DB'
        }).setFooter({ text: `Poll by ${interaction.user.tag}` });

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });

        for (let i = 0; i < optionsList.length; i++) {
            await message.react(emojis[i]);
        }
    },
};
