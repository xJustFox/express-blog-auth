module.exports = (req, res, next) => {
    const statusCode = 404;
    res.format({
        json: () => res.status(statusCode).json({
            statusCode,
            error: 'Page Not Found',
            stack: null
        })
    })
};