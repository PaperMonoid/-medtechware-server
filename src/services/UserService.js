const mongoose = require('mongoose');
const User = require('../models/User.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function hashPassword(password, salt) {
    const hash = crypto.pbkdf2Sync(
	password,
	salt,
	1000,
	64,
	`sha512`
    ).toString(`hex`);
    return hash;
}

const UserService = {
    checkIfEmailExists: async function(email) {
	const user = await User.findOne({ email: email });
	return Boolean(user);
    },

    createUser: async function(data) {
        data.salt = crypto.randomBytes(16).toString('hex');
        data.hash = hashPassword(data.password, data.salt);
        delete data.password;
        const user = new User(data);
        await user.save();
        return user;
    },

    getUserById: async function(id) {
        return await User.findById(id);
    },

    getUserByEmail: async function(email) {
	const user = await User.findOne({ email: email });
	return user;
    },

    updateUser: async function(id, data) {
        if(data.password){
            data.salt = crypto.randomBytes(16).toString('hex');
            data.hash = hashPassword(data.password, data.salt);
            delete data.password;
        }
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return user;
    },

    deleteUser: async function(id) {
        return await User.findByIdAndRemove(id);
    },

    passwordResetRequest: async function(email) {
        const user = await User.findOne({email: email});
        if (!user) throw new Error('No user with that email');
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // You can send this token via email to the user, then user can use this token to reset the password.
        return token;
    },

    resetPassword: async function(token, newPassword) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id);
        user.salt = crypto.randomBytes(16).toString('hex');
        user.hash = hashPassword(newPassword, user.salt);
        await user.save();
    },

    verifyPassword: async function(id, password) {
        const user = await User.findById(id);
        const hash = hashPassword(password, user.salt);
        return user.hash === hash;
    },

    clearHistory: async function(id) {
        const user = await User.findById(id);
        user.purchaseHistory = [];
        user.userProfileVector = Array(user.userProfileVector.length).fill(0); // reset userProfileVector
        await user.save();
    }
};

module.exports = UserService;
