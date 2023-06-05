const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

require('dotenv').config();

const AuthRoutes = require('./routes/Auth.js');
const UserRoutes = require('./routes/User.js');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);

const connectDB = async () => {
    try {
	await mongoose.connect(process.env.DATABASE_URL);
    } catch(error) {
	console.error('error', 'could not connect to the database')
    }
};

const server = app.listen(process.env.PORT, () => {
    console.log(
	`Example app listening on port ${process.env.PORT}`
    );
    connectDB();
});

module.exports = {
    app,
    server
};
