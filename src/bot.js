const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.events = new Collection();
client.owners = process.env.OWNER_IDS ? process.env.OWNER_IDS.split(',').map(id => id.trim()) : [];


// MongoDB Connection — no deprecated options (Mongoose 8+/MongoDB Driver 6+ dropped them)
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 12000,
        maxPoolSize: 10
    }).then(() => {
        logger.success('Connected to MongoDB.');
    }).catch(err => {
        logger.error('Failed to connect to MongoDB:', err);
    });
} else {
    logger.warn('MONGODB_URI not found in .env — persistence features disabled.');
}

// Load Handlers
const handlersPath = path.join(__dirname, 'handlers');
fs.readdirSync(handlersPath).forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(handlersPath, file))(client);
    }
});

client.login(process.env.TOKEN).catch(err => {
    logger.error('Failed to login to Discord:', err);
});

// Graceful shutdown
const shutdown = (signal) => {
    logger.warn(`${signal} received — shutting down gracefully...`);
    client.destroy();
    mongoose.connection.close(false).then(() => {
        logger.info('MongoDB connection closed.');
        process.exit(0);
    }).catch(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Error handling
process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    logger.error('Uncaught exception:', error);
});
