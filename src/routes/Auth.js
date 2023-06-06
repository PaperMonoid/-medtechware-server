const express = require('express');
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService.js');
//var { expressjwt } = require("express-jwt");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
	const user = await UserService.getUserByEmail(email);
        const passwordMatch = await UserService.verifyPassword(user._id, password);

        if (!user || !passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const token = jwt.sign({ "_id": user._id, 'isAdmin': user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('t', token, { expire: new Date() + 9999 });
        return res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.post('/logout', async (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'User signout successful' });
});


// Protected routes
// router.use(expressjwt({
//     secret: JWT_SECRET,
//     userProperty: 'auth',
//     algorithms: ['HS256']
// }));

module.exports = router;
