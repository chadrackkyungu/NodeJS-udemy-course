const express = require('express');
const { getAllReviews, getReview, updateReview, deleteReview, createReview } = require("./../controllers/reviewController");
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });
router.use(protect);

router
    .route('/')
    .get(getAllReviews)
    .post(restrictTo('user'), createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restrictTo('user', 'admin'), updateReview)
    .delete(restrictTo('user', 'admin'), deleteReview)

module.exports = router;
