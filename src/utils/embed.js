const { EmbedBuilder } = require('discord.js');

/**
 * Nexus Design System - Embed Generator
 * @param {Object} options 
 * @param {String} options.title
 * @param {String} options.description
 * @param {String|Number} options.color
 * @param {Array} options.fields
 * @param {String} options.footer
 * @param {String} options.thumbnail
 * @param {String} options.image
 * @param {Boolean} options.timestamp
 * @param {String} options.type - 'error', 'success', 'info', 'warning'
 */
function createEmbed(options = {}) {
    const palette = {
        primary: '#00FFCC', // Cyan
        secondary: '#BC13FE', // Purple
        error: '#FF0055', // Red
        warning: '#FFCC00', // Gold
        info: '#00AAFF', // Blue
        success: '#00FF88' // Green
    };

    let embedColor = options.color;
    if (!embedColor) {
        if (options.type) embedColor = palette[options.type];
        else embedColor = palette.primary;
    }

    const embed = new EmbedBuilder()
        .setColor(embedColor);
    
    // Add prefix to title for better visual hierarchy if it exists
    if (options.title) {
        let prefix = '💿';
        if (options.type === 'error') prefix = '🚫';
        if (options.type === 'warning') prefix = '⚠️';
        if (options.type === 'success') prefix = '✅';
        
        embed.setTitle(`${prefix} ${options.title}`);
    }

    if (options.description) {
        // Wrap description in code block for certain types or just format it
        embed.setDescription(options.description);
    }

    if (options.fields) embed.addFields(options.fields);
    
    // Standardized Premium Footer
    const footerText = options.footer || 'Nexus Core v3.0 // Protocol Active';
    embed.setFooter({ text: footerText });
    
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.timestamp !== false) embed.setTimestamp();

    return embed;
}

module.exports = { createEmbed };
