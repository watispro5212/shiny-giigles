const express = require('express');
const session = require('express-session');
const path = require('path');
const DiscordOAuth2 = require('discord-oauth2');
require('dotenv').config();

const app = express();
const oauth = new DiscordOAuth2();

function initWebServer(client) {
    // Basic setup
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '../../views'));
    
    // Serve static files
    app.use(express.static(path.join(__dirname, '../../public')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Session config
    app.use(session({
        secret: 'nexus-protocol-secret-key-12345',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false } // Set true if using HTTPS
    }));

    // OAuth2 Routes
    app.get('/api/auth/login', (req, res) => {
        const url = oauth.generateAuthUrl({
            clientId: process.env.DISCORD_CLIENT_ID,
            scope: ['identify', 'guilds'],
            redirectUri: `http://localhost:${process.env.PORT || 3000}/api/auth/callback`
        });
        res.redirect(url);
    });

    app.get('/api/auth/callback', async (req, res) => {
        try {
            const code = req.query.code;
            if (!code) return res.send('No code provided');

            const tokenData = await oauth.tokenRequest({
                clientId: process.env.DISCORD_CLIENT_ID,
                clientSecret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                scope: 'identify guilds',
                grantType: 'authorization_code',
                redirectUri: `http://localhost:${process.env.PORT || 3000}/api/auth/callback`
            });

            const user = await oauth.getUser(tokenData.access_token);
            const guilds = await oauth.getUserGuilds(tokenData.access_token);

            req.session.user = user;
            req.session.guilds = guilds;
            
            res.redirect('/dashboard');
        } catch (error) {
            console.error('[OAuth2 Error]', error);
            res.status(500).send('Authentication failed.');
        }
    });

    app.get('/api/auth/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    // Routes
    app.get('/', (req, res) => {
        res.render('index', { user: req.session.user });
    });

    // Auth Middleware
    const checkAuth = (req, res, next) => {
        if (!req.session.user) return res.redirect('/api/auth/login');
        next();
    };

    app.get('/dashboard', checkAuth, (req, res) => {
        // Filter guilds to only show ones where user is admin/manager
        // 0x20 = MANAGE_GUILD, 0x8 = ADMINISTRATOR
        const validGuilds = req.session.guilds.filter(g => 
            (g.permissions & 0x20) === 0x20 || (g.permissions & 0x8) === 0x8
        );
        
        // Pass Discord.js client to check if bot is already in those servers
        res.render('dashboard', { 
            user: req.session.user, 
            guilds: validGuilds,
            botClient: client 
        });
    });

    app.get('/dashboard/:guildId', checkAuth, async (req, res) => {
        const guildId = req.params.guildId;
        
        // Check if user has access to this guild
        const hasAccess = req.session.guilds.some(g => g.id === guildId && ((g.permissions & 0x20) === 0x20 || (g.permissions & 0x8) === 0x8));
        if (!hasAccess) return res.status(403).send('Forbidden: You do not have manage permissions for this server.');

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.redirect(`https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`);

        // Fetch settings from DB
        const GuildConfig = require('../models/GuildConfig');
        let config = await GuildConfig.findOne({ guildId });
        if (!config) {
            config = await GuildConfig.create({ guildId });
        }

        res.render('server', {
            user: req.session.user,
            guild: guild,
            config: config
        });
    });

    app.post('/api/settings/:guildId', checkAuth, async (req, res) => {
        const guildId = req.params.guildId;
        const hasAccess = req.session.guilds.some(g => g.id === guildId && ((g.permissions & 0x20) === 0x20 || (g.permissions & 0x8) === 0x8));
        if (!hasAccess) return res.status(403).send('Forbidden');

        const { 
            welcomeChannelId, 
            logChannelId, 
            strictMode,
            economyEnabled, 
            casinoEnabled,
            funEnabled,
            levelingEnabled,
            antiSpam,
            badWordsList
        } = req.body;
        
        let badWords = [];
        if (badWordsList) {
            badWords = badWordsList.split(',').map(w => w.trim()).filter(w => w.length > 0);
        }

        const GuildConfig = require('../models/GuildConfig');
        await GuildConfig.findOneAndUpdate(
            { guildId }, 
            { 
                welcomeChannelId: welcomeChannelId || null, 
                logChannelId: logChannelId || null,
                strictMode: strictMode === 'on',
                economyEnabled: economyEnabled === 'on',
                casinoEnabled: casinoEnabled === 'on',
                funEnabled: funEnabled === 'on',
                levelingEnabled: levelingEnabled === 'on',
                antiSpam: antiSpam === 'on',
                badWords: badWords
            },
            { upsert: true }
        );

        res.redirect(`/dashboard/${guildId}?success=true`);
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`[WEB] Nexus Dashboard running on port ${PORT}`);
    });
}

module.exports = { initWebServer };
