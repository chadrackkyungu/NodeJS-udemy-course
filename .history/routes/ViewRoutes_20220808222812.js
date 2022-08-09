const express = require('express');
const { getOverview, getTour } = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.get('/', authController.isLoggedIn, viewsController.getOverview);
// router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
// router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
// router.get('/me', authController.protect, viewsController.getAccount);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );


//* lecturer 176
//*rendered front-end
router.get('/', getOverview);
router.get('/tour', getTour)

module.exports = router;
