const express = require('express');
const { getOverview, getTour } = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();


//* lecturer 182.   rendered front-end
router.get('/', getOverview);
router.get('/tour', getTour)

module.exports = router;
