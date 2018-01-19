const bcrypt = require('bcrypt-nodejs');
const config = require('../config/config.json');
const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const routes = express.Router();
const user = require('../model/user');

// route middleware to verify a token
routes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.headers.token;

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        if (req.method === 'OPTIONS') {
            return res.status(202).send({
                success: false,
                message: 'No token provided.'
            });
        }
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

module.exports = routes;