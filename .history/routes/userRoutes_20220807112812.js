const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('./../controllers/userController')
const { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo } = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

//* This is a middleware that will protect all the APIs end point bellow
//this is the smart way on how to protect all ur APIs using one middleware that comes before all ur routes
router.use(protect)

router.get('/me', getMe, getUser) //this API end point will get the current user details after he/she login
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

//USER API
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router