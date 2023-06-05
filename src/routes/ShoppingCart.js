const express = require('express');
const ShoppingCartService = require('../services/ShoppingCartService.js');
const router = express.Router();

router.post('/cart', async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await ShoppingCartService.createCart(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await ShoppingCartService.getCart(req.params.userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/cart/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const updatedCart = await ShoppingCartService.addToCart(userId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/cart/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const updatedCart = await ShoppingCartService.removeFromCart(userId, productId);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/cart/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const updatedCart = await ShoppingCartService.updateCart(userId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/cart/clear', async (req, res) => {
    try {
        const userId = req.body.userId;
        const updatedCart = await ShoppingCartService.clearCart(userId);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
