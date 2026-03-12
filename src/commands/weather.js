const { SlashCommandBuilder } = require('discord.js');
const { createEmbed } = require('../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Get current weather for a city.')
        .addStringOption(option => 
            option.setName('city')
                .setDescription('The city to check weather for.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const city = interaction.options.getString('city');

        try {
            // Using wttr.in for easy weather data without an API key requirement for simple requests
            const res = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
            if (!res.ok) throw new Error('Weather service failure');
            
            const data = await res.json();
            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            const embed = createEmbed({
                title: `Weather in ${area.areaName[0].value}, ${area.country[0].value}`,
                description: `**${current.weatherDesc[0].value}**`,
                color: '#3498DB'
            })
            .addFields(
                { name: 'Temperature', value: `${current.temp_C}°C / ${current.temp_F}°F`, inline: true },
                { name: 'Feels Like', value: `${current.FeelsLikeC}°C / ${current.FeelsLikeF}°F`, inline: true },
                { name: 'Humidity', value: `${current.humidity}%`, inline: true },
                { name: 'Wind', value: `${current.windspeedKmph} km/h`, inline: true }
            )
            .setFooter({ text: 'Data from wttr.in' });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply('Could not fetch weather data. Please ensure the city name is correct.');
        }
    },
};
