const express = require('express');
const { getAllReviews, getReview, updateReview, deleteReview, createReview, setTourUserIds } = require("./../controllers/reviewController");
const { protect, restrictTo } = require('./../controllers/authController');

// const router = express.Router(); before lecturer 159
const router = express.Router({ mergeParams: true }); //* lecturer 159
router.use(protect); //protect the routes (APIs) bellow from being Access if you haven't login

router
    .route('/')
    .get(getAllReviews)
    //here i have 2 middleware that will execute before a review get create
    //this middleware will allow only users to post reviews no amin or tour guid can post a reviews
    .post(restrictTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    //this 2 peoples can not update or delete a review
    .patch(protect, restrictTo('user', 'admin'), updateReview)
    .delete(protect, restrictTo('user', 'admin'), deleteReview)

module.exports = router;
