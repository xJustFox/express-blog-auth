const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1h'});

const authenticateUser = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(403).json({
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
}


module.exports = {
    generateToken,
    authenticateUser
}

