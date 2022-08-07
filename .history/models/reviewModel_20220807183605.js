//* this is how you should always identified wat you want 
//Create : >review / >rating / >createdAt / >>ref to tour / >>ref to user 
//=> Parent referencing

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review can not be empty!']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId, // => reference ID
            ref: 'Tour', // => ref The table(file name)
            required: [true, 'Review must belong to a tour.']
        },
        user: {
            type: mongoose.Schema.ObjectId, // => ref ID 
            ref: 'User', // => ref table(file name)
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//* 1 lecturer 156
// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'tour', //name of the  foreign ID
//         select: 'name'
//     }).populate({
//         path: 'user', //name of the foreign ID
//         select: 'name photo',
//     })
//     next();
// });

//* 1 lecturer 157
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user', //name of the foreign ID
        select: 'name photo',
    })
    next();
});

//* Calculate the Average lecturer 168
//this will calculate the numb of rating each time the user create a review for a tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            //* 100% working
            ratingsQuantity: stats[0].nRating, // update this field number with the new rating value
            ratingsAverage: stats[0].avgRating // update this field number with the new rating value
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

//* 168
reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour);
});

//* 169
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next();
});

// //* 169 
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.tour)
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;