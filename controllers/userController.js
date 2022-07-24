const User = require('./../models/useModel');
const catchAsync = require('./../utils/catchAsync');


//Functions
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find()

    res.status(200).json({
        status: 'success',
        result: users.length,
        data: {
            users
        }
    })
})


exports.createUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.getUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.updateUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}