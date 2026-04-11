const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Intercepts a humorous data packet from the cloud network.'),
    async execute(interaction) {
        await interaction.deferReply();

        try {
            const apiUrl = process.env.MEME_API_URL || 'https://meme-api.com/gimme';
            const response = await axios.get(apiUrl);
            const data = response.data;

            const memeEmbed = embedBuilder({
                title: data.title || 'Humor Packet Intercepted',
                description: `**Source:** \`r/${data.subreddit}\` | **Author:** \`${data.author}\``,
                image: data.url,
                color: '#F1C40F'
            });

            await interaction.editReply({ embeds: [memeEmbed] });
        } catch (error) {
            console.error('Meme fetch error:', error);
            await interaction.editReply({ 
                content: 'Failed to intercept humor packet. The cloud network may be scrambled.' 
            });
        }
    },
};
