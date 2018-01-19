const express = require('express');
const routes = express.Router();
const mongodb = require('../config/mongo.db');
const user = require('../model/user');
const mongoose = require('mongoose');
var neo4j = require('neo4j-driver').v1;
var User = require('../model/user');

const driver = neo4j.driver("bolt://hobby-enijlnibeelmgbkeemjbflal.dbs.graphenedb.com:24786", neo4j.auth.basic("sportunite", "b.xYmQxl63MSV6.hoiqvOBnteMuANOG"));
const session = driver.session();

routes.get('/users/friends/:id', function(req, res) {
    res.contentType('application/json');
  var ids = [];
  const id = req.param('id');

  session
    .run("MATCH (n:User{mongoUserId: {idNeo}})--(b:User) RETURN b", {idNeo: id})
    .then(function(result) {
      result.records.forEach(function(record){
        ids.push(record._fields[0].properties.mongoUserId);
      });
      console.log(ids);
      return ids;
    })
    .then((ids)=>{
      User.find({_id: { $in: ids}})
          .then((blogPost) => {
          res.status(200).json(blogPost);
        })
    })
    .catch((error) => {
      res.status(400).json(error);
    })
});

// routes.get('/users/friends/:id/:aid', function(req, res) {
//   //res.contentType('application/json');
//   const id = req.param('id');
//   const aid = req.param('aid');
//   var ids = [];
//
//   session
//     .run("MATCH (p:User {mongoUserId: {idNeo}}), (b:User {mongoUserId: {idNeoB}}) RETURN EXISTS( (p)-[:FRIENDS_WITH]-(b))", {idNeo: id, idNeoB: aid})
//     .then(function(result) {
//       console.log("gelukt");
//       result.records.forEach(function(record){
//         ids.push(record._fields[0]);
//       });
//       return result._fields[0];
//     })
//     .catch((error) => {
//       res.status(400).json(error);
//     })
// });

routes.get('/users/friendsoffriends/:id', function(req, res) {
  res.contentType('application/json');
  var ids = [];
  const id = req.param('id');

  session
    .run("MATCH (n:User{mongoUserId: {idNeo}}) MATCH  (n)-[:FRIENDS_WITH*2]-(m) WHERE NOT (n)-[:FRIENDS_WITH]-(m) AND n <> m RETURN m", {idNeo: id})
    .then(function(result) {
      result.records.forEach(function(record){
        ids.push(record._fields[0].properties.mongoUserId);
      });
      console.log(ids);
      return ids;
    })
    .then((ids)=>{
      User.find({_id: { $in: ids}})
          .then((blogPost) => {
          res.status(200).json(blogPost);
        })
    })
    .catch((error) => {
      res.status(400).json(error);
    })
});

routes.post('/users/befriend/:id/:aid', function (req, res) {
    res.contentType('application/json');

    const id = req.param('id');
  const aid = req.param('aid');

    session
    .run("MERGE (n:User {mongoUserId:{idNeo}}) MERGE (b:User {mongoUserId:{idNeoUs}}) MERGE (n)-[:FRIENDS_WITH]->(b) MERGE (b)-[:FRIENDS_WITH]->(n)", {idNeo: id, idNeoUs: aid})
    .then(function(result) {
      res.status(200).json({"response": "User added to friend list."});
      session.close();
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});


routes.delete('/users/defriend/:id/:aid', function(req, res) {
  res.contentType('application/json');
  var ids = [];
  const id = req.param('id');
  const aid = req.param('aid');


  session
    .run("MATCH (n:User{mongoUserId: {idNeo}}) MATCH (b:User{mongoUserId: {idNeo2}}) MATCH (n)-[r:FRIENDS_WITH]-(b) DELETE r", {idNeo: id, idNeo2: aid})
    .then(function(result) {
      result.records.forEach(function(record){
        ids.push(record._fields[0].properties.mongoUserId);
      });
      res.status(200).json({"status": "friend deleted"});
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

routes.get('/users', function(req, res) {
    res.contentType('application/json');
    user.find({})
        .then((user) => {
        res.status(200).send(user);
})
    .catch((error) => res.status(400).json(error));
});

routes.get('/users/:id', function(req, res) {
    res.contentType('application/json');
    const id = req.param('id');
    console.log(id);
    user.findOne({_id: id})
        .then((user) => {
        res.status(200).send(user);
})
    .catch((error) => res.status(400).json(error));
});

routes.get('/test/:eventid', function(req, res) {
    res.contentType('application/json');
    const test = req.param('eventid');
    User.find( { events: { $in: [test] } } )
        .then((user) => {
            res.status(200).send(user);
        })
        .catch((error) => res.status(400).json(error));
});

routes.post('/users', function(req, res) {
    res.contentType('application/json');

    const usersProps = req.body;

    user.create(usersProps)
        .then((user) => {
        res.status(200).send(user)
})
    .catch((error) => res.status(400).json(error))
});

routes.put('/users/:id', function(req, res) {
    res.contentType('application/json');
    const userId = req.params.id;
    const userProps = req.body;

    user.findByIdAndUpdate({_id: userId}, userProps)
        .then(()=> user.findById({_id: userId}))
    .then(user => res.send(user))
    .catch((error) => res.status(400).json(error))

});

routes.delete('/users/:id', function(req, res) {
    const id = req.param('id');
    user.findByIdAndRemove(id)
        .then((status) => res.status(200).send(status))
    .catch((error) => res.status(400).json(error))
});


module.exports = routes;
