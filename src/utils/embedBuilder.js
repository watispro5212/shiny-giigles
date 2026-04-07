const { EmbedBuilder } = require('discord.js');

/**
 * Standardized Embed Builder for Nexus Protocol v7
 * @param {object} options - Embed options
 * @param {string} options.title - The title of the embed
 * @param {string} options.description - The description of the embed
 * @param {string} [options.color] - Hex color code (default: #5865F2)
 * @param {object[]} [options.fields] - Array of field objects {name, value, inline}
 * @param {string} [options.thumbnail] - Thumbnail URL
 * @param {string} [options.image] - Image URL
 * @param {string} [options.footer] - Footer text
 * @param {string} [options.author] - Author name
 * @param {string} [options.authorIcon] - Author icon URL
 * @param {string} [options.url] - Title URL
 * @returns {EmbedBuilder}
 */
module.exports = (options) => {
    const embed = new EmbedBuilder()
        .setColor(options.color || '#5865F2')
        .setTimestamp();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.url) embed.setURL(options.url);

    if (options.fields && options.fields.length > 0) {
        embed.addFields(options.fields);
    }

    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);

    if (options.author) {
        embed.setAuthor({
            name: options.author,
            iconURL: options.authorIcon || undefined
        });
    }

    embed.setFooter({
        text: options.footer || 'Nexus Protocol v7 • Advanced Intelligence'
    });

    return embed;
};
