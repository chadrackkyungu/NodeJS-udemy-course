const express = require('express')

// (1) Controllers
const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, aliasTour, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')

//this Middleware  will execute to protect our routes if the user haven't login yet
const { protect, restrictTo } = require('../controllers/authController')
const { createReview } = require('../controllers/reviewController');

//(2) init Routes
const router = express.Router()

// (3) All our routes
//TOUR API GET & POST METHOD
//[checkBody, createNewTour] this is called chaining middleware
router.route('/top-5-cheap').get(aliasTour, getAllTours)
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

//Note: [protect] is a middleware to protect our API if the user haven't logged in yet
router.route('/').get(protect, getAllTours).post(createNewTour)

//<protect> middleware, protect the user from performing a delete if he hasn't logged in 
//<restrictTo> middleware restrict the user from deleting a tour if is not an "admin"
router.route('/:id').get(getTourById).patch(updateTour).delete(protect, restrictTo('admin', 'lead-guide'), deleteTour) //! GET BY ID




//* GET THE REVIEWS ROUTES
//THIS IS WHAT WE CALL NESTED ROUTE
//* POST /tour/254far/reviews 
//* GET /tour/254far/reviews 
//* GET by ID  /tour/254far/reviews/id596
router
    .route('/:tourId/reviews')
    .post(
        protect,
        restrictTo('user'),
        createReview
    )

module.exports = router