const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')
const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    name: { type: String },
    password: { type: String },
    googleId: { type: String },
    photoLink: { type: String },
    joinDate: { type: String },
    Follow: {                                     // who follow you 
        type: [String],
        default: []
    },
    Following: {                                  //you follow  
        type: [String],
        default: []
    },
});

UserSchema.virtual('currentMonthYear').get(function () {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; // Add 1 since getMonth() returns zero-based values (0-11)
    const year = currentDate.getFullYear();
    return `${(month < 10 ? '0' : '') + month}-${year}`;
});

// Define a pre-save hook to automatically set the joinDate field
UserSchema.pre('save', function (next) {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    this.joinDate = `${(month < 10 ? '0' : '') + month}-${year}`;
    next();
});

UserSchema.plugin(findOrCreate);
const User = mongoose.model('User', UserSchema);

module.exports = User;