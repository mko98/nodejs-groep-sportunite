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
},
    { usePushEach: true }
);

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

const User = mongoose.model('users', UserSchema);

User.count({name: "Main user"}, function (err, count) {
    if(count < 1){
        console.log('Main user wordt toegevoegd.');
        const user = new User({
            name: "Main user",
            _id: "5a3fd41e3ef7ccda81e7dda4",
            description: "Ut vitae neque augue. Pellentesque sodales cursus eros, id bibendum felis vestibulum eu. Phasellus dignissim nulla sit amet eros placerat, in vulputate orci volutpat. Etiam in urna neque. Fusce semper nisi at turpis lacinia, nec convallis purus consectetur. Nullam sollicitudin malesuada finibus. Ut mauris quam, lacinia a nunc eget, pharetra placerat tortor. Etiam porttitor posuere eros quis condimentum. Etiam id dapibus ipsum. Maecenas vitae rutrum dui, nec efficitur urna. Etiam nec facilisis enim. Donec nec congue felis, a faucibus tortor. \n \n Curabitur ac ipsum in dui ullamcorper tristique non id elit. Aliquam dolor quam, vestibulum ac mollis sed, congue nec risus. Quisque pretium nibh erat, vel malesuada nulla sollicitudin vel. Proin ultrices, mi vitae cursus efficitur, velit ex scelerisque tellus, viverra dictum turpis ligula quis orci. Praesent at libero at libero interdum convallis nec eu magna. Donec magna mi, ullamcorper quis lobortis id, porttitor."
        });
        user.save();
    }

    else {
        console.log('Main user bestaat al, wordt niet toegevoegd.')
    }
});

module.exports=User;