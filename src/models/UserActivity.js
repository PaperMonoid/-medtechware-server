const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    sessionId: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
