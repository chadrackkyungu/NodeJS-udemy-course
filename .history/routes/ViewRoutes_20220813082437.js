const express = require('express');
const { getOverview, getTour, getLoginForm, getAccount } = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');

const router = express.Router();

//* 190, this line here will protect all pages from not being access if the cookie does not exist or render dynamic data if the user does not exist
// router.use(isLoggedIn) //*194

//* lecturer 182.   rendered front-end
router.get('/', isLoggedIn, getOverview);
//*before
//router.get('/tour/:slug', protect, getTour) //Note: [protect middleware] prevent the user from accessing this route if he delete the cookie in is browser 
router.get('/tour/:slug', isLoggedIn, getTour) //*194 
router.get('/login', isLoggedIn, getLoginForm)
router.get('/me', protect, getAccount) //* lect 194
router.get('/submit-user-data', updateUserData) //* lect 195

module.exports = router;
