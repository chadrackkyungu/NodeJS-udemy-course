const express = require('express');
const { getAllUsers, createNewUser, getUser } = require('./../controllers/userController')

const router = express.Router();

//USER API
router.route('/').get(getAllUsers).post(createNewUser)
router.route('/:id').get(getUser)

module.exports = router