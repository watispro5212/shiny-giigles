const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    bankCapacity: { type: Number, default: 5000 },
    lastDaily: { type: Date, default: null },
    lastWork: { type: Date, default: null },
    dailyStreak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: { type: Array, default: [] }
}, { timestamps: true });

// Compound index for faster lookups across multiple guilds (if needed later)
userSchema.index({ userId: 1, guildId: 1 });

module.exports = mongoose.model('User', userSchema);
