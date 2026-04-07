const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '../events');
    let onceCount = 0;
    let onCount = 0;

    if (!fs.existsSync(eventsPath)) fs.mkdirSync(eventsPath);

    const loadEvents = (dir) => {
        const entries = fs.readdirSync(path.join(eventsPath, dir));

        for (const entry of entries) {
            const fullPath = path.join(eventsPath, dir, entry);
            const stat = fs.lstatSync(fullPath);

            if (stat.isDirectory()) {
                loadEvents(path.join(dir, entry));
            } else if (entry.endsWith('.js')) {
                try {
                    const event = require(fullPath);

                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                        onceCount++;
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                        onCount++;
                    }

                    client.events.set(event.name, event);
                } catch (err) {
                    logger.error(`Failed to load event ${entry}:`, err);
                }
            }
        }
    };

    try {
        loadEvents('');
        logger.success(`Loaded ${client.events.size} events (${onceCount} once, ${onCount} persistent).`);
    } catch (err) {
        logger.error('Error loading events:', err);
    }
};
