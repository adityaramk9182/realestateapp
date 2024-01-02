const errorHandler = (statusCode, message) => {
    const err = new Error();
    err.message = message;
    err.statusCode = statusCode;
    return err;
}

module.exports = {errorHandler}