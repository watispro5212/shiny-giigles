const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, OAuth2Scopes, PermissionFlagsBits } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the bot\'s invite link.'),
    cooldown: 10,
    async execute(interaction, client) {
        const clientId = process.env.DISCORD_CLIENT_ID || process.env.CLIENT_ID || client.user.id;

        const inviteUrl = client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [
                PermissionFlagsBits.Administrator
            ]
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Add to Server')
                .setStyle(ButtonStyle.Link)
                .setURL(inviteUrl)
                .setEmoji('🔗'),
            new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.com/invite/DYXBEd2G8M')
                .setEmoji('💬')
        );

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🔗 Invite Nexus Protocol',
                description: 'Deploy the Nexus Protocol to your server and unlock its full potential.',
                fields: [
                    { name: 'Features', value: '🛡️ Moderation • 💰 Economy • 🎮 Fun • ⚡ Advanced', inline: false }
                ],
                color: '#5865F2'
            })],
            components: [row]
        });
    },
};
