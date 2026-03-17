const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');
const packageJson = require('../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Initiates a high-fidelity core specification scan of the Nexus and the current sector.'),
    async execute(interaction) {
        const { client, guild } = interaction;
        
        const uptimeMs = client.uptime;
        const uptimeDays = Math.floor(uptimeMs / 86400000);
        const uptimeHours = Math.floor(uptimeMs / 3600000) % 24;
        const uptimeMinutes = Math.floor(uptimeMs / 60000) % 60;
        
        let uptimeString = '';
        if (uptimeDays > 0) uptimeString += `${uptimeDays}d `;
        if (uptimeHours > 0 || uptimeDays > 0) uptimeString += `${uptimeHours}h `;
        uptimeString += `${uptimeMinutes}m`;

        const embed = createEmbed({
            title: '🤖 Nexus Core Specification Scan',
            description: `\`[SCANNING NEURAL NETWORK...SUCCESS]\` \n${packageJson.description}`,
            thumbnail: client.user.displayAvatarURL(),
            fields: [
                { name: '🤖 System Identity', value: `\`${client.user.username}\``, inline: true },
                { name: '📦 Build Version', value: `\`v${packageJson.version}\``, inline: true },
                { name: '⚡ Uptime Pulse', value: `\`${uptimeString}\``, inline: true },
                
                { name: '📡 Current Sector', value: `\`${guild.name}\``, inline: true },
                { name: '👥 Entity Count', value: `\`${guild.memberCount}\``, inline: true },
                { name: '📅 Creation Hash', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true }
            ],
            footer: `Analysis requested by ${interaction.user.tag} | Nexus Core 2.0`
        });

        await interaction.reply({ embeds: [embed] });
    },
};
