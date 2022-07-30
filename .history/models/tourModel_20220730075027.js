const mongoose = require('mongoose');
const slugify = require('slugify');

//* lecturer 151
const User = require('./useModel');

const tourSchema = new mongoose.Schema({
    // this means if i try to send data without name & price, it will throw an error
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters']
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String, //this is the the middleware under the schema
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String], //Array
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false //Wen the user query this API he want see this fields coz it is hiden
    },
    startDates: [Date], //Array

    secretTour: {
        type: Boolean,
        default: false
    },


    //* lecturer 150
    //*THIS IS HOW YOU CAN CREATE A DE NORMALIZATION(Embedded)
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    //* here this array will contain all the users ID that are Guiding this tour
    guides: Array, //* array of user IDs
    //*end

},

    {
        //this object here work together with the bellow tourSchema to return the duration of a tour
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

//when u do get all tour request u will see the duration field been added to our API
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7; //days divide by 7
});

// DOCUMENT MIDDLEWARE: we are creating a middleware that will convert the string user data to lower case before the data passes to the database
// [this slug it wen u are saving to the database]
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

//*lecturer 151  middleware
//* i'm comparing the user ID that coming from the postman with the one inside [DB users] the if the are the same replace those IDs with this users
tourSchema.pre('save', async function (next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises);
    next();
});




/// [this slug it wen u are creating to the database]

// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
    next();
});

const Tour = mongoose.model('Tours', tourSchema)

module.exports = Tour