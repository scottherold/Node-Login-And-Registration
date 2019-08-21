// This module handles the 'user' model
// <--- Modules --->
const mongoose = require('mongoose'); // imports mongoose for model construction
const uninqueValidator = require('mongoose-unique-validator'); // imports unique validator
const { Schema } = mongoose; // constructs empty schema object from mongoose

// <--- Schema --->
// uses blank schema object to be added to the mongoose object with export
const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address'], // REGEX email pattern
        unique: true
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'The minimum length for first name is two characters'],
        maxlength: [20, 'The maximum length for first name is twenty characters']
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'The minimum length for last name is two characters'],
        maxlength: [20, 'The maximum length for last name is twenty characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required']
    }
}, {timestamps: true});

// Unique value plugin for schema
UserSchema.plugin(uninqueValidator, {message: 'Email address is already in use, please login to continue, or use a different email address'});

// <--- Document Model --->
module.exports = mongoose.model('User', UserSchema); // Attach schema to mongoose object to create documents / chain mongoose method (added in DB connection file)