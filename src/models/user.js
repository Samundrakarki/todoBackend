const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require ('./../db/mongoose')

//model for the input from the user
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50
    },
    middleName: {
        type: String,
        required: false,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 50
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse');
    
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;

}

// //login
userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email});
    if(!email) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
         throw new Error('Unable to login')
    }
    return user;
}

//hashing the password using schema.pre save.
userSchema.pre('save', async function(next) {
    const user = this 

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;