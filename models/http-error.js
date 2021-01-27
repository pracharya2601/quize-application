class HttpError extends Error {
    constructor(message, errorCode) {
        super();
        this.code = errorCode;
        this.message = message;
    }
}

module.exports = HttpError;