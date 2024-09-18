const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'});

module.exports = {
    generateToken,
}

