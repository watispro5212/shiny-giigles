const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const pollEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a quick reaction poll.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('Option 1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Option 2')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Option 3')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Option 4')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Option 5')
                .setRequired(false)),
    cooldown: 30,
    async execute(interaction, client) {
        const question = interaction.options.getString('question');
        const options = [];

        for (let i = 1; i <= 5; i++) {
            const opt = interaction.options.getString(`option${i}`);
            if (opt) options.push(opt);
        }

        const description = options
            .map((opt, i) => `${pollEmojis[i]} ${opt}`)
            .join('\n\n');

        const pollEmbed = embedBuilder({
            title: `📊 ${question}`,
            description,
            color: '#3498DB',
            footer: `Poll by ${interaction.user.tag} • React to vote!`
        });

        const msg = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        for (let i = 0; i < options.length; i++) {
            await msg.react(pollEmojis[i]);
        }
    },
};
