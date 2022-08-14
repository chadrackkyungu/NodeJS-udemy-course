const express = require('express');
const { getCheckoutSession, getAllBookings, createBooking, getBooking, updateBooking, deleteBooking } = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
    .route('/')
    .get(getAllBookings)
    .post(createBooking);

router
    .route('/:id')
    .get(getBooking)
    .patch(updateBooking)
    .delete(deleteBooking);

module.exports = router;
