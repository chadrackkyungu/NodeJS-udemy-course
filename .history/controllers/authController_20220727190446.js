const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/useModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../email');

const signToken = id => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    //Note: [correctPassword()] it's a func that is inside useModel.js 
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Please provide correct password", 401));
    }

    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})

//this is a middleware function that will protect our Tour Routes. if the user does not login, they can't access the [tour routes]
exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // (1) Get the token from the URL (req made by the user)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1] // pass the token
    };

    // (2) Verify if the token exist(or was created), if it doesn't, throw an Error
    if (!token) {
        return next(new AppError("You are not logged in! Please log in to get access.", 401))
    }

    //(3) Verify if the token is valid(if it's the same token that was created wen the user logged in) & if the token has expired or not. {Note: this part is throwing it Error inside errorController.js file}
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //(4) Verify if the user of the token after he logged in, he did not delete his account, so there, the token becomes invalid & don't logged him in
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) { return next(new AppError("The user belonging to this token does no longer exist", 401)) }

    //(5) This will execute if the user create an account & logged in, after that he change his password, then in this case the token become invalid
    //Note:this func =>  [changedPasswordAfter()] is coming in the file useModel.js
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //     return next(new AppError("User recently change password! Please log in. ", 401))
    // }

    // // GRANT ACCESS TO PROTECTED ROUTE
    // req.user = currentUser;
    // next() //Note: a middleware function has this func => [next()]
})

//<Middleware> this will check the user who logged in if is admin or not and give him the permission to delete the account
// exports.restrictTo = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new AppError(" You do not have permission to perform this action ", 403)
//             )
//         }
//         next();
//     }
// }

// Forgot Passwords
// exports.forgotPassword = catchAsync(async (req, res, next) => {

//     //(1) Get user base on POST email
//     const user = await User.findOne({ email: req.body.email })
//     if (!user) {
//         return next(new AppError("There is no user with email address ", 404))
//     }

//     //(2) Generate the random reset token 
//     //Note: this func => <createPasswordResetToken /> is coming from userModel.js file
//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false })

//     //(3) Send it to the users's email address
//     const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
//     const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Your password reset token (valid for 10 min)',
//             message
//         });

//         res.status(200).json({
//             status: 'success',
//             message: 'Token sent to email!'
//         });

//     } catch (err) {
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new AppError('There was an error sending the email. Try again later!'), 500);
//     }
// })

//Reset Passwords
exports.resetPassword = (req, res, next) => { }