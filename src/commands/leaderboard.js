const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the top 10 richest users based on net worth.'),
    async execute(interaction) {
        
        await interaction.deferReply();
        const lb = economy.getLeaderboard();

        if (lb.length === 0) {
            return interaction.editReply({ 
                embeds: [createEmbed({
                    title: '🏆 Economy Leaderboard',
                    description: 'No one has any money yet!',
                    color: '#00FFCC'
                })]
            });
        }

        // Fetch Discord usernames for the top IDs
        // We do this concurrently to make it fast
        const promises = lb.map(async (entry, index) => {
            let tag = 'Unknown User';
            try {
                // Check cache first, then fetch
                const user = interaction.client.users.cache.get(entry.id) || await interaction.client.users.fetch(entry.id);
                tag = user.username;
            } catch (err) {
                // If they deleted their account or left and API fails
            }
            
            let medal = '🏅';
            if (index === 0) medal = '🥇';
            if (index === 1) medal = '🥈';
            if (index === 2) medal = '🥉';

            return `${medal} **${tag}** — \`${entry.net.toLocaleString()} Credits\``;
        });

        const lines = await Promise.all(promises);

        const embed = createEmbed({
            title: '🏆 Economy Net Worth Leaderboard',
            description: lines.join('\n\n'),
            color: '#F1C40F'
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
