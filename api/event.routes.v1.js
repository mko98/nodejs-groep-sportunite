/**
 * Created by Jordy Frijters on 18-12-2017.
 */
const express = require('express');
const routes = express.Router();
const mongodb = require('../config/mongo.db');
const Event = require('../model/event.model');
const User = require('../model/user');
const mongoose = require('mongoose');

routes.delete('/events/:id/:eventid', function(req, res){
    res.contentType('application/json');
    const userId = req.params.id;
    const eventId = req.params.eventid;

    console.log(userId);
    console.log(eventId);

    User.findById(userId)
        .then((users) => {
            users.events.remove(eventId);
            users.save();
        })
        .then(() => res.status(200).json({
            'status': 'User is added.'
        }))
        .catch((error) => {
        console.log(error);
        res.status(400).json(error);
        });
});

routes.get('/events', function(req, res) {
    res.contentType('application/json');
    Event.find({})
        .populate({
            path: 'events'
        })
        .then((events) => {
            res.status(200).json(events);
        })
        .catch((error) => res.status(400).json(error));
});

routes.get('/events/check/:id/:eid', function(req, res) {
    res.contentType('application/json');
    const id = req.param('id');
    const eid = req.param('eid');

    User.findById(id)
        .then((user) => {
            const isInArray = user.events.some(function (eventId) {
                return eventId === eid;
            });
            console.log(isInArray);
    }).then((isInArray) => {
            res.status(200).json({'signedIn': isInArray})
    }).catch((error) => {
        console.log(error);
        res.status(400).json(error)
    });
});

routes.get('/events/:id', function(req, res) {
    res.contentType('application/json');
    const id = req.param('id');

    Event.findOne({_id: id})
        .populate({
            path: 'users'
        })
        .then((events) => {
            res.status(200).send(events
            );
        })
        .catch((error) => res.status(400).json(error));
});

routes.post('/events', function(req, res) {
    const eventsProps = req.body;

    Event.create(eventsProps)
        .then((events) => {
            res.status(200).send(events)
        })
        .catch((error) => res.status(400).json(error))
});

routes.put('/events/:id/:eventid', function(req, res){
    res.contentType('application/json');
    const userId = req.param('id');
    const eventId = req.param('eventid');

    User.findById(userId)
        .then((user) => {
            user.events.push(eventId);
            user.save();
            res.status(200).json({'nice': 'nice'});
        })
        .catch((error) => {
        console.log(error);
        res.status(400).json(error)
        });
});

routes.put('/events/:id', function(req, res) {
    res.contentType('application/json');
    const eventId = req.params.id;
    const eventProps = req.body;

    Event.findByIdAndUpdate({_id: eventId}, eventProps)
        .then(()=> events.findById({_id: eventId}))
        .then(events => res.send(events))
        .catch((error) => res.status(400).json(error))

});

routes.delete('/events/:id', function(req, res) {
    const id = req.param('id');
    Event.findByIdAndRemove(id)
        .then((status) => res.status(200).send(status))
        .catch((error) => res.status(400).json(error))
});


module.exports = routes;