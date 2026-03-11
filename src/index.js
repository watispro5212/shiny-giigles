const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ],
});

client.commands = new Collection();

// Load Commands dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load Events dynamically
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Global Error Handlers
process.on('unhandledRejection', (error) => {
    console.error('[Unhandled Rejection]', error);
});

process.on('uncaughtException', (error) => {
    console.error('[Uncaught Exception]', error);
});

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Discord Webhook Verification Endpoint
app.post('/webhook', (req, res) => {
    // Discord sends a POST request to verify the URL
    // Simply returning a 200 OK is often enough for simple verification, 
    // or you can log the body to see what Discord is sending.
    console.log('[WEBHOOK] Received payload:', req.body);
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('NexusBot Backend is running!');
});

app.listen(port, () => {
    console.log(`[SERVER] Web server listening at http://localhost:${port}`);
});

client.login(process.env.TOKEN);
