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

        
        const richerCount = await User.countDocuments({
            guildId: interaction.guild.id,
            $expr: { $gt: [{ $add: ['$balance', '$bank'] }, netWorth] }
        });
        const rank = richerCount + 1;

        await interaction.reply({
            embeds: [embedBuilder({
                title: `${target.displayName}'s Finances`,
                fields: [
                    { name: 'Wallet', value: `$${userData.balance.toLocaleString()}`, inline: true },
                    { name: 'Bank Account', value: `$${userData.bank.toLocaleString()}`, inline: true },
                    { name: 'Total Assets', value: `$${netWorth.toLocaleString()}`, inline: true },
                    { name: 'Local Rank', value: `#${rank}`, inline: true },
                    { name: 'Lifetime Earnings', value: `$${(userData.totalEarned || 0).toLocaleString()}`, inline: true },
                    { name: 'Daily Streak', value: `${userData.streak || 0} days`, inline: true },
                ],
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })]
        });
    },
};
