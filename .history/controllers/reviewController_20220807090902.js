const Review = require('./../models/reviewModel');
const { deleteOne, updateOne, createOne, getByIdOne } = require('./handlerFactory'); // write clean coe an reuse functions
const catchAsync = require('./../utils/catchAsync');

// exports.setTourUserIds = (req, res, next) => {
//   // Allow nested routes
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   if (!req.body.user) req.body.user = req.user.id;
//   next();
// };

exports.getAllReviews = catchAsync(async (req, res, next) => {

    //using this you get all available reviews
    // const reviews = await Review.find(); //* before lect 160

    //using this method, you will get all reviews per specific tour. //* 100% working
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const reviews = await Review.find(filter);
    //end

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})


//* after refactoring  100% working] this part here is the one bellow in green. lecturer 162
//* this becomes a middleware, so it will first execute before before creating the review
exports.setTourUserIds = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next()
}
exports.createReview = createOne(Review); //delete function //* 100% working

//*before refactoring
// exports.createReview = catchAsync(async (req, res, next) => {

//     allow the nested route. lecturer 158
//*     if (!req.body.tour) req.body.tour = req.params.tourId;
//*     if (!req.body.user) req.body.user = req.user.id;

//     const newReview = await Review.create(req.body);

//     res.status(200).json({
//         status: 'success',
//         results: newReview.length,
//         data: {
//             review: newReview
//         }
//     })
// })



//* after refactoring  100% working. lect 163
exports.getReview = getByIdOne(Review); //delete function [get review by review ID]

//*before refactoring
// exports.getReview = catchAsync(async (req, res, next) => {
//     const reviews = await Review.find();
//     res.status(201).json({
//         status: 'success',
//         results: reviews.length,
//         data: {
//             reviews
//         }
//     })
// })


//* after refactoring  100% working
exports.updateReview = updateOne(Review); //delete function

//*before refactoring
// exports.updateReview = catchAsync(async (req, res, next) => {
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         results: newReview.length,
//         data: {
//             reviews: newReview
//         }
//     })
// })

//* after refactoring 
exports.deleteReview = deleteOne(Review); //delete function

//*before refactoring
// exports.deleteReview = catchAsync(async (req, res, next) => {
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status: 'success',
//         results: newReview.length,
//         data: {
//             reviews: newReview
//         }
//     })
// })


// exports.getAllReviews = factory.getAll(Review);
// exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);
