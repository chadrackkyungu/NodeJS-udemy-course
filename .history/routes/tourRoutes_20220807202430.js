const express = require('express')

// (1) Controllers
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, aliasTour, getTourStats, getMonthlyPlan, getToursWithin } = require('./../controllers/tourController')

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
router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide'), getMonthlyPlan);

//This is the Geo Spatial API end point
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin)

//Note: [protect] is a middleware to protect our API if the user haven't logged in yet
router.route('/').get(protect, getAllTours).post(protect, restrictTo('admin', 'lead-guide', 'guide'), createNewTour)

//<protect> middleware, protect the user from performing a delete if he hasn't logged in 
//<restrictTo> middleware restrict the user from deleting a tour if is not an "admin"
router.route('/:id').get(getTourById).patch(protect, restrictTo('admin', 'lead-guide'), updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour) //! GET BY ID


module.exports = router