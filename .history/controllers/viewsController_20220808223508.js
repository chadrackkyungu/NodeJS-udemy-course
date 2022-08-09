//* Front-end Route controller
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchSync(async (req, res, next) => {

    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})

exports.getTour = catchSync(async (req, res) => {
    res.status(200).render('tour', {
        title: 'All Tours'
    })
})
