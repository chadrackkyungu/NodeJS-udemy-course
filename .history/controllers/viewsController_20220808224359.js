//* Front-end Route controller
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {

    const tours = await Tour.find();
    console.log(tours);

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.getTour = catchAsync(async (req, res) => {
    res.status(200).render('tour', {
        title: 'All Tours'
    })
})
