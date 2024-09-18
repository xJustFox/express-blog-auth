module.exports = (req, res, next) => {
    const posts = require('../db/postsDB.json');
    const postFound = posts.find(p => p.slug === req.params.slug);

    if (!postFound) {
        const statusCode = 404;
        return res.status(statusCode).json({
            statusCode,
            error: 'Post Not Found',
            stack: null
        })
    } 

    next();
}