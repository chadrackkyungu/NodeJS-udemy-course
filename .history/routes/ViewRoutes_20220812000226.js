const express = require('express');
const { getOverview, getTour, getLoginForm } = require('../controllers/viewsController');
const { protect, isLoggedIn } = require('../controllers/authController');

const router = express.Router();

//* 190, this line here will protect all pages from not being access if the cookie does not exist or render dynamic data if the user does not exist
router.use(isLoggedIn)

//* lecturer 182.   rendered front-end
router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour) //Note: [protect middleware] prevent the user from accessing this route if he delete the cookie in is browser 
router.get('/login', getLoginForm)

module.exports = router;
