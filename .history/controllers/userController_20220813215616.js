const User = require('./../models/useModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { deleteOne, updateOne, getByIdOne, getAll } = require('./handlerFactory'); // write clean code an reuse functions. lecturer 161

//*200
const multer = require('multer');
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(x, false)
    }
}

const upload = multer({ dest: 'public/img/users' })
exports.uploadUserPhoto = upload.single('photo')


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

//* 100% working perfect
exports.getAllUsers = getAll(User)
// * before refactoring [Get all user]
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//     const users = await User.find()

//     res.status(200).json({
//         status: 'success',
//         result: users.length,
//         data: {
//             users
//         }
//     })
// })


//* Lecturer 164
//this API end point {middleware} will get the current user details after he/she login. so when i call this API i will get my own details after login
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

//* 100% Working
//Update the user profile
exports.updateMe = catchAsync(async (req, res, next) => {

    console.log(req.file);
    console.log(req.body);

    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email'); //This means update only "name & email if the user try to update another field he want be able "

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    console.log("res", updatedUser)

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

//* Deleting my own Profile from the system  100% Working
exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});


exports.createUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined! Please use /sighup instead!" });
}

//* refactoring 163
exports.getUser = getByIdOne(User)
// exports.getUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: "this route is not yet defined" })
// }


//* refactoring
exports.updateUser = updateOne(User) // Do not update passwords with this!
// exports.updateUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: "this route is not yet defined" })
// }



//* refactoring 161
exports.deleteUser = deleteOne(User); //* 100% working

//before refactoring
// exports.deleteUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: "this route is not yet defined" })
// }