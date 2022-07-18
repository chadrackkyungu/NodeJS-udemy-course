const express = require('express')

const { getAllTours, createNewTour, getTourById, updateTour, deleteTour, aliasTour, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')

const router = express.Router()

//using this can get the param ID 
//router.param('id', checkID) //this is a middleware that check if the ID exist

//TOUR API GET & POST METHOD
//[checkBody, createNewTour] this is called chaining middleware
router.route('/top-5-cheap').get(aliasTour, getAllTours)
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createNewTour)
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour) //! GET BY ID

module.exports = router