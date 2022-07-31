const express = require('express');
const { getAllReviews, getReview, updateReview, deleteReview } = require("./../controllers/reviewController");
const { protect } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

module.exports = router;
