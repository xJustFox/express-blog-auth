module.exports = (req, res, next) => {
    const statusCode = 404;
    res.format({
        html: () => res.status(statusCode).send(`<h1>${statusCode} - Page Not Found</h1>`),
        json: () => res.status(statusCode).json({
            statusCode,
            error: 'Page Not Found',
            stack: null
        })
    })
};