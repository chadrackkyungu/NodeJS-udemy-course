const crypto = require("crypto");
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

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    //* lecturer 142 Cookies
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        secure: true,
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });

    createSendToken(newUser, 201, res);
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

    createSendToken(user, 200, res);
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
    console.log(currentUser)

    if (!currentUser) { return next(new AppError("The user belonging to this token does no longer exist", 401)) }

    //(5) This will execute if the user create an account & logged in, after that he change his password, then in this case the token become invalid
    //Note:this func =>  [changedPasswordAfter()] is coming in the file useModel.js
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently change password! Please log in. ", 401))
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next() //Note: a middleware function has this func => [next()]
})

//<Middleware> this will check the user who logged in if is admin or not and give him the permission to delete the account
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(" You do not have permission to perform this action ", 403)
            )
        }
        next();
    }
}

//! 100% working
// Forgot Passwords
exports.forgotPassword = catchAsync(async (req, res, next) => {

    //(1) Get user base on POST email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("There is no user with email address ", 404))
    }

    //(2) Generate the random reset token 
    //Note: this func => <createPasswordResetToken /> is coming from userModel.js file
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false })

    //(3) Send it to the users's email address
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to your email!'
        });

    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!'), 500);
    }
})

//! 100% working
//Reset Passwords
exports.resetPassword = catchAsync(async (req, res, next) => {

    //1) Get the user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    // 3) Update changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
})

//! 100% working
//* Update the user password
exports.updatePassword = catchAsync(async (req, res, next) => {
    //1) Get user from the collection
    const user = await User.findById(req.user.id).select('+password');

    //2) Check if posted current password is correct 
    //Note: [correctPassword]func is coming from userModel.js file
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    //3) If so update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    const users = await user.save(); //this is the best practiced than using update when working with authentication 

    createSendToken(user, 200, res);
})
