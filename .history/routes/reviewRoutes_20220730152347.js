const express = require('express');
const { getAllReviews, getReview, updateReview, deleteReview, createReview } = require("./../controllers/reviewController");
const { protect } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(authController.restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(authController.restrictTo('user', 'admin'), updateReview)
    .delete(authController.restrictTo('user', 'admin'), deleteReview);

module.exports = router;
