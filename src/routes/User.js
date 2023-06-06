const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserService = require('../services/UserService.js');


const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    const user = await UserService.createUser(req.body);
    const token = jwt.sign({ "_id": user._id, "isAdmin": user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('t', token, { expire: new Date() + 9999 });
    res.status(200).json({ token });
});

router.get('/:id', async (req, res) => {
    const user = await UserService.getUserById(req.params.id);
    res.status(200).json(user);
});

router.put('/:id', async (req, res) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json(user);
});

router.delete('/:id', async (req, res) => {
    await UserService.deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted" });
});

router.post('/password-reset-request', async (req, res) => {
    const token = await UserService.passwordResetRequest(req.body.email);
    res.status(200).json({ message: "Password reset token has been sent to your email", token: token });
});

router.post('/reset-password', async (req, res) => {
    await UserService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: "Password has been reset" });
});

router.post('/verify-password', async (req, res) => {
    const isValid = await UserService.verifyPassword(req.body.id, req.body.password);
    if(isValid) {
        res.status(200).json({ message: "Password is correct" });
    } else {
        res.status(401).json({ message: "Password is incorrect" });
    }
});

router.post('/:id/clear-history', async (req, res) => {
    await UserService.clearHistory(req.params.id);
    res.status(200).json({ message: "Purchase history and user profile vector have been reset" });
});

router.get('/checkEmail/:email', async (req, res) => {
  const isEmailExists = await UserService.checkIfEmailExists(req.params.email);
  res.status(200).json({ exists: isEmailExists });
});

module.exports = router;
