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


exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});


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