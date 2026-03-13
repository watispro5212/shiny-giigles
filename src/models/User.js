const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
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

// Compound index for keeping track of users per guild
userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
