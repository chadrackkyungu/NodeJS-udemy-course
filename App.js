const express = require('express')
const morgan = require('morgan');

//Error handling Middleware
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers-Errors/errorController');

//Routes
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); //each time u make a request you will get the the message next to the request
}

app.use(express.json()) //this is a middleware that allow u to send data
    // app.use(express.static(path.join(__dirname, 'public', 'index.html')))
app.use(express.static(`${__dirname}/public`)) //loading static files [Load our html files]

// Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

//Api Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


//THIS COE HERE IT IS FOR THE ERROR HANDLING
//this code have been refactored, to avoid too much code duplication. it was the one at the bottom
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;




//! THIS IS ERROR HANDLING BEFORE appError.js and controllerError.js
/*
// This is a middleware that will return an Error message if the user query a wrong or misspell the API
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    err.status = "fails"
    err.statusCode = 404
    next(err)
});

//this middleware will throw an Error if the user request an API that does not exist including the API it self
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
})
*/