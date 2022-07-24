//! this file will throw Error in development mode & production mode. All kinds of Errors
const AppError = require('./../utils/appError');
const dotenv = require('dotenv').config();

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

//! ( TOKEN)
//Token Invalid Token throw this Error in production
const handleJWTError = () => new AppError("Invalid token. Please login Again", 401);

//Token expired throw this Error in production
const handleJWTExpiredError = () => new AppError("Your token has expired! Please log in again", 401);
//! END

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = (err, req, res, next) => {
    // console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        //This error will be thrown in dev mode
        // if (error.name === 'jsonWebTokenError') error = handleJWTError()
        // if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);


        //! ( TOKEN)
        //This Error it when you are working with Authentication
        //Note: this Error will be thrown in production
        if (error.name === 'jsonWebTokenError') error = handleJWTError() // this throw an Error if the token is diff from the one that the user logged in with

        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError() // this throw the Error if the token has expired you u try & access the application

        sendErrorProd(error, res);
    }
};