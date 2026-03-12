const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('urban')
        .setDescription('Look up a term on Urban Dictionary.')
        .addStringOption(option => 
            option.setName('term')
                .setDescription('The term to look up.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const term = interaction.options.getString('term');

        try {
            const query = new URLSearchParams({ term });
            const res = await fetch(`https://api.urbandictionary.com/v0/define?${query}`);
            const { list } = await res.json();

            if (!list.length) {
                return interaction.editReply(`No results found for **${term}**.`);
            }

            const [answer] = list;
            
            const embed = createEmbed({
                title: answer.word,
                url: answer.permalink,
                color: '#EFFF00'
            })
            .addFields(
                { name: 'Definition', value: answer.definition.substring(0, 1024) || 'No definition' },
                { name: 'Example', value: answer.example.substring(0, 1024) || 'No example' }
            )
            .setFooter({ text: `👍 ${answer.thumbs_up} | 👎 ${answer.thumbs_down}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Something went wrong while fetching the definition.');
        }
    },
};
