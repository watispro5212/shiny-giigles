const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('View collected hardware and items.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user whose inventory to scan.')
                .setRequired(false)),
    cooldown: 5,
    async execute(interaction, client) {
        const target = interaction.options.getUser('target') || interaction.user;

        const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });

        if (!userData || !userData.inventory || userData.inventory.length === 0) {
            return interaction.reply({
                embeds: [embedBuilder({
                    title: '📦 Inventory — Empty',
                    description: `${target.displayName} has no items in their terminal.`,
                    color: '#ED4245'
                })]
            });
        }

        // Group items by count
        const itemCounts = {};
        for (const item of userData.inventory) {
            itemCounts[item] = (itemCounts[item] || 0) + 1;
        }

        const itemList = Object.entries(itemCounts)
            .map(([item, count]) => count > 1 ? `\`${item}\` ×${count}` : `\`${item}\``)
            .join('\n');

        await interaction.reply({
            embeds: [embedBuilder({
                title: `📦 ${target.displayName}'s Inventory`,
                description: itemList,
                fields: [
                    { name: 'Total Items', value: `\`${userData.inventory.length}\``, inline: true },
                    { name: 'Unique Items', value: `\`${Object.keys(itemCounts).length}\``, inline: true }
                ],
                color: '#BC82FF',
                thumbnail: target.displayAvatarURL({ dynamic: true })
            })]
        });
    },
};
