/**
 * Created by Jordy Frijters on 12-12-2017.
 */
const neo4j = require('neo4j-driver').v1;

if(process.env.NODE_ENV ===  'production'){
    var driver = neo4j.driver("bolt://hobby-cfknfblfobflgbkeneknhjal.dbs.graphenedb.com:24786", neo4j.auth.basic("user", "b.0qSQcAG0a2tG.ELrDP8XCo0P9ga4s"));
}else {
    var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("", ""));
}

module.exports = driver;