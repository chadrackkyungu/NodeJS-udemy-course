const express = require('express');
const { getAllReviews, getReview, updateReview, deleteReview, createReview, setTourUserIds } = require("./../controllers/reviewController");
const { protect, restrictTo } = require('./../controllers/authController');

// const router = express.Router(); before lecturer 159
const router = express.Router({ mergeParams: true }); //* lecturer 159
router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    //here i have 3 middleware that will execute before a review get create
    .post(protect, restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .patch(updateReview)
    .delete(deleteReview)

// router
//     .route('/:id')
//     .get(getReview)
//     .patch(restrictTo('user', 'admin'), updateReview)
//     .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router;
