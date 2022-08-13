const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require("express-rate-limit"); //* this will limit the user from attempting to login multiple time
const helmet = require('helmet');
const mongoSanitize = require("express-mongo-sanitize");
const xss = require('xss-clean');
const hpp = require("hpp");
const cookieParser = require('cookie-parser'); //* Lect 189

//Error handling Middleware
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers-Errors/errorController');

//Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/ViewRoutes');
const { log } = require('console');
const { login } = require('./controllers/authController');
const app = express();

//*this is for the Front-end
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// app.use(express.static(path.join(__dirname, 'public', 'index.html')))
//app.use(express.static(`${__dirname}/public`)) //loading static files [Load our html files] //*lecturer 176
app.use(express.static(path.join(__dirname, 'public')))


//* lecturer 144 Set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false, }))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); //each time u make a request you will get the the message next to the request
}

//* [Lecturer 143] This is a middleware that that count the number of request the user can make from 1 IP address. 100% working
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'To many request from this IP, please try again in an hour'
})
app.use('/api', limiter)
//* end

app.use(express.json({ limit: '10kb' })); //*this is a middleware that allow u to send data
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //*195
app.use(cookieParser()); //*lecturer 189

//Data sanitization against NoSQL query injection
app.use(mongoSanitize()) //* 100% working

//Data sanitize
app.use(xss()); //* 100% working

//*  Prevent parameter pollution
app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);


// Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.cookies)  //*lecturer 189] this will show cookie in the console
    next()
})

//*Front-end routes
app.use('/', viewRouter)

//Api Routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

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