const { SlashCommandBuilder } = require('discord.js');
const embedBuilder = require('../../utils/embedBuilder');
const axios = require('axios');
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Queries atmospheric sensors for a specific global coordinate.')
        .addStringOption(option =>
            option.setName('location')
                .setDescription('The city or region to scan.')
                .setRequired(true)),
    async execute(interaction) {
        const location = interaction.options.getString('location');
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return interaction.reply({ 
                content: '⚠️ Atmospheric sensors are offline (Missing API Key).', 
                ephemeral: true 
            });
        }

        await interaction.deferReply();

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
            const response = await axios.get(url);
            const data = response.data;

            const weatherEmbed = embedBuilder({
                title: `🌍 Atmospheric Scan // ${data.name}, ${data.sys.country}`,
                description: `**Coordinates:** \`${data.coord.lat}, ${data.coord.lon}\``,
                fields: [
                    { name: '🌡️ Temperature', value: `\`${data.main.temp}°C\` (Feels: \`${data.main.feels_like}°C\`)`, inline: true },
                    { name: '💧 Humidity', value: `\`${data.main.humidity}%\``, inline: true },
                    { name: '💨 Wind Velocity', value: `\`${data.wind.speed} m/s\``, inline: true },
                    { name: '☁️ Conditions', value: `\`${data.weather[0].main}\` (${data.weather[0].description})`, inline: false }
                ],
                thumbnail: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
                color: '#3498DB'
            });

            await interaction.editReply({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error('Weather fetch error:', error);
            await interaction.editReply({ 
                content: `Failed to query atmospheric sensors for \`${location}\`. Ensure the location identifier is correct.` 
            });
        }
    },
};
