const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const { deleteOne, updateOne, createOne, getByIdOne, getAll } = require('./handlerFactory'); // write clean code an reuse functions. lecturer 161

//*205  multiple image upload
const multer = require('multer');//image
const sharp = require('sharp'); //image
const multerStorage = multer.memoryStorage(); //*202

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! please upload only images', 400), false)
    }
}
const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

//here i'm uploading multiple images 
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // 1) Cover image
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

    // 2) Images
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
            await sharp(file.buffer).resize(2000, 1333).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/tours/${filename}`);
            req.body.images.push(filename);
        })
    );

    next();
});

//* End


//Functions
exports.aliasTour = async (req, res, next) => {
    req.query.limit = '5'; //i'm making a request of 5 fields only not the all API object
    req.query.sort = '-ratingsAverage,price';
    //here i'm specifying the fields that should be returned
    req.query.fields = 'name,price,ratingsAverage,summary, difficulty';
    next();
};


//* refactoring 163. 100% working
exports.getAllTours = getAll(Tour); //refactoring lect 163

//* Before refactoring
// exports.getAllTours = catchAsync(async (req, res, next) => {
//     // try {
//     // EXECUTE QUERY
//     const features = new APIFeatures(Tour.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate();
//     const tours = await features.query;

//     // SEND RESPONSE
//     res.status(200).json({
//         status: 'success',
//         results: tours.length,
//         data: {
//             tours,
//         },
//     });
//     // } catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });



//* refactoring 162 
exports.createNewTour = createOne(Tour); //refactoring lect 161
//* Before refactoring
// exports.createNewTour = catchAsync(async (req, res, next) => {
//     // try {
//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour: newTour,
//         },
//     });
//     // } catch (error) {
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: `${error}Invalid data sent!`
//     //     })
//     // }
// });






//* refactoring 163  1005 working
exports.getTourById = getByIdOne(Tour, { path: 'reviews' }); //refactoring lect 163
//* Before refactoring
// exports.getTourById = catchAsync(async (req, res, next) => {
//     // try {
//     // const tour = await Tour.findById(req.params.id); //* lecturer 153 to populate the guides  IDs to object users
//     // const tour = await Tour.findById(req.params.id) //* get the tour with reviews using populate. [lecturer 157]
//     const tour = await Tour.findById(req.params.id).populate('reviews');

//     //if the user query a tour with an ID that does not exist throw this Error
//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(201).json({
//         status: 'success',
//         data: {
//             tour,
//         },
//     });

// } catch (error) {
//     res.status(400).json({
//         status: 'fail',
//         message: 'Invalid data sent!'
//     })
// }
// });










//* refactoring 162 
exports.updateTour = updateOne(Tour); //refactoring lect 161
//* Before refactoring
// exports.updateTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour,
//         },
//     });
//     // } catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });

exports.deleteTour = deleteOne(Tour); //refactoring lect 161

//* This is before refactoring. 
// exports.deleteTour = catchAsync(async (req, res, next) => {
//     // try {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//         return next(new AppError('No tour found with that ID', 404));
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null,
//     });

//     // } catch (err) {
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     });
//     // }
// });



// this API. we use mongoDb to check the number of tours, the number ratings, of price, ect...
exports.getTourStats = catchAsync(async (req, res, next) => {
    // try {
    const tour = await Tour.aggregate([{
        $match: { ratingsAverage: { $gte: 4.5 } }, //$gte //=> greater or equal. these are all provided by mongoDb
    },
    {
        $group: {
            _id: { $toUpper: '$difficulty' }, // am checking the number of ratings, average, price, etc using the fields of my object called "difficulty" & u put $sign in front.
            numTours: { $sum: 1 }, //total number of tours that has ,difficulty, easy, medium, hard ect...
            numRatings: { $sum: '$ratingsQuantity' }, //total number of ratings
            avgRating: { $avg: '$ratingsAverage' }, //the average rating
            avgPrice: { $avg: '$price' }, //the average price
            minPrice: { $min: '$price' }, //the smallest price in the tour
            maxPrice: { $max: '$price' }, //the biggest price in tour
        },
    },
    //here i'm sorting the avgPrice of the above result
    {
        $sort: { avgPrice: 1 }, //from small to biggest price
    },

        //! NOTE YOU CAN HVE MULTIPLE $match, with the line bellow, before ni return the above res to the user i sai don't return the field that is equal to 'EASY' Field result.
        // {
        //     $match: { _id: { $ne: 'EASY' } }
        // }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });

    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // try {
    const year_parm = req.params.year; // => 2022
    const year = parseInt(year_parm);

    const plan = await Tour.aggregate([{
        $unwind: '$startDates', // => [$unwind] operator is used to Deconstructs an array field from the input documents to output a document for each element
    },
    {
        //? STEP 1 MATCHES
        //this will check the tour that has the starting date of 2022-01-01 & end date of 2020-12-31
        $match: {
            startDates: {
                //this is a new field name
                $gte: new Date(`${year}-01-01`), //greater or equal 2022-01-01
                $lte: new Date(`${year}-12-31`), //less than or equal 2022-12-31
            },
        },
    },
    {
        //? STEP 2 GROUP, TO RETURN A NEW OBJECT API. this is my new object
        $group: {
            _id: { $month: '$startDates' }, //name of the field is now the [ID]
            numTourStarts: { $sum: 1 }, //count the number of tour
            tours: { $push: { name: '$name' } },

            // push the field call [$name, $summary, $description] ////{this is me}
            // tours: { $push: { name: '$name', summary: '$summary', description: '$description' } }
        },
    },
    {
        $addFields: { month: '$_id' }, // am adding another fields to my object
    },
    {
        $project: {
            _id: 0,
        },
    },
    {
        $sort: { numTourStarts: -1 }, //==> [-]  in descending order
    },
    {
        $limit: 12, // you can set a limit of the result
    },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});



// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});



//* Note: this is not working. lecturer [172]
exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

    if (!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});







//! THIS IS BEFORE REFACTORING THE TRY AND CATCH METHODS  BLOCK

/*

exports.getAllTours = async(req, res) => {
    try {
        // EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const tours = await features.query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
exports.createNewTour = async(req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: `${error}Invalid data sent!`
        })
    }
}

exports.getTourById = async(req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent!'
        })
    }
}

exports.updateTour = async(req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.deleteTour = async(req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};


// this API. we use mongoDb to check the number of tours, the number ratings, of price, ect...
exports.getTourStats = async(req, res) => {
    try {
        const tour = await Tour.aggregate([{
                $match: { ratingsAverage: { $gte: 4.5 } } //$gte //=> greater or equal. these are all provided by mongoDb
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' }, // am checking the number of ratings, average, price, etc using the fields of my object called "difficulty" & u put $sign in front.
                    numTours: { $sum: 1 }, //total number of tours that has ,difficulty, easy, medium, hard ect...
                    numRatings: { $sum: '$ratingsQuantity' }, //total number of ratings
                    avgRating: { $avg: '$ratingsAverage' }, //the average rating
                    avgPrice: { $avg: '$price' }, //the average price 
                    minPrice: { $min: '$price' }, //the smallest price in the tour
                    maxPrice: { $max: '$price' } //the biggest price in tour
                }
            },
            //here i'm sorting the avgPrice of the above result
            {
                $sort: { avgPrice: 1 } //from small to biggest price
            },

            //! NOTE YOU CAN HVE MULTIPLE $match, with the line bellow, before ni return the above res to the user i sai don't return the field that is equal to 'EASY' Field result.
            // {
            //     $match: { _id: { $ne: 'EASY' } }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};



exports.getMonthlyPlan = async(req, res) => {
    try {
        const year_parm = req.params.year; // => 2022
        const year = parseInt(year_parm);

        const plan = await Tour.aggregate([{
                $unwind: '$startDates' // => [$unwind] operator is used to Deconstructs an array field from the input documents to output a document for each element
            },
            {
                //? STEP 1 MATCHES 
                //this will check the tour that has the starting date of 2022-01-01 & end date of 2020-12-31
                $match: {
                    startDates: { //this is a new field name 
                        $gte: new Date(`${year}-01-01`), //greater or equal 2022-01-01 
                        $lte: new Date(`${year}-12-31`) //less than or equal 2022-12-31
                    }
                }
            },
            {
                //? STEP 2 GROUP, TO RETURN A NEW OBJECT API. this is my new object
                $group: {
                    _id: { $month: '$startDates' }, //name of the field is now the [ID]
                    numTourStarts: { $sum: 1 }, //count the number of tour 
                    tours: { $push: { name: '$name' } }

                    // push the field call [$name, $summary, $description] ////{this is me}
                    // tours: { $push: { name: '$name', summary: '$summary', description: '$description' } } 
                }
            },
            {
                $addFields: { month: '$_id' } // am adding another fields to my object 
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 } //==> [-]  in descending order
            },
            {
                $limit: 12 // you can set a limit of the result
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

*/

//////!!!!!!   !THIS IS HOW THIS FUNCTION LOOKS LIKE BEFORE WE MAKE IT CLEAN AND ADDED A CLASS FOR CLEAN CODE.
{
    /* 
      exports.getAllTours = async(req, res) => {
          try {
              //before filter
              // const tours = await Tour.find();

              //this part here will get all tours at the same times it will get tours according to the users search, like [filter] [sorting] 
              //easy filtering   => http://localhost:3000/api/v1/tours?duration=5&difficulty=easy
              //hte API means get th tours that has the duration === 5 and difficulty === easy
              const queryObj = {...req.query };
              const excludedFields = ['page', 'sort', 'limit', 'fields'];
              excludedFields.forEach(field => delete queryObj[field])

              // const query = Tour.find(queryObj);
              // const tours = await query; //? for easy filtering this is the answer

              //Advanced Filtering
              // http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
              //the above API means get the tours that has the duration === or greater then 5 and difficulty === easy and less then 1500
              let queryStr = JSON.stringify(queryObj);
              queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
              let query = Tour.find(JSON.parse(queryStr));
              // const tours = await query; //? for advanced filtering


              // API FOR SORTING => http://localhost:3000/api/v1/tours?sort=price Ascending order
              // API FOR SORTING => http://localhost:3000/api/v1/tours?sort=-price descending order
              if (req.query.sort) {
                  // query = query.sort(req.query.sort); //? one sorting ==> API http://localhost:3000/api/v1/tours?sort=price
                  sortBy = req.query.sort.split(',').join(' ');
                  query = query.sort(sortBy) //? double sorting ==> http://localhost:3000/api/v1/tours?sort=price,ratingsAverage
              } else {
                  query = query.sort("-createdAt") //this is the default sorting
              }

              //const tours = await query; //? for sorting 

              //LIMITING
              if (req.query.fields) {
                  const fields = req.query.fields.split(',').join(' ');
                  query = query.select(fields) //? Limit the number of field i want to render ==> http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
              } else {
                  query = query.select('-__v') //remove the last field
              }

              //const tours = await query; //? for limiting


              //PAGINATION
              const page = req.query.page * 1 || 1
              const limit = req.query.limit * 1 || 5
              const skip = (page - 1) * limit

              query = query.skip(skip).limit(limit)
              if (req.query.page) {
                  const numTours = await Tour.countDocuments();
                  if (skip >= numTours) throw new Error("This page does not exist");
              }
              const tours = await query; //? Pagination  ===> http://localhost:3000/api/v1/tours?page=1&limit=3  //page === 1 and limit === 3

              res.status(200).json({
                  status: 'success',
                  results: tours.length,
                  data: {
                      tours
                  }
              })
          } catch (error) {
              res.status(400).json({
                  status: 'fail',
                  message: 'Could not find the data!'
              })
          }
      }

      */
}