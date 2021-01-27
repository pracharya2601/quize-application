const throwError = (code, errorType, errorMessage) => error => {
    if (!error) error = new Error(errorMessage || 'Default Error')
    error.code = code
    error.errorType = errorType
    throw error
  }


const throwIf = (fn, code, errorType, errorMessage) => result => {
    if(fn(result)) {
        return throwError(code, errorType, errorMessage)()
    }
    return result
}

const sendSuccess = (res, message) => data => {
    res.status(200).json({type: 'success', message, data})
}

const sendError = (res, status, message) => error => {
    return res.status(status || error.status).json({
        type: 'error',
        message: message || error.message,
        error
    })
}

exports.throwError = throwError;
exports.sendError = sendError;
exports.sendSuccess = sendSuccess;
exports.throwIf = throwIf;