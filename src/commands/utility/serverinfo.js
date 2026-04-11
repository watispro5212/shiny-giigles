const { SlashCommandBuilder, ChannelType } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const verificationLevels = {
    0: 'None',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Very High'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Comprehensive scan of current guild parameters.'),
    cooldown: 10,
    async execute(interaction, client) {
        const { guild } = interaction;

        const totalMembers = guild.memberCount;
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        const humanCount = totalMembers - botCount;

        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
        const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;
        const forums = guild.channels.cache.filter(c => c.type === ChannelType.GuildForum).size;
        const stages = guild.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size;

        const serverEmbed = embedBuilder({
            title: `🖥️ Node Identity 
            description: `**ID:** \`${guild.id}\`\n**Owner:** <@${guild.ownerId}>\n**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
            fields: [
                { name: '👥 Entity Density', value: `Total: \`${totalMembers}\`\nHumans: \`${humanCount}\`\nBots: \`${botCount}\``, inline: true },
                { name: '📡 Channel Matrix', value: `Text: \`${textChannels}\` | Voice: \`${voiceChannels}\`\nCategories: \`${categories}\` | Forums: \`${forums}\`\nStages: \`${stages}\``, inline: true },
                { name: '🔐 Security', value: `Verification: \`${verificationLevels[guild.verificationLevel] || 'Unknown'}\`\nRoles: \`${guild.roles.cache.size}\``, inline: true },
                { name: '🚀 Boost Status', value: `Level: \`${guild.premiumTier}\`\nBoosters: \`${guild.premiumSubscriptionCount || 0}\``, inline: true },
                { name: '🌐 Locale', value: `\`${guild.preferredLocale}\`\nShard: \`#${guild.shardId}\``, inline: true },
                { name: '🏷️ Vanity', value: guild.vanityURLCode ? `\`discord.gg/${guild.vanityURLCode}\`` : '`None`', inline: true }
            ],
            color: '#BC82FF',
            thumbnail: guild.iconURL({ dynamic: true, size: 512 }),
            image: guild.bannerURL({ size: 1024 }) || undefined
        });

        await interaction.reply({ embeds: [serverEmbed] });
    },
};
