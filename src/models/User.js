const mongoose = require('mongoose');
const validator = require('validator');


const UserSchema = new mongoose.Schema({
    fullName: {
	type: String,
	required: true,
	trim: true,
    },
    email: {
	type: String,
	required: true,
	unique: true,
	trim: true,
	lowercase: true,
	validate: function(value) {
	    if (!validator.isEmail(value)) {
		throw new Error('Email is invalid');
	    }
	},
    },
    hash: {
	type: String,
	required: true,
    },
    salt: {
	type: String,
	required: true,
    },
    isAdmin: { type: Boolean, default: false },
    userProfileVector: {
	type: [Number],
	required: true,
    },
    purchaseHistory: [{
	type: mongoose.Schema.Types.ObjectId,
	ref: 'Product',
    }],
});

module.exports = mongoose.model('User', UserSchema);
