const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe } = require('./../controllers/userController')
const { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo } = require('./../controllers/authController');
const { createReview } = require('./../controllers/reviewController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

//USER API
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);



//THIS IS WHAT WE CALL NESTED ROUTE
//* POST /tour/254far/reviews 
//* GET /tour/254far/reviews 
//* GET by ID  /tour/254far/reviews/id596
router
    .route('/:tourId/reviews')
    .post(
        protect,
        restrictTo('user'),
        createReview
    )


module.exports = router