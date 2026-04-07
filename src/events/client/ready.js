const { Events, ActivityType } = require('discord.js');
const logger = require('../../utils/logger');

const statuses = [
    { name: 'Nexus Protocol | /help', type: ActivityType.Watching },
    { name: 'over {guilds} nodes', type: ActivityType.Watching },
    { name: 'with {members} operatives', type: ActivityType.Playing },
    { name: '/help | v7.0.0', type: ActivityType.Listening },
    { name: 'Shard {shard} | {ping}ms', type: ActivityType.Competing },
];

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.success(`Ready! Logged in as ${client.user.tag}`);
        logger.info(`Serving ${client.guilds.cache.size} guilds on shard ${client.shard?.ids[0] ?? 0}`);

        // Set initial presence
        const updatePresence = () => {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const name = status.name
                .replace('{guilds}', client.guilds.cache.size)
                .replace('{members}', client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0))
                .replace('{shard}', client.shard?.ids[0] ?? 0)
                .replace('{ping}', client.ws.ping);

            client.user.setPresence({
                activities: [{ name, type: status.type }],
                status: 'online',
            });
        };

        updatePresence();
        setInterval(updatePresence, 30000); // Rotate every 30 seconds
    },
};
