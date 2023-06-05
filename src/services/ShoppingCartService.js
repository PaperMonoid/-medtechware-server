const ShoppingCart = require('../models/ShoppingCart.js');
const Product = require('../models/Product.js');

const ShoppingCartService = {

    createCart: async function(userId) {
        const cart = new ShoppingCart({ userId });
        return await cart.save();
    },

    getCart: async function(userId) {
        return await ShoppingCart.findOne({ userId }).populate('items.productId');
    },

    addToCart: async function(userId, productId, quantity) {
        const cart = await this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        cart.items.push({
            productId,
            quantity
        });
        cart.subtotal += product.price * quantity;
        // TODO: calculate tax and total based on your business logic
        cart.tax += 0;
        cart.total += product.price * quantity;
        cart.updated = new Date();
        return await cart.save();
    },

    removeFromCart: async function(userId, productId) {
        const cart = await this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new Error('Product not found in cart');
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        cart.subtotal -= product.price * cart.items[itemIndex].quantity;
        // TODO: calculate tax and total based on your business logic
        cart.tax -= 0;
        cart.total -= product.price * cart.items[itemIndex].quantity;
        cart.items.splice(itemIndex, 1);
        cart.updated = new Date();
        return await cart.save();
    },

    updateCart: async function(userId, productId, quantity) {
        const cart = await this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new Error('Product not found in cart');
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        cart.subtotal -= product.price * cart.items[itemIndex].quantity;
        cart.subtotal += product.price * quantity;
        // TODO: calculate tax and total based on your business logic
        cart.tax -= 0;
        cart.tax += 0;
        cart.total -= product.price * cart.items[itemIndex].quantity;
        cart.total += product.price * quantity;
        cart.items[itemIndex].quantity = quantity;
        cart.updated = new Date();
        return await cart.save();
    },

    clearCart: async function(userId) {
        const cart = await this.getCart(userId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.items = [];
        cart.subtotal = 0;
        cart.tax = 0;
        cart.total = 0;
        cart.updated = new Date();
        return await cart.save();
    }
};

module.exports = ShoppingCartService;
