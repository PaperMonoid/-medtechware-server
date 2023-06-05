const express = require('express');
const router = express.Router();
const UserActivityService = require('../services/UserActivityService.js');

router.get('/:id', async (req, res) => {
    try {
        const userActivity = await UserActivityService.getById(req.params.id);
        res.json(userActivity);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/', async (req, res) => {
    try {
        const newUserActivity = await UserActivityService.create(req.body);
        res.status(201).json(newUserActivity);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.delete('/session/:sessionId', async (req, res) => {
    try {
        const result = await UserActivityService.clearActivitiesBySession(req.params.sessionId);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.delete('/hash', async (req, res) => {
    try {
        const userAgent = req.get('User-Agent');
        const ipAddress = req.ip;
        const result = await UserActivityService.clearActivitiesByHash(userAgent, ipAddress);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
