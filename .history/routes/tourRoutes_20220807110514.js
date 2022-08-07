const express = require('express')

// (1) Controllers
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, aliasTour, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')

//this Middleware  will execute to protect our routes if the user haven't login yet
const { protect, restrictTo } = require('../controllers/authController')
const reviewRouter = require('./../routes/reviewRoutes');

//(2) init Routes
const router = express.Router()

//This is the review routes //* lecturer 159
router.use('/:tourId/reviews', reviewRouter)

// (3) All our routes
//TOUR API GET & POST METHOD
//[checkBody, createNewTour] this is called chaining middleware
router.route('/top-5-cheap').get(aliasTour, getAllTours)
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

//Note: [protect] is a middleware to protect our API if the user haven't logged in yet
router.route('/').get(protect, getAllTours).post(protect, restrictTo('admin', 'lead-guide'), createNewTour)

//<protect> middleware, protect the user from performing a delete if he hasn't logged in 
//<restrictTo> middleware restrict the user from deleting a tour if is not an "admin"
router.route('/:id').get(getTourById).patch(protect, restrictTo('admin', 'lead-guide'), updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour) //! GET BY ID




//* GET THE REVIEWS ROUTES
//THIS IS WHAT WE CALL NESTED ROUTE
//* POST /tour/254far/reviews 
//* GET /tour/254far/reviews 
//* GET by ID  /tour/254far/reviews/id596
//* this is a bad practice
// router
//     .route('/:tourId/reviews') // real world http://api/v1/tours/62e4cd89959c77d481935520/reviews // this is [62e4cd89959c77d481935520] the tour ID
//     .post(protect, restrictTo('user'), createReview) //create a new review, only if u are a user, if not, u are restricted

module.exports = router