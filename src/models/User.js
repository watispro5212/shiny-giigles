const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    inventory: { type: [String], default: [] },
    badges: { type: [String], default: [] },
    streak: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
    lastWork: { type: Date, default: null },
    lastRob: { type: Date, default: null },
    lastCrime: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now }
});


userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
