const express = require('express');
const viewsController = require('../controllers/viewsController');
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
router.get('/', (req, res) => {
    res.status(200).render('base', {
        title: 'All tours'
    })
})
router.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    })
})
router.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'the forest hiker tour'
    })
})


module.exports = router;
