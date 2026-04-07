const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Display a user\'s avatar in full resolution.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user whose avatar to display.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const user = interaction.options.getUser('target') || interaction.user;

        const formats = ['png', 'jpg', 'webp'];
        if (user.avatar?.startsWith('a_')) formats.push('gif');

        const links = formats.map(f =>
            `[\`${f.toUpperCase()}\`](${user.displayAvatarURL({ extension: f, size: 4096 })})`
        ).join(' • ');

        await interaction.reply({
            embeds: [embedBuilder({
                title: `🖼️ ${user.displayName}'s Avatar`,
                description: `Download: ${links}`,
                image: user.displayAvatarURL({ dynamic: true, size: 4096 }),
                color: user.accentColor ?? '#5865F2'
            })]
        });
    },
};
