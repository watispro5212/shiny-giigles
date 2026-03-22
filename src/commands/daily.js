const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

const DAILY_REWARD = 1000;
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Requests a daily credit allocation from the Nexus Treasury.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const data = await economy.getUser(userId, interaction.guild.id);

        const now = Date.now();
        const last = data.lastDaily || 0;
        const diff = now - last;

        if (diff < COOLDOWN_MS) {
            const nextDrop = new Date(last + COOLDOWN_MS);
            return interaction.reply({ 
                embeds: [createEmbed({
                    title: '⏳ Allocation Pending',
                    description: `\`[TREASURY]\` Daily allotment already dispersed. \nNext sync available: <t:${Math.floor(nextDrop.getTime() / 1000)}:R>`,
                    color: '#FF4B2B'
                })],
                flags: 64 
            });
        }

        await interaction.reply({
            embeds: [createEmbed({
                title: '🎁 Processing Allotment...',
                description: '`[AUTHORIZING]` biometric scan... Accessing Treasury reserves.',
                color: '#FFCC00'
            })]
        });

        const streak = (diff > COOLDOWN_MS * 2) ? 1 : (data.dailyStreak || 0) + 1;
        const streakBonus = Math.min(streak * 100, 2000);
        const totalReward = DAILY_REWARD + streakBonus;

        data.wallet += totalReward;
        data.lastDaily = now;
        data.dailyStreak = streak;
        await data.save();

        const embed = createEmbed({
            title: '✅ Allotment Successful',
            description: `You have received **${totalReward.toLocaleString()} Credits**.${streakBonus > 0 ? `\n🔥 Streak bonus: **+${streakBonus.toLocaleString()} CR**` : ''}\nCurrent Liquid Balance: **${data.wallet.toLocaleString()} CR**.`,
            fields: [
                { name: '🔥 Sync Streak', value: `\`${streak}\` consecutive cycles`, inline: true },
                { name: '💎 Next Bonus', value: streak < 20 ? `\`${Math.min((streak + 1) * 100, 2000)}\` CR` : '`MAX`', inline: true }
            ],
            color: '#00FFCC',
            footer: 'Nexus Treasury | Allocation Protocol: Secure'
        });

        setTimeout(async () => {
            await interaction.editReply({ embeds: [embed] });
        }, 2000);
    },
};
