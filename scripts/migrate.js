const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const User = require('../src/models/User');
const Warning = require('../src/models/Warning');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ECONOMY_FILE = path.join(DATA_DIR, 'economy.json');
const WARNS_FILE = path.join(DATA_DIR, 'warnings.json');

async function migrate() {
    try {
        console.log('--- Database Migration Started ---');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB.');

        // 1. Migrate Economy Data
        if (fs.existsSync(ECONOMY_FILE)) {
            console.log('Migrating economy data...');
            const economyData = JSON.parse(fs.readFileSync(ECONOMY_FILE, 'utf-8'));
            
            for (const [userId, data] of Object.entries(economyData)) {
                // Note: The old JSON format didn't store guildId per user record in a way that maps 1:1 to guilds.
                // For migration, we might need to assume a default guild or handle multi-guild migration differently.
                // Here we'll check if the user already exists in the target DB (unlikely during first migration).
                
                await User.findOneAndUpdate(
                    { userId }, 
                    { 
                        $set: {
                            wallet: data.wallet || 0,
                            bank: data.bank || 0,
                            bankCapacity: data.bankCapacity || 5000,
                            lastDaily: data.lastDaily ? new Date(data.lastDaily) : null,
                            lastWork: data.lastWork ? new Date(data.lastWork) : null,
                            dailyStreak: data.dailyStreak || 0,
                            xp: data.xp || 0,
                            level: data.level || 1,
                            inventory: data.inventory || []
                        },
                        $setOnInsert: { guildId: 'MIGRATED' } // Placeholder guildId
                    },
                    { upsert: true }
                );
            }
            console.log(`Migrated ${Object.keys(economyData).length} users.`);
        }

        // 2. Migrate Warning Data
        if (fs.existsSync(WARNS_FILE)) {
            console.log('Migrating warning data...');
            const warningData = JSON.parse(fs.readFileSync(WARNS_FILE, 'utf-8'));
            
            let warningCount = 0;
            for (const [guildId, users] of Object.entries(warningData)) {
                for (const [userId, warns] of Object.entries(users)) {
                    for (const warn of warns) {
                        await Warning.create({
                            guildId,
                            userId,
                            moderatorId: warn.moderator || 'SYSTEM',
                            reason: warn.reason || 'Migrated warning',
                            timestamp: new Date(warn.timestamp)
                        });
                        warningCount++;
                    }
                }
            }
            console.log(`Migrated ${warningCount} warnings.`);
        }

        console.log('--- Migration Finished Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
