const express = require('express');
const multer = require('multer');
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe } = require('./../controllers/userController')
const { signup, login, forgotPassword, resetPassword, updatePassword, protect, restrictTo, logout } = require('./../controllers/authController');

const upload = multer({
    dest: 'public/img/users'
})

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout); //* Lect 192
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

//* This is a middleware that will protect all the APIs end point bellow
//this is the smart way on how to protect all ur APIs using one middleware that comes before all ur routes
router.use(protect)

router.get('/me', getMe, getUser) //this API end point will get the current user details after he/she login
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

//* this middleware will protect this APIs from no one who is an admin to have access to them
router.use(restrictTo('admin')) //100% working 

//USER API
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router