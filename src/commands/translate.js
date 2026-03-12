const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate text to another language.')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('The text to translate.')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('to')
                .setDescription('The language code to translate to (e.g., en, es, fr, de).')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const text = interaction.options.getString('text');
        const targetLang = interaction.options.getString('to');

        try {
            // Using a free translation API (MyMemory)
            const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
            const data = await res.json();

            if (data.responseStatus !== 200) {
                return interaction.editReply(`Translation failed: ${data.responseDetails}`);
            }

            const translatedText = data.responseData.translatedText;

            const embed = createEmbed({
                title: '🌍 Translation',
                color: '#2ECC71'
            })
            .addFields(
                { name: 'Original', value: text },
                { name: 'Translated', value: translatedText }
            )
            .setFooter({ text: `Translated to: ${targetLang.toUpperCase()}` });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Something went wrong during translation.');
        }
    },
};
