const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View the richest operatives in this server.'),
    cooldown: 10,
    async execute(interaction, client) {
        const users = await User.find({ guildId: interaction.guild.id })
            .sort({ balance: -1 })
            .limit(10);

        if (users.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '📊 Leaderboard — Empty',
                    description: 'No economic activity detected in this node.',
                    color: '#ED4245'
                })]
            });
        }

        const medals = ['🥇', '🥈', '🥉'];

        const leaderboardLines = await Promise.all(
            users.map(async (u, i) => {
                const prefix = medals[i] || `\`#${i + 1}\``;
                const netWorth = u.balance + u.bank;
                try {
                    const member = await interaction.guild.members.fetch(u.userId).catch(() => null);
                    const name = member ? member.displayName : `Unknown (${u.userId.slice(-4)})`;
                    return `${prefix} **${name}** — $${netWorth.toLocaleString()} (💵 $${u.balance.toLocaleString()} | 🏦 $${u.bank.toLocaleString()})`;
                } catch {
                    return `${prefix} **Unknown** — $${netWorth.toLocaleString()}`;
                }
            })
        );

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🏆 Wealth Leaderboard',
                description: leaderboardLines.join('\n'),
                color: '#F1C40F',
                footer: `${interaction.guild.name} • Top 10`
            })]
        });
    },
};
