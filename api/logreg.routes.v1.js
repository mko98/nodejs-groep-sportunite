const bcrypt = require('bcrypt-nodejs');
const config = require('../config/config.json');
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const routes = express.Router();
const user = require('../model/user');

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
routes.post('/authenticate', function(req, res) {
    // find the user
    user.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            throw err;
        }
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
            return;
        }
        //TODO KOMT DOOR BCRYPT
        // if (!bcrypt.compareSync(req.body.password, user.password)) {
        //     res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        //     return;
        // }
        // if user is found and password is right
        // create a token with only our given payload
        // we don't want to pass in the entire user since that has the password
        const payload = {
            admin: user.admin
        };
        const token = jwt.sign(payload, config.secret, {
            expiresIn: 60*60 // expires in 1 hours
        });
        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token

        });
    });
});

routes.post('/register', function (req, res) {
    const usersProps = req.body;
    console.log(usersProps);

    user.create(usersProps)
        .then((user) => {
            res.status(200).send(user);

        })
        .catch((error) => res.status(400).json(error));
});

routes.get('/users/name/:name', function(req, res) {
    res.contentType('application/json');
    const name = req.param('name');
    console.log(name);
    user.findOne({name: name})
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((error) => res.status(400).json(error));
});

module.exports = routes;