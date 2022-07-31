const Review = require('./../models/reviewModel');
// const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };


exports.getAllReviews = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        results: newReview.length,
        data: {
            reviews: newReview
        }
    })
})

exports.getReview = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();
    res.status(201).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        results: newReview.length,
        data: {
            reviews: newReview
        }
    })
})

exports.updateReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        results: newReview.length,
        data: {
            reviews: newReview
        }
    })
})

exports.deleteReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        results: newReview.length,
        data: {
            reviews: newReview
        }
    })
})


// exports.getAllReviews = factory.getAll(Review);
// exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);
