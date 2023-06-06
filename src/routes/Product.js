const express = require('express');
const router = express.Router();
const UserService = require('../services/UserService.js');
const ProductService = require('../services/ProductService.js');
const { expressjwt } = require("express-jwt");

const JWT_SECRET = process.env.JWT_SECRET;

const jwtMiddleWare = expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] });
const adminMiddleware = (req, res, next) => {
    const auth = req.auth;
    if (auth && auth.isAdmin) {
	next();
    } else {
	res.status(401).json({ message: 'User is not authorized to perform this action' });
    }
};

router.get('/', async (req, res) => {
  try {
    const products = await ProductService.listProducts();
    res.json(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await ProductService.getProduct(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/', jwtMiddleWare, adminMiddleware, async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put('/:id', jwtMiddleWare, adminMiddleware, async (req, res) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:id', jwtMiddleWare, adminMiddleware, async (req, res) => {
  try {
    const product = await ProductService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/search', async (req, res) => {
    const keyword = req.query.keywords;
    try {
        const products = await ProductService.searchProduct(keywords);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
