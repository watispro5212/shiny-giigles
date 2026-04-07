const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    const categoryStats = {};

    if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

    const loadCommands = (dir) => {
        const entries = fs.readdirSync(path.join(commandsPath, dir));

        for (const entry of entries) {
            const fullPath = path.join(commandsPath, dir, entry);
            const stat = fs.lstatSync(fullPath);

            if (stat.isDirectory()) {
                loadCommands(path.join(dir, entry));
            } else if (entry.endsWith('.js')) {
                try {
                    const command = require(fullPath);

                    if (command.data && command.execute) {
                        client.commands.set(command.data.name, {
                            ...command,
                            category: dir.replace(/\\/g, '/').split('/').filter(Boolean)[0] || 'uncategorized'
                        });

                        const cat = dir.replace(/\\/g, '/').split('/').filter(Boolean)[0] || 'uncategorized';
                        categoryStats[cat] = (categoryStats[cat] || 0) + 1;
                    } else {
                        logger.warn(`Command at ${path.join(dir, entry)} is missing "data" or "execute".`);
                    }
                } catch (err) {
                    logger.error(`Failed to load command ${entry}:`, err);
                }
            }
        }
    };

    try {
        loadCommands('');
        logger.success(`Loaded ${client.commands.size} commands.`);

        const breakdown = Object.entries(categoryStats)
            .map(([cat, count]) => `${cat}: ${count}`)
            .join(' | ');
        logger.debug(`Command breakdown — ${breakdown}`);
    } catch (err) {
        logger.error('Error loading commands:', err);
    }
};
