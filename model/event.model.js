const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = require('./user').UserSchema;

const EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sportComplex: {
        type: String,
        required: true
    },
    sportHall: {
        type: String,
        required: true
    },
    sport: {
        type: String,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    host: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

},
    { usePushEach: true }
    );




const Event = mongoose.model('event', EventSchema);

Event.count({}, function (err, count) {
    if(count < 5){
        console.log('add a event');
        const event = new Event({
            name: "Zaalvoetbal in Breda",
            price: 5,
            sportComplex: "Gymzaal Archimedesstraat",
            sportHall: "Zaal 1",
            sport: "Voetbal",
            availability: true
        });
        event.save();
    }

    else {
        console.log('zit al een game in de db')
    }
});




module.exports = Event;