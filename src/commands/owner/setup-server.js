const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const SUPPORT_GUILD_ID = '1492345037848186930';

// ═══════════════════════════════════════════════════════════
// FULL ROLE REGISTRY (from server.md) — ordered lowest→highest
// ═══════════════════════════════════════════════════════════
const ROLES = [
    {
        name: '🔇 Muted', color: '#333333', hoist: false,
        permissions: [],
        deny: ['SendMessages', 'SendMessagesInThreads', 'AddReactions', 'CreatePublicThreads', 'CreatePrivateThreads', 'Speak']
    },
    {
        name: '🤖 Neural Engine', color: '#50FA7B', hoist: false,
        permissions: ['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles', 'ReadMessageHistory', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🌑 New Entity', color: '#606060', hoist: false,
        permissions: ['ViewChannel', 'SendMessages']  // restricted by category overrides
    },
    {
        name: '🧬 Operative', color: '#F0F0F0', hoist: true,
        permissions: ['SendMessages', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseApplicationCommands', 'Connect', 'Speak', 'Stream', 'UseVAD', 'ChangeNickname', 'ViewChannel']
    },
    { name: '🎖️ Veteran', color: '#A0A0A0', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '🌱 Level 10+', color: '#69FF47', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '⭐ Level 25+', color: '#FFC107', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    { name: '🔥 Level 50+', color: '#FF4D4D', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker'] },
    { name: '🥇 Early Operative', color: '#FFB86C', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker'] },
    { name: '🛠️ Contributor', color: '#50FA7B', hoist: false, permissions: ['EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis', 'CreatePublicThreads'] },
    { name: '🏆 Event Winner', color: '#FFD700', hoist: false, permissions: ['AddReactions', 'UseExternalEmojis', 'UseExternalStickers'] },
    {
        name: '💎 Server Booster', color: '#F47FFF', hoist: true,
        permissions: ['ChangeNickname', 'UseExternalEmojis', 'UseExternalStickers', 'PrioritySpeaker', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'Stream']
    },
    {
        name: '🌐 Partner', color: '#BD93F9', hoist: true,
        permissions: ['EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis', 'UseExternalStickers', 'CreatePublicThreads']
    },
    {
        name: '📣 Community Manager', color: '#F9A825', hoist: true,
        permissions: ['ManageEvents', 'CreatePublicThreads', 'MentionEveryone', 'ManageMessages', 'ManageWebhooks', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🔧 Support', color: '#03DAC6', hoist: true,
        permissions: ['ManageMessages', 'CreatePrivateThreads', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '🎯 Support Lead', color: '#00CFFF', hoist: true,
        permissions: ['ManageMessages', 'CreatePrivateThreads', 'ManageThreads', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'AddReactions', 'UseExternalEmojis']
    },
    {
        name: '⚔️ Moderator', color: '#FFBD2E', hoist: true,
        permissions: ['ManageMessages', 'ManageNicknames', 'ModerateMembers', 'KickMembers', 'MoveMembers', 'MuteMembers', 'DeafenMembers', 'ViewAuditLog', 'CreatePublicThreads', 'ManageThreads', 'UseExternalEmojis', 'AddReactions']
    },
    {
        name: '💻 Developer', color: '#BB86FC', hoist: true,
        permissions: ['ManageWebhooks', 'UseApplicationCommands', 'EmbedLinks', 'AttachFiles', 'CreatePublicThreads', 'UseExternalEmojis', 'AddReactions']
    },
    {
        name: '⚡ Head Moderator', color: '#FF6B35', hoist: true,
        permissions: ['KickMembers', 'BanMembers', 'ModerateMembers', 'ManageMessages', 'ManageNicknames', 'ViewAuditLog', 'MoveMembers', 'DeafenMembers', 'MuteMembers', 'CreatePublicThreads', 'CreatePrivateThreads', 'ManageThreads', 'MentionEveryone', 'UseExternalEmojis']
    },
    {
        name: '🛡️ Admin', color: '#FF4444', hoist: true,
        permissions: ['ManageGuild', 'ManageRoles', 'ManageChannels', 'ManageWebhooks', 'KickMembers', 'BanMembers', 'ModerateMembers', 'ManageNicknames', 'MentionEveryone', 'ViewAuditLog', 'ManageEvents', 'ManageMessages', 'CreatePublicThreads', 'CreatePrivateThreads', 'ManageThreads', 'UseExternalEmojis']
    },
    {
        name: '🌟 Co-Founder', color: '#7B2FFF', hoist: true,
        permissions: ['Administrator']
    },
    {
        name: '👑 Founder', color: '#00F5FF', hoist: true,
        permissions: ['Administrator']
    },
];

// ═══════════════════════════════════════════════════════════
// CATEGORY PERMISSION OVERRIDES (from server.md)
// Each entry defines which roles get allow/deny overrides
// ═══════════════════════════════════════════════════════════

function buildCategoryOverrides(roleMap, everyoneId) {
    const P = PermissionsBitField.Flags;

    return {
        '📌 WELCOME & VERIFICATION': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🌑 New Entity'], allow: [P.ViewChannel, P.SendMessages] },
            { id: roleMap['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel] },
            { id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: roleMap['⚡ Head Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
            { id: roleMap['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks] },
        ],
        '📋 INFORMATIONAL': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel] },
            { id: roleMap['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
        ],
        '📡 NEWS & BROADCASTS': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], deny: [P.SendMessages], allow: [P.ViewChannel, P.AddReactions] },
            { id: roleMap['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.MentionEveryone] },
            { id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.MentionEveryone] },
            { id: roleMap['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages] },
        ],
        '💬 CENTRAL HUB': [
            { id: everyoneId, allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads] },
            { id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePublicThreads] },
        ],
        '🤖 BOT ZONE': [
            { id: everyoneId, allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages] },
            { id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages] },
            { id: roleMap['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages] },
        ],
        '🛠️ SUPPORT CENTER': [
            { id: everyoneId, deny: [P.SendMessages], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages] },
            { id: roleMap['🔧 Support'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePrivateThreads] },
            { id: roleMap['🎯 Support Lead'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.CreatePrivateThreads, P.ManageThreads] },
            { id: roleMap['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages] },
        ],
        '💻 DEVELOPMENT HUB': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: roleMap['🛠️ Contributor'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🎯 Support Lead'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['💻 Developer'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
            { id: roleMap['⚡ Head Moderator'], allow: [P.ViewChannel, P.ReadMessageHistory] },
            { id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks] },
            { id: roleMap['🤖 Neural Engine'], allow: [P.ViewChannel, P.SendMessages] },
        ],
        '🌀 THE SINGULARITY': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel] },
            { id: roleMap['🧬 Operative'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads] },
            { id: roleMap['🌐 Partner'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads] },
            { id: roleMap['💎 Server Booster'], allow: [P.ViewChannel, P.SendMessages, P.CreatePublicThreads] },
        ],
        '🔊 VOICE SECTOR': [
            { id: everyoneId, deny: [P.Connect] },
            { id: roleMap['🌑 New Entity'], deny: [P.ViewChannel, P.Connect] },
            { id: roleMap['🧬 Operative'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.UseVAD] },
            { id: roleMap['💎 Server Booster'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.PrioritySpeaker] },
            { id: roleMap['🔥 Level 50+'], allow: [P.PrioritySpeaker] },
            { id: roleMap['🥇 Early Operative'], allow: [P.PrioritySpeaker] },
            { id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.Connect, P.Speak, P.Stream, P.MuteMembers, P.MoveMembers, P.PrioritySpeaker] },
        ],
        '🛡️ COMMAND CENTER': [
            { id: everyoneId, deny: [P.ViewChannel] },
            { id: roleMap['🔧 Support'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: roleMap['🎯 Support Lead'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: roleMap['📣 Community Manager'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: roleMap['💻 Developer'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: roleMap['⚔️ Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory] },
            { id: roleMap['⚡ Head Moderator'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ReadMessageHistory] },
            { id: roleMap['🛡️ Admin'], allow: [P.ViewChannel, P.SendMessages, P.ManageMessages, P.ManageWebhooks, P.ReadMessageHistory] },
        ],
    };
}

// ═══════════════════════════════════════════════════════════
// CHANNEL ARCHITECTURE (from server.md)
// ═══════════════════════════════════════════════════════════
const CATEGORIES = [
    {
        name: '📌 WELCOME & VERIFICATION',
        channels: [
            { name: '👋-welcome', type: ChannelType.GuildText, topic: 'Auto-posted welcome embed with server overview and rules summary.' },
            { name: '📜-rules', type: ChannelType.GuildText, topic: 'The definitive behaviour directives. Read before participating.' },
            { name: '🔐-verification', type: ChannelType.GuildText, topic: 'CAPTCHA completion portal. Complete to gain access.' },
            { name: '🎭-get-roles', type: ChannelType.GuildText, topic: 'Self-role selection panel for notifications and interests.' },
        ]
    },
    {
        name: '📋 INFORMATIONAL',
        channels: [
            { name: '🧭-overview', type: ChannelType.GuildText, topic: 'Brand mission statement and project philosophy.' },
            { name: '🗂️-directory', type: ChannelType.GuildText, topic: 'Clickable index of all server sectors with jump links.' },
            { name: '❔-faq', type: ChannelType.GuildText, topic: 'Common questions and pre-solved inquiries.' },
            { name: '🔗-links', type: ChannelType.GuildText, topic: 'Official portal, GitHub, bot invite, and social links.' },
            { name: '🏅-credits', type: ChannelType.GuildText, topic: 'Acknowledgements for contributors and supporters.' },
            { name: '🤖-bot-info', type: ChannelType.GuildText, topic: 'Overview of all bots in the server.' },
        ]
    },
    {
        name: '📡 NEWS & BROADCASTS',
        channels: [
            { name: '📢-announcements', type: ChannelType.GuildText, topic: 'Global updates and official framework declarations.' },
            { name: '🆙-changelog', type: ChannelType.GuildText, topic: 'Real-time dev logs and version updates.' },
            { name: '🎉-events', type: ChannelType.GuildText, topic: 'Server event schedules and community challenges.' },
            { name: '📊-polls', type: ChannelType.GuildText, topic: 'Community voting on new features and direction.' },
            { name: '🟢-status', type: ChannelType.GuildText, topic: 'Real-time API health and shard uptime reports.' },
            { name: '🤝-partnerships', type: ChannelType.GuildText, topic: 'Network ally announcements and collaborations.' },
            { name: '📦-releases', type: ChannelType.GuildText, topic: 'GitHub release notes for every version tag.' },
        ]
    },
    {
        name: '💬 CENTRAL HUB',
        channels: [
            { name: '💬-general', type: ChannelType.GuildText, topic: 'Primary high-fidelity discourse. All topics welcome.' },
            { name: '🙌-introductions', type: ChannelType.GuildText, topic: 'New operative self-introductions.' },
            { name: '📸-media', type: ChannelType.GuildText, topic: 'Screenshots, clips, artwork, and visual data.' },
            { name: '😂-memes', type: ChannelType.GuildText, topic: 'Community humour. Guidelines still apply.' },
            { name: '⭐-starboard', type: ChannelType.GuildText, topic: 'Auto-pinned messages with 5+ ⭐ reactions.' },
            { name: '🕵️-confessions', type: ChannelType.GuildText, topic: 'Anonymous message submission.' },
            { name: '🔢-counting', type: ChannelType.GuildText, topic: 'Classic counting game. One number per person.' },
        ]
    },
    {
        name: '🤖 BOT ZONE',
        channels: [
            { name: '⌨️-bot-commands', type: ChannelType.GuildText, topic: 'Primary bot command zone.' },
            { name: '📈-level-ups', type: ChannelType.GuildText, topic: 'Automated XP rank-up announcements.' },
            { name: '🌟-rep-board', type: ChannelType.GuildText, topic: 'Reputation leaderboard updates.' },
            { name: '🎁-giveaways', type: ChannelType.GuildText, topic: 'Active and archived giveaways.' },
            { name: '💰-economy-logs', type: ChannelType.GuildText, topic: 'Automated economy transaction logs.' },
        ]
    },
    {
        name: '🛠️ SUPPORT CENTER',
        channels: [
            { name: '📥-open-ticket', type: ChannelType.GuildText, topic: 'Click-to-create ticket panel.' },
            { name: '📚-knowledge-base', type: ChannelType.GuildText, topic: 'Archived resolution guides.' },
            { name: '🐛-bug-reports', type: ChannelType.GuildText, topic: 'Formal logic failure submissions.' },
            { name: '💡-suggestions', type: ChannelType.GuildText, topic: 'Feature proposals with upvote reactions.' },
            { name: '🗒️-bug-tracker', type: ChannelType.GuildText, topic: 'Triaged log of known issues.' },
            { name: '✅-resolved-log', type: ChannelType.GuildText, topic: 'Sanitized closed ticket log.' },
            { name: '🚩-report-user', type: ChannelType.GuildText, topic: 'Private user violation reports.' },
        ]
    },
    {
        name: '💻 DEVELOPMENT HUB',
        channels: [
            { name: '🐙-github-feed', type: ChannelType.GuildText, topic: 'GitHub commits, PRs, and merge events.' },
            { name: '📡-api-diagnostics', type: ChannelType.GuildText, topic: 'Discord API responses and shard health.' },
            { name: '🛡️-security-advisories', type: ChannelType.GuildText, topic: 'Internal CVE and vulnerability disclosures.' },
            { name: '🎨-ui-design', type: ChannelType.GuildText, topic: 'Portal aesthetics and CSS iteration.' },
            { name: '⚙️-tech-talk', type: ChannelType.GuildText, topic: 'Architecture discussion and patterns.' },
            { name: '🧪-staging-reports', type: ChannelType.GuildText, topic: 'Pre-release QA notes and testing.' },
            { name: '📦-dependency-log', type: ChannelType.GuildText, topic: 'npm package updates and audit reports.' },
            { name: '🗺️-roadmap', type: ChannelType.GuildText, topic: 'Sprint board and feature roadmap.' },
        ]
    },
    {
        name: '🌀 THE SINGULARITY',
        channels: [
            { name: '🌌-lore-vault', type: ChannelType.GuildText, topic: 'Nexus Protocol backstory and lore.' },
            { name: '🖼️-art-gallery', type: ChannelType.GuildText, topic: 'Community artwork and submissions.' },
            { name: '🎲-games-lounge', type: ChannelType.GuildText, topic: 'Bot-powered games zone.' },
            { name: '🔥-hot-takes', type: ChannelType.GuildText, topic: 'Weekly debate topic.' },
            { name: '📚-resources', type: ChannelType.GuildText, topic: 'Developer learning materials.' },
            { name: '🚀-showcase', type: ChannelType.GuildText, topic: 'Show off your projects.' },
            { name: '🎵-music-requests', type: ChannelType.GuildText, topic: 'Song request queue.' },
            { name: '🤝-partner-lounge', type: ChannelType.GuildText, topic: 'Exclusive partner channel.' },
            { name: '💎-booster-lounge', type: ChannelType.GuildText, topic: 'Exclusive booster channel.' },
        ]
    },
    {
        name: '🔊 VOICE SECTOR',
        channels: [
            { name: '🎙️-general-voice', type: ChannelType.GuildVoice },
            { name: '🎵-lofi-study', type: ChannelType.GuildVoice },
            { name: '🎮-gaming-vc', type: ChannelType.GuildVoice },
            { name: '🔒-staff-voice', type: ChannelType.GuildVoice },
            { name: '🔴-events-stage', type: ChannelType.GuildStageVoice },
            { name: '💤-afk-lounge', type: ChannelType.GuildVoice },
        ]
    },
    {
        name: '🛡️ COMMAND CENTER',
        channels: [
            { name: '🚨-security-feed', type: ChannelType.GuildText, topic: 'Global audit logs of all infractions.' },
            { name: '🪵-mod-log', type: ChannelType.GuildText, topic: 'Automated log of every mod action.' },
            { name: '⚔️-mod-actions', type: ChannelType.GuildText, topic: 'Manual staff discussion for active cases.' },
            { name: '📊-analytics', type: ChannelType.GuildText, topic: 'Server growth and engagement analytics.' },
            { name: '💬-staff-general', type: ChannelType.GuildText, topic: 'Open coordination for all staff.' },
            { name: '📋-staff-guide', type: ChannelType.GuildText, topic: 'Moderation handbook and protocols.' },
            { name: '💻-dev-ops', type: ChannelType.GuildText, topic: 'Developer sprint coordination.' },
            { name: '🎯-support-ops', type: ChannelType.GuildText, topic: 'Support team ticket coordination.' },
            { name: '⚙️-bot-config', type: ChannelType.GuildText, topic: 'Bot configuration commands only.' },
            { name: '👑-founders-vault', type: ChannelType.GuildText, topic: 'Sovereign leadership channel.' },
        ]
    },
];

// ═══════════════════════════════════════════════════════════
// SELF-ROLE NOTIFICATION ROLES (cosmetic, no server perms)
// ═══════════════════════════════════════════════════════════
const PING_ROLES = [
    { name: 'Announcements',  color: '#5865F2' },
    { name: 'Events',         color: '#5865F2' },
    { name: 'Changelog',      color: '#5865F2' },
    { name: 'Bug Pings',      color: '#5865F2' },
    { name: 'Feature Pings',  color: '#5865F2' },
    { name: 'Giveaway Pings', color: '#5865F2' },
    { name: 'Dev Interest',   color: '#5865F2' },
    { name: 'Design Interest', color: '#5865F2' },
    { name: 'Beta Tester',    color: '#5865F2' },
    { name: 'Open to Partner', color: '#5865F2' },
    { name: 'Gamer',          color: '#5865F2' },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-server')
        .setDescription('Deploy the full Nexus Blueprint to the support server. FOUNDER ONLY.')
        .setDefaultMemberPermissions(0),
    ownerOnly: true,
    cooldown: 0,
    async execute(interaction, client) {
        // Gate: only runs in the support server
        if (interaction.guild.id !== SUPPORT_GUILD_ID) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '❌ Wrong Server',
                    description: `This command can only be run in the official Nexus Support Hub (\`${SUPPORT_GUILD_ID}\`).`,
                    color: '#ED4245'
                })],
                ephemeral: true
            });
        }

        await interaction.deferReply({ ephemeral: true });
        const guild = interaction.guild;
        const log = [];
        const manualSteps = [];

        try {
            // ═══════════════════════════════════════════
            // PHASE 1: CREATE ROLES WITH PERMISSIONS
            // ═══════════════════════════════════════════
            log.push('**═══ PHASE 1: ROLE DEPLOYMENT ═══**');
            const roleMap = {};

            for (const roleDef of ROLES) {
                let role = guild.roles.cache.find(r => r.name === roleDef.name);
                if (role) {
                    log.push(`⏭️ Role exists: \`${roleDef.name}\``);
                    // Update permissions to match blueprint
                    try {
                        const permBits = new PermissionsBitField(
                            (roleDef.permissions || []).map(p => PermissionsBitField.Flags[p]).filter(Boolean)
                        );
                        await role.setPermissions(permBits);
                        await role.setColor(roleDef.color);
                        await role.setHoist(roleDef.hoist);
                        log.push(`  ↻ Updated permissions for \`${roleDef.name}\``);
                    } catch (err) {
                        log.push(`  ⚠️ Could not update \`${roleDef.name}\`: ${err.message}`);
                    }
                } else {
                    try {
                        const permBits = new PermissionsBitField(
                            (roleDef.permissions || []).map(p => PermissionsBitField.Flags[p]).filter(Boolean)
                        );
                        role = await guild.roles.create({
                            name: roleDef.name,
                            color: roleDef.color,
                            hoist: roleDef.hoist,
                            permissions: permBits,
                            reason: 'Nexus Blueprint: Auto-generated role',
                        });
                        log.push(`✅ Created role: \`${roleDef.name}\``);
                    } catch (err) {
                        log.push(`❌ Failed role \`${roleDef.name}\`: ${err.message}`);
                    }
                }
                if (role) roleMap[roleDef.name] = role.id;
            }

            // Handle Muted role deny overrides
            const mutedRole = guild.roles.cache.find(r => r.name === '🔇 Muted');
            if (mutedRole) {
                try {
                    const denyBits = new PermissionsBitField(
                        ['SendMessages', 'SendMessagesInThreads', 'AddReactions', 'CreatePublicThreads', 'CreatePrivateThreads', 'Speak']
                            .map(p => PermissionsBitField.Flags[p])
                    );
                    await mutedRole.setPermissions([]);
                    log.push(`✅ Muted role permissions cleared (denies applied per-category).`);
                } catch (err) {
                    log.push(`⚠️ Muted role perm update failed: ${err.message}`);
                }
            }

            // Create self-role / ping roles
            log.push('\n**═══ PHASE 1B: PING ROLE DEPLOYMENT ═══**');
            for (const pr of PING_ROLES) {
                const existing = guild.roles.cache.find(r => r.name === pr.name);
                if (existing) {
                    log.push(`⏭️ Ping role exists: \`${pr.name}\``);
                } else {
                    try {
                        await guild.roles.create({
                            name: pr.name,
                            color: pr.color,
                            hoist: false,
                            mentionable: true,
                            permissions: [],
                            reason: 'Nexus Blueprint: Self-role / Ping role',
                        });
                        log.push(`✅ Created ping role: \`${pr.name}\``);
                    } catch (err) {
                        log.push(`❌ Failed ping role \`${pr.name}\`: ${err.message}`);
                    }
                }
            }

            // ═══════════════════════════════════════════
            // PHASE 2: CATEGORIES, CHANNELS & OVERRIDES
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 2: SECTOR DEPLOYMENT ═══**');

            // Build permission overrides for categories
            const overridesMap = buildCategoryOverrides(roleMap, guild.id);

            for (const catDef of CATEGORIES) {
                let category = guild.channels.cache.find(
                    c => c.name === catDef.name && c.type === ChannelType.GuildCategory
                );

                // Build overrides for this category
                const catOverrides = overridesMap[catDef.name] || [];
                const validOverrides = catOverrides.filter(o => o.id); // filter out nullish role IDs

                // Add Muted role deny to every category
                if (roleMap['🔇 Muted']) {
                    const P = PermissionsBitField.Flags;
                    validOverrides.push({
                        id: roleMap['🔇 Muted'],
                        deny: [P.SendMessages, P.SendMessagesInThreads, P.AddReactions, P.CreatePublicThreads, P.CreatePrivateThreads, P.Speak]
                    });
                }

                if (!category) {
                    try {
                        category = await guild.channels.create({
                            name: catDef.name,
                            type: ChannelType.GuildCategory,
                            permissionOverwrites: validOverrides,
                            reason: 'Nexus Blueprint: Auto-generated category',
                        });
                        log.push(`📁 Created category: \`${catDef.name}\` (with ${validOverrides.length} permission overrides)`);
                    } catch (err) {
                        log.push(`❌ Failed category \`${catDef.name}\`: ${err.message}`);
                        continue;
                    }
                } else {
                    log.push(`⏭️ Category exists: \`${catDef.name}\``);
                    // Update permission overrides
                    try {
                        await category.permissionOverwrites.set(validOverrides);
                        log.push(`  ↻ Updated ${validOverrides.length} permission overrides`);
                    } catch (err) {
                        log.push(`  ⚠️ Could not update perms: ${err.message}`);
                    }
                }

                for (const chDef of catDef.channels) {
                    const existing = guild.channels.cache.find(
                        c => c.name === chDef.name && c.parentId === category.id
                    );
                    if (existing) {
                        log.push(`  ⏭️ Channel exists: \`${chDef.name}\``);
                        // Sync permissions with category
                        try {
                            await existing.lockPermissions();
                        } catch {}
                    } else {
                        try {
                            await guild.channels.create({
                                name: chDef.name,
                                type: chDef.type,
                                parent: category.id,
                                topic: chDef.topic || null,
                                reason: 'Nexus Blueprint: Auto-generated channel',
                            });
                            log.push(`  ✅ Created: \`${chDef.name}\``);
                        } catch (err) {
                            log.push(`  ❌ Failed \`${chDef.name}\`: ${err.message}`);
                        }
                    }
                }
            }

            // ═══════════════════════════════════════════
            // PHASE 3: AFK CHANNEL CONFIGURATION
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 3: SERVER SETTINGS ═══**');
            try {
                const afkChannel = guild.channels.cache.find(c => c.name === '💤-afk-lounge' && c.type === ChannelType.GuildVoice);
                if (afkChannel) {
                    await guild.setAFKChannel(afkChannel);
                    await guild.setAFKTimeout(300);
                    log.push(`✅ AFK channel set to \`💤-afk-lounge\` (5 min timeout)`);
                }
            } catch (err) {
                log.push(`⚠️ AFK channel setup: ${err.message}`);
            }

            // ═══════════════════════════════════════════
            // PHASE 4: HIDE THIS COMMAND
            // ═══════════════════════════════════════════
            log.push('\n**═══ PHASE 4: COMMAND CONCEALMENT ═══**');
            try {
                const globalCommands = await client.application.commands.fetch();
                const setupCmd = globalCommands.find(c => c.name === 'setup-server');
                if (setupCmd) {
                    log.push('🔒 Command already hidden via `setDefaultMemberPermissions(0)` — only admins see it.');
                }
            } catch (err) {
                log.push(`⚠️ Concealment check: ${err.message}`);
            }

            // ═══════════════════════════════════════════
            // PHASE 5: MANUAL SETUP INSTRUCTIONS
            // ═══════════════════════════════════════════
            manualSteps.push(
                '**1. Verification Bot (Wick/Captcha)**',
                '   → Add [Wick Bot](https://wickbot.com) to the server.',
                '   → Enable CAPTCHA mode in `#🔐-verification`.',
                '   → Set account age minimum: **7 days**.',
                '   → Set mass-join raid threshold: **20+ joins in 60s → auto-lockdown**.',
                '   → Configure: On CAPTCHA pass → remove `🌑 New Entity`, assign `🧬 Operative`.',
                '',
                '**2. Anti-Bot Layer (Beemo)**',
                '   → Add [Beemo](https://beemo.gg) to the server.',
                '   → Start in **Monitor Mode** for 7 days, then switch to **Auto-Ban Mode**.',
                '   → Route auto-ban logs to `#🚨-security-feed`.',
                '',
                '**3. Self-Role Panels (Carl-bot)**',
                '   → Add [Carl-bot](https://carl.gg) and go to **Reaction Roles**.',
                '   → In `#🎭-get-roles`, create **Panel 1 — 🔔 Notifications** (dropdown):',
                '     `@Announcements (📢)`, `@Events (🎉)`, `@Changelog (🆙)`, `@Bug Pings (🐛)`, `@Feature Pings (💡)`, `@Giveaway Pings (🎁)`',
                '   → Create **Panel 2 — 🏷️ Interests** (button):',
                '     `@Dev Interest (💻)`, `@Design Interest (🎨)`, `@Beta Tester (🧪)`, `@Open to Partner (🤝)`, `@Gamer (🎮)`',
                '',
                '**4. Welcome Messages (Carl-bot)**',
                '   → In Carl-bot dashboard, set welcome channel to `#👋-welcome`.',
                '   → Design an embed with server overview, rules link, and role instructions.',
                '',
                '**5. Starboard (Carl-bot or Nexus)**',
                '   → Run `/starboard setup` in the server to set `#⭐-starboard` as the starboard channel.',
                '   → Or configure Carl-bot starboard to auto-pin at **5 ⭐ reactions**.',
                '',
                '**6. Webhooks**',
                '   → `#🆙-changelog` + `#🐙-github-feed`: Create webhooks → paste URL into GitHub Repo → Settings → Webhooks.',
                '   → `#🟢-status`: Create webhook → link to UptimeRobot/BetterUptime.',
                '   → `#📢-announcements`: Create webhook named `Nexus Socials` → link to Zapier for Twitter/YouTube syndication.',
                '   → `#🎯-support-ops`: Optional CRM webhook (Tally/Typeform).',
                '',
                '**7. Moderation Logging**',
                '   → Run `/config log-channel #🪵-mod-log` to route Nexus mod logs.',
                '   → If using MEE6, set its log channel to `#🚨-security-feed`.',
                '',
                '**8. Leveling**',
                '   → Run `/config leveling on` and `/config level-channel #📈-level-ups` for rank-up announcements.',
                '',
                '**9. Suggestions**',
                '   → Run `/config suggestions-channel #💡-suggestions` to route `/suggest` output.',
                '',
                '**10. Founders Vault Access**',
                '   → In `#👑-founders-vault`, manually add a permission override:',
                '     Deny `@everyone` View Channel, Allow only `👑 Founder` and `🌟 Co-Founder` View + Send.',
                '   → This override is NOT synced with the category.',
                '',
                '**11. Staff Voice**',
                '   → In `#🔒-staff-voice`, add a permission override:',
                '     Deny `@everyone` Connect, Allow `⚔️ Moderator+` Connect + Speak.',
                '',
                '**12. Partner & Booster Lounge Access**',
                '   → In `#🤝-partner-lounge`, add override: Allow `🌐 Partner` View + Send.',
                '   → In `#💎-booster-lounge`, add overrides: Allow `💎 Server Booster`, `🔥 Level 50+`, `🥇 Early Operative` View + Send.',
            );

            // ═══════════════════════════════════════════
            // BUILD REPORT
            // ═══════════════════════════════════════════
            const totalRoles = ROLES.length + PING_ROLES.length;
            const totalChannels = CATEGORIES.reduce((acc, c) => acc + c.channels.length, 0);
            const totalCategories = CATEGORIES.length;

            // Truncate log to fit in embed
            const logText = log.join('\n');
            const truncatedLog = logText.length > 3500 ? logText.substring(0, 3500) + '\n...(truncated)' : logText;

            const summaryEmbed = new EmbedBuilder()
                .setTitle('⚡ NEXUS BLUEPRINT — DEPLOYMENT COMPLETE')
                .setDescription(
                    `Architecture deployed to **${guild.name}**\n\n` +
                    `📊 **${totalRoles}** roles · **${totalCategories}** categories · **${totalChannels}** channels\n` +
                    `🔐 Permission overrides applied to all ${totalCategories} categories\n\n` +
                    '```\n' + truncatedLog + '\n```'
                )
                .setColor(0xD4A040)
                .setFooter({ text: 'Nexus Protocol v11.0.0 // Apex Blueprint' })
                .setTimestamp();

            const manualEmbed = new EmbedBuilder()
                .setTitle('📋 MANUAL SETUP REQUIRED')
                .setDescription(
                    'The following items **cannot be automated** and require manual configuration by the Founder:\n\n' +
                    manualSteps.join('\n')
                )
                .setColor(0xFFBD2E)
                .setFooter({ text: 'Complete these steps to finalize the blueprint.' });

            await interaction.editReply({ embeds: [summaryEmbed, manualEmbed] });

        } catch (error) {
            const logText = log.join('\n');
            await interaction.editReply({
                embeds: [embedBuilder({
                    title: '💥 Blueprint Deployment Failed',
                    description: `A critical error occurred during deployment.\n\`\`\`\n${error.message}\n\`\`\`\n\n**Log:**\n\`\`\`\n${logText.substring(0, 2500)}\n\`\`\``,
                    color: '#ED4245'
                })]
            });
        }
    },
};
