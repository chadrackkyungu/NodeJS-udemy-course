//* Front-end Route controller
const Tour = require('../models/tourModel');
const User = require('../models/useModel'); //*lect 195 
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//*Home page
exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    console.log(tours);

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})


//*Detail page
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'reviews rating user',
    });

    //if the user try to access a tour that does not exist this error will occur
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }
    res
        .status(200)
        .set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
        )
        .render('tour', {
            title: `${tour.name}`,
            tour,
        });
});

//*Login page
exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
};


//* Account page
exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

//*Render page
exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});
