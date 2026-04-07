const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    reason: { type: String, default: 'No reason provided.' },
    adminId: { type: String, required: true },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

warningSchema.index({ userId: 1, guildId: 1 });

module.exports = mongoose.model('Warning', warningSchema);
