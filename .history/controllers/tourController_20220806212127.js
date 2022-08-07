const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

const { deleteOne } = require('./handlerFactory'); // write clean code an reuse functions. lecturer 161


//Functions
exports.aliasTour = async (req, res, next) => {
    req.query.limit = '5'; //i'm making a request of 5 fields only not the all API object
    req.query.sort = '-ratingsAverage,price';
    //here i'm specifying the fields that should be returned
    req.query.fields = 'name,price,ratingsAverage,summary, difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
    // try {
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
            tours,
        },
    });
    // } catch (err) {
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     });
    // }
});

exports.createNewTour = catchAsync(async (req, res, next) => {
    // try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
    // } catch (error) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: `${error}Invalid data sent!`
    //     })
    // }
});

exports.getTourById = catchAsync(async (req, res, next) => {
    // try {
    // const tour = await Tour.findById(req.params.id); //* lecturer 153 to populate the guides  IDs to object users
    // const tour = await Tour.findById(req.params.id) //* get the tour with reviews using populate. [lecturer 157]
    const tour = await Tour.findById(req.params.id).populate('reviews');

    //if the user query a tour with an ID that does not exist throw this Error
    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

    res.status(201).json({
        status: 'success',
        data: {
            tour,
        },
    });

    // } catch (error) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: 'Invalid data sent!'
    //     })
    // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
    // try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
    }

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

exports.deleteTour = deleteOne(Tour); //refactoring

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