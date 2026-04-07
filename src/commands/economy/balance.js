const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your wallet, bank, and net worth.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to check.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target') || interaction.user;

        let userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!userData) {
            userData = new User({ userId: target.id, guildId: interaction.guild.id });
            await userData.save();
        }

        const netWorth = userData.balance + userData.bank;

        // Get rank in this guild
        const richerCount = await User.countDocuments({
            guildId: interaction.guild.id,
            $expr: { $gt: [{ $add: ['$balance', '$bank'] }, netWorth] }
        });
        const rank = richerCount + 1;

        await interaction.reply({
            embeds: [embedBuilder({
                title: `💳 ${target.displayName}'s Financial Report`,
                fields: [
                    { name: '💵 Wallet', value: `\`$${userData.balance.toLocaleString()}\``, inline: true },
                    { name: '🏦 Bank', value: `\`$${userData.bank.toLocaleString()}\``, inline: true },
                    { name: '💎 Net Worth', value: `\`$${netWorth.toLocaleString()}\``, inline: true },
                    { name: '📊 Guild Rank', value: `\`#${rank}\``, inline: true },
                    { name: '📈 Total Earned', value: `\`$${(userData.totalEarned || 0).toLocaleString()}\``, inline: true },
                    { name: '🔥 Streak', value: `\`${userData.streak || 0} days\``, inline: true },
                ],
                color: '#2ECC71',
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })]
        });
    },
};
