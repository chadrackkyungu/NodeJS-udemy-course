//* Front-end Route controller
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchSync(async (req, res, next) => {

    // 1) Get tour data from collection
    const tours = await Tour.find();

    // 2) Build template
    // 3) Render that template using tour data from 1)

    res.status(200).render('overview', {
        title: 'All Tours'
    })
})

exports.getTour = catchSync(async (req, res) => {
    res.status(200).render('tour', {
        title: 'All Tours'
    })
})
