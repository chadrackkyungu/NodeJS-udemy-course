const express = require('express');
const { getOverview, getTour, getLoginForm } = require('../controllers/viewsController');
const { protect } = require('../controllers/authController');

const router = express.Router();

//* lecturer 182.   rendered front-end
router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour) //Note: [protect middleware] prevent the user from accessing this route if he delete the cookie in is browser 
router.get('/login', getLoginForm)

module.exports = router;
