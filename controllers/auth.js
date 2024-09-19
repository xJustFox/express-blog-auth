const jwt = require('jsonwebtoken');
const users = require('../db/users.json');
require('dotenv').config();

// Generates the token for the user who logs in
const generateToken = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

// Route to have the user log in
const login = (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(404).json({
            error: 'Wrong credentials',
        })
    };

    const token = generateToken(user);

    res.status(200).json({
        userToken: token,
    });
}

// Middleware that checks the authenticity of the token provided by the user
const authenticateUser = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(403).json({
            statusCode: 403,
            error: 'You need to authenticate',
        })
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json(err);
        }
        req.user = user;
        next();
    })
};

// Middleware that checks whether the user has the admin role
const authenticateAdmin = (req, res, next) => {
    const { username, password } = req.user;
    const user = users.find(user => user.username === username && user.password === password);
    if (!user || !user.admin) {
        return res.status(403).json({
            statusCode: 403,
            error: 'You are not authorized, you must be admin',
        });
    }
    next();
}

module.exports = {
    login,
    generateToken,
    authenticateUser,
    authenticateAdmin
}

