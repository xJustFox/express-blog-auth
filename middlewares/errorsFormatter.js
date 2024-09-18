module.exports = (err, req, res, next) => {
    const statusCode = 500;
    res.format({
        json: () => res.status(statusCode).json({ statusCode, error: err.message, stack: err.stack })
    })
}