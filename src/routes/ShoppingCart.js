const express = require('express');
const ShoppingCartService = require('../services/ShoppingCartService.js');
const router = express.Router();
const { expressjwt } = require("express-jwt");

const JWT_SECRET = process.env.JWT_SECRET;

const jwtMiddleWare = expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] });
const authMiddleware = (req, res, next) => {
    const auth = req.auth;
    if (auth)
	req.body.userId = req.auth.userId;
};

router.post('/', async (req, res) => {
    try {
        const userId = req.body.userId;
        const cart = await ShoppingCartService.createCart(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const cart = await ShoppingCartService.getCart(req.params.userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/add', jwtMiddleWare, authMiddleware, async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

	const cart = await ShoppingCartService.getCart(userId);
	if (!cart) {
	    await ShoppingCartService.createCart(userId);
	}

        const updatedCart = await ShoppingCartService.addToCart(userId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const updatedCart = await ShoppingCartService.removeFromCart(userId, productId);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const updatedCart = await ShoppingCartService.updateCart(userId, productId, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/clear', async (req, res) => {
    try {
        const userId = req.body.userId;
        const updatedCart = await ShoppingCartService.clearCart(userId);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
