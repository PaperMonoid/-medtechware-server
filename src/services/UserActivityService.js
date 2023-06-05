const mongoose = require('mongoose');
const crypto = require('crypto');
const UserActivity = require('../models/UserActivity.js');

exports.recordActivity = async function(userId, sessionId, userAgent, ipAddress, activity) {
    // Create a hash of the user agent and IP address
    const hash = crypto.createHash('sha256').update(userAgent + ipAddress).digest('hex');

    const userActivity = new UserActivity({
        userId,
        sessionId,
        hash,
        activity
    });

    try {
        const newUserActivity = await userActivity.save();
        return newUserActivity;
    } catch (err) {
        throw err;
    }
};

exports.getActivitiesByUser = async function(userId) {
    try {
        const activities = await UserActivity.find({userId: mongoose.Types.ObjectId(userId)});
        return activities;
    } catch (err) {
        throw err;
    }
};

exports.getActivitiesBySession = async function(sessionId) {
    try {
        const activities = await UserActivity.find({sessionId});
        return activities;
    } catch (err) {
        throw err;
    }
};

exports.getActivitiesByHash = async function(userAgent, ipAddress) {
    const hash = crypto.createHash('sha256').update(userAgent + ipAddress).digest('hex');
    try {
        const activities = await UserActivity.find({hash});
        return activities;
    } catch (err) {
        throw err;
    }
};

exports.clearActivities = async function(userId) {
    try {
        const result = await UserActivity.deleteMany({userId: mongoose.Types.ObjectId(userId)});
        return result;
    } catch (err) {
        throw err;
    }
};

exports.clearActivitiesBySession = async function(sessionId) {
    try {
        const result = await UserActivity.deleteMany({sessionId});
        return result;
    } catch (err) {
        throw err;
    }
};

exports.clearActivitiesByHash = async function(userAgent, ipAddress) {
    const hash = crypto.createHash('sha256').update(userAgent + ipAddress).digest('hex');
    try {
        const result = await UserActivity.deleteMany({hash});
        return result;
    } catch (err) {
        throw err;
    }
};
