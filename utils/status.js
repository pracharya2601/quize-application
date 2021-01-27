const sendError = (res, status, message) => error => {
    res.status(status || error.status).json({
        type: 'error',
        message: message || error.message,
        error
    })
}

const sendSuccess = (res, message) => data => {
    res.status(200).json({type: 'success', message, data})
}

exports.sendError = sendError;
exports.sendSuccess = sendSuccess;