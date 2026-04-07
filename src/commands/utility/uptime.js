const { SlashCommandBuilder, version: djsVersion } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('System diagnostics — uptime, memory, and runtime info.'),
    cooldown: 10,
    async execute(interaction, client) {
        const totalSeconds = client.uptime / 1000;
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);
        const memPercent = ((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100).toFixed(1);

        const uptimeEmbed = embedBuilder({
            title: '📊 System Diagnostics',
            description: `**Uptime:** \`${uptimeString}\`\n**Shard:** \`#${client.shard?.ids[0] ?? 0}\` / \`${client.shard?.count ?? 1}\``,
            fields: [
                { name: '🧠 Memory', value: `\`${memUsed}\` / \`${memTotal}\` MB (\`${memPercent}%\`)`, inline: true },
                { name: '📶 WS Ping', value: `\`${client.ws.ping}ms\``, inline: true },
                { name: '🏠 Guilds', value: `\`${client.guilds.cache.size}\``, inline: true },
                { name: '⚙️ Node.js', value: `\`${process.version}\``, inline: true },
                { name: '🤖 Discord.js', value: `\`v${djsVersion}\``, inline: true },
                { name: '💻 Platform', value: `\`${os.platform()} ${os.arch()}\``, inline: true }
            ],
            color: '#00FFE2'
        });

        await interaction.reply({ embeds: [uptimeEmbed] });
    },
};
