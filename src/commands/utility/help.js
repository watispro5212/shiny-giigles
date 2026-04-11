const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
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

const categoryDescriptions = {
    utility: 'Essential system tools and information protocols.',
    economy: 'Manage your credit reserves and participate in the global market.',
    moderation: 'Enforce node security and manage community entities.',
    advanced: 'High-level infrastructure and network diagnostic protocols.',
    fun: 'Engage with random data packets and entertainment sub-routines.'
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Open the interactive Nexus Command Directory.'),
    cooldown: 5,
    async execute(interaction, client) {
        const commandsDir = path.join(__dirname, '..');
        const categories = fs.readdirSync(commandsDir, { withFileTypes: true })
            .filter(dir => dir.isDirectory())
            .map(dir => dir.name);

        const buildHelpEmbed = (category = null) => {
            if (!category) {
                return embedBuilder({
                    title: '📖 Nexus Protocol — Command Hub',
                    description: 'Welcome to the central command directory. Use the interaction menu below to explore specific protocol categories.\n\n' +
                                 '**Active Modules:** ' + categories.map(c => `\`${c.toUpperCase()}\``).join(', ') + '\n' +
                                 '**Interface:** Slash Commands (/) Only',
                    fields: [
                        { name: '🌐 Integrated Dashboard', value: '[Access Web Portal](https://nexus-protocol.com)', inline: true },
                        { name: '🛡️ Support Array', value: '[Join Support](https://discord.gg/nexus)', inline: true }
                    ],
                    color: '#5865F2',
                    footer: `Nexus Protocol v7 • Select a category to begin`
                });
            }

            const emoji = categoryEmojis[category] || '📁';
            const cmdFiles = fs.readdirSync(path.join(commandsDir, category)).filter(f => f.endsWith('.js'));
            const commands = cmdFiles.map(file => {
                const cmd = require(path.join(commandsDir, category, file));
                return `**/${cmd.data.name}**\n*${cmd.data.description}*`;
            }).join('\n\n');

            return embedBuilder({
                title: `${emoji} ${category.toUpperCase()} Protocol Directory`,
                description: `${categoryDescriptions[category] || 'List of commands for this module.'}\n\n${commands}`,
                color: '#5865F2',
                footer: `Nexus Protocol v7 • ${cmdFiles.length} Commands in ${category}`
            });
        };

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('help_category')
            .setPlaceholder('Select a Command Category...')
            .addOptions(
                { label: 'Main Menu', description: 'Return to the command hub overview.', value: 'main', emoji: '🏠' },
                ...categories.map(cat => ({
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                    description: categoryDescriptions[cat] || `Commands for ${cat}`,
                    value: cat,
                    emoji: categoryEmojis[cat] || '📁'
                }))
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        const response = await interaction.reply({
            embeds: [buildHelpEmbed()],
            components: [row],
            ephemeral: true
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            time: 60000
        });

        collector.on('collect', async i => {
            const selection = i.values[0];
            const newEmbed = selection === 'main' ? buildHelpEmbed() : buildHelpEmbed(selection);
            
            await i.update({
                embeds: [newEmbed],
                components: [row]
            });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] }).catch(() => {});
        });
    },
};

