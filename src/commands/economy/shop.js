const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');

const shopItems = [
    { id: 'cyberlink', name: '🔗 Cyber-Link', price: 5000, description: 'Basic neural interface module' },
    { id: 'neuralshunt', name: '🧠 Neural-Shunt', price: 12000, description: 'Advanced thought accelerator' },
    { id: 'datacore', name: '💎 Data-Core', price: 25000, description: 'Quantum data storage implant' },
    { id: 'biohack', name: '🧬 Bio-Hack', price: 50000, description: 'Biological enhancement suite' },
    { id: 'shardkey', name: '🔑 Shard-Key', price: 100000, description: 'Access key to restricted shards' },
    { id: 'rootaccess', name: '👑 Root-Access', price: 500000, description: 'Ultimate system control module' },
    { id: 'xpbooster', name: '⚡ XP Booster', price: 8000, description: '2x XP for 24 hours' },
    { id: 'shield', name: '🛡️ Shield Module', price: 15000, description: 'Protection against /rob attempts' },
];


module.exports = {
    shopItems,
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Browse the Nexus hardware catalog.'),
    cooldown: 5,
    async execute(interaction, client) {
        const fields = shopItems.map((item, i) => ({
            name: `${i + 1}. ${item.name}`,
            value: `Price: \`$${item.price.toLocaleString()}\`\n${item.description}\nID: \`${item.id}\``,
            inline: true
        }));

        await interaction.reply({
            embeds: [embedBuilder({
                title: '🏪 Nexus Hardware Catalog',
                description: 'Acquire hardware to enhance your operative profile.\nUse `/buy <item_id>` to purchase.',
                fields,
                color: '#F1C40F'
            })]
        });
    },
};
