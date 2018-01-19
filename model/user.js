const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EventSchema = require('./event.model').EventSchema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: false
    },
    avatarURL:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
    events:[{
        type: String
    }]
});

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, bcrypt.genSaltSync(10), null, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

module.exports=User;