const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const economy = require('../utils/EconomyManager');

function getXpRequirement(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View a comprehensive operative dossier.')
        .addUserOption(opt => 
            opt.setName('target')
                .setDescription('The operative to scan.')
                .setRequired(false)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const target = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(target.id).catch(() => null);

        if (target.bot) {
            return interaction.editReply({ 
                embeds: [createEmbed({ title: '❌ Invalid Target', description: 'Artificial constructs do not have dossiers.', color: '#ED4245' })],
            });
        }

        const data = await economy.getUser(target.id, interaction.guild.id);
        const requiredXp = getXpRequirement(data.level);
        const netWorth = data.wallet + data.bank;
        const inventoryCount = data.inventory ? data.inventory.length : 0;

        // XP progress bar
        const percent = Math.min(100, (data.xp / requiredXp) * 100);
        const barSize = 12;
        const filledChars = Math.round((percent / 100) * barSize);
        const bar = '█'.repeat(filledChars) + '░'.repeat(barSize - filledChars);

        // Rank
        const allUsers = await require('../models/User').find({ guildId: interaction.guild.id }).sort({ xp: -1, level: -1 });
        const rank = allUsers.findIndex(u => u.userId === target.id) + 1;

        // Streak info
        const streakDisplay = data.dailyStreak || 0;

        // Clearance level title
        let clearance = '🔰 Recruit';
        if (data.level >= 5) clearance = '🟢 Operative';
        if (data.level >= 10) clearance = '🔵 Agent';
        if (data.level >= 20) clearance = '🟣 Specialist';
        if (data.level >= 35) clearance = '🟡 Commander';
        if (data.level >= 50) clearance = '🔴 Director';
        if (data.level >= 75) clearance = '⚡ Elite';
        if (data.level >= 100) clearance = '👑 Nexus Overlord';

        const joinDate = member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'Unknown';

        const embed = createEmbed({
            title: `📋 Operative Dossier: ${target.username}`,
            thumbnail: target.displayAvatarURL({ dynamic: true, size: 512 }),
            fields: [
                { name: '🎖️ Clearance', value: `${clearance}`, inline: true },
                { name: '📊 Rank', value: `#${rank || 'N/A'}`, inline: true },
                { name: '📈 Level', value: `\`${data.level}\``, inline: true },
                { name: '🧬 XP Progress', value: `\`[${bar}]\` ${Math.floor(percent)}%\n\`${data.xp}\` / \`${requiredXp}\` XP`, inline: false },
                { name: '💰 Net Worth', value: `\`${netWorth.toLocaleString()}\` CR`, inline: true },
                { name: '🎒 Inventory', value: `\`${inventoryCount}\` items`, inline: true },
                { name: '🔥 Daily Streak', value: `\`${streakDisplay}\` cycles`, inline: true },
                { name: '📅 Joined Sector', value: joinDate, inline: true },
            ],
            color: '#00FFCC',
            footer: `Nexus Intelligence Bureau | Profile Scan Complete`
        });

        await interaction.editReply({ embeds: [embed] });
    },
};
