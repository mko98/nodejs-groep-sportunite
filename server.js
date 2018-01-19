const http = require('http');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongodb = require('./config/mongo.db');
const authroutes_v1 = require('./api/auth.routes.v1');
const eventroutes_v1 = require('./api/event.routes.v1');
const logregroutes_v1 = require('./api/logreg.routes.v1');
const usersroutes_v1 = require('./api/users.route.v1');
const config = require('./config/config.json');
const env = require('./config/env/env');

const app = express();

module.exports = {};

app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

app.set('port', (process.env.PORT | env.env.webPort));
app.set('env', (process.env.ENV | 'development'));

app.use(logger('dev'));

//use sessions for tracking logins
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false
}));



// CORS headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/api/v1', logregroutes_v1);
app.use('/api/v1', authroutes_v1); // Deze als eerst om de andere endpoints te beveiligen met web tokens
app.use('/api/v1', usersroutes_v1);
app.use('/api/v1', eventroutes_v1);


app.use(function (err, req, res, next) {
    // console.dir(err);
    var error = {
        message: err.message,
        code: err.code,
        name: err.name,
        status: err.status
    };
    res.status(401).send(error);
});

app.use('*', function (req, res) {
    res.status(400);
    res.json({
        'error': 'Deze URL is niet beschikbaar.'
    });
});

app.listen(env.env.webPort, function () {
    console.log('De server luistert op port ' + app.get('port'));
    console.log('Zie bijvoorbeeld http://localhost:3000/api/v1/games');
});
