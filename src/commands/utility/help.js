const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const fs = require('fs');
const path = require('path');

const categoryEmojis = {
    utility: '🔧',
    economy: '💰',
    moderation: '🛡️',
    advanced: '⚡',
    fun: '🎮',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Display all available commands organized by category.')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('View a specific category.')
                .setRequired(false)
                .addChoices(
                    { name: '🔧 Utility', value: 'utility' },
                    { name: '💰 Economy', value: 'economy' },
                    { name: '🛡️ Moderation', value: 'moderation' },
                    { name: '⚡ Advanced', value: 'advanced' },
                    { name: '🎮 Fun', value: 'fun' }
                )),
    cooldown: 5,
    async execute(interaction, client) {
        const targetCategory = interaction.options.getString('category');
        const commandsDir = path.join(__dirname, '..');
        const dirEntries = fs.readdirSync(commandsDir, { withFileTypes: true });
        const categories = {};

        for (const entry of dirEntries) {
            if (entry.isDirectory()) {
                if (targetCategory && entry.name !== targetCategory) continue;

                const categoryFiles = fs.readdirSync(path.join(commandsDir, entry.name))
                    .filter(file => file.endsWith('.js'));

                const categoryCommands = categoryFiles.map(file => {
                    const cmd = require(path.join(commandsDir, entry.name, file));
                    return `\`/${cmd.data.name}\``;
                });

                if (categoryCommands.length > 0) {
                    const emoji = categoryEmojis[entry.name] || '📁';
                    categories[`${emoji} ${entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}`] = {
                        commands: categoryCommands.join(', '),
                        count: categoryCommands.length
                    };
                }
            }
        }

        const fields = Object.entries(categories).map(([name, data]) => ({
            name: `${name} (${data.count})`,
            value: data.commands,
            inline: false
        }));

        const totalCount = Object.values(categories).reduce((acc, d) => acc + d.count, 0);

        const helpEmbed = embedBuilder({
            title: '📖 Nexus Protocol — Command Hub',
            description: targetCategory
                ? `Showing commands in the **${targetCategory}** category.`
                : `**${totalCount}** commands available across **${fields.length}** categories.\nUse \`/help category:<name>\` to filter by category.`,
            fields: fields,
            color: '#5865F2',
            footer: `Nexus Protocol v7 • ${totalCount} Commands Loaded`
        });

        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};
