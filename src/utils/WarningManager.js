const Warning = require('../models/Warning');

class WarningManager {
    /**
     * Get all warnings for a user in a specific guild.
     * @param {string} guildId 
     * @param {string} userId 
     */
    async getWarnings(guildId, userId) {
        try {
            return await Warning.find({ guildId, userId }).sort({ timestamp: -1 });
        } catch (error) {
            console.error('[WarningManager] Error in getWarnings:', error);
            return [];
        }
    }

    /**
     * Add a warning for a user.
     * @param {string} guildId 
     * @param {string} userId 
     * @param {string} moderatorId 
     * @param {string} reason 
     */
    async addWarning(guildId, userId, moderatorId, reason) {
        try {
            await Warning.create({
                guildId,
                userId,
                moderatorId,
                reason: reason || 'No reason provided'
            });
        } catch (error) {
            console.error('[WarningManager] Error in addWarning:', error);
        }
    }

    /**
     * Clear all warnings for a user in a specific guild.
     * @param {string} guildId 
     * @param {string} userId 
     */
    async clearWarnings(guildId, userId) {
        try {
            const result = await Warning.deleteMany({ guildId, userId });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('[WarningManager] Error in clearWarnings:', error);
            return false;
        }
    }
}

module.exports = new WarningManager();
