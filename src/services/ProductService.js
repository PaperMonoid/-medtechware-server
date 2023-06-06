const Product = require('../models/Product.js');

const productService = {
    createProduct: async function(data) {
	const product = new Product(data);
	try {
	    await product.save();
	    return product;
	} catch (error) {
	    throw error;
	}
    },

    getProduct: async function(id) {
	try {
	    const product = await Product.findById(id);
	    return product;
	} catch (error) {
	    throw error;
	}
    },

    listProducts: async function() {
	try {
	    const products = await Product.find();
	    return products;
	} catch (error) {
	    throw error;
	}
    },

    searchProducts: async function(keywords) {
        const maxKeywords = 6;
        const splitKeywords = keywords.split(" ").slice(0, maxKeywords);
        try {
            const products = await Product.find({
                keywords: { $in: splitKeywords }
            });
            return products;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async function(id, data) {
	try {
	    const product = await Product.findByIdAndUpdate(id, data, { new: true });
	    return product;
	} catch (error) {
	    throw error;
	}
    },

    deleteProduct: async function(id) {
	try {
	    const product = await Product.findByIdAndRemove(id);
	    return product;
	} catch (error) {
	    throw error;
	}
    }
}

module.exports = productService;
