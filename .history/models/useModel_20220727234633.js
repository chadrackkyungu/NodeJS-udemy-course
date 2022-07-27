const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false //when you want to get all the users the password will not Appear in the object, which is good
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            //you use this for confirming password
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,

    //Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    //* this is the last part, when u want to delete the user profile
    //wen u want to delete a user, it will set that user to not being active instead of deleting him straight away, this is perfect
    //by default all user will be active, they becomes inactive after they hv deleted they are account
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});


//*(1)
// Encrypting the password / (hashing the password)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
})

//*(5)
//This Middleware check if the password was not modified
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//*(6)  100% Working
//This middleware will check if the user is active then return all the user that are active only. then u can perform anything with that
userSchema.pre(/^find/, function (next) {
    //this points to the current query
    this.find({ active: { $ne: false } }) //* $ne = not equal to false
    next();
});


//*(2)
//this comparing the password that is inside the DB to the new user password input by the user
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

//*(3)
// This part here Check if the password has been changed to the new user password input
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

//*(4)
// Password Reset
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};


const User = mongoose.model('User', userSchema);
module.exports = User;