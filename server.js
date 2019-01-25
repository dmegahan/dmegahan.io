const routing = require('./src/js/routes/routing.js');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;

var server = express();

server.use(express.static(__dirname + '/src/images'));
server.use(express.static(__dirname + '/src/components'));
server.use(express.static(__dirname + '/src/js'));

server.set('view engine', 'pug');
server.set('views', __dirname + '/src/views');

server.use('/', routing);

let db;
const dbName = 'dmegahanIO'
const url = 'mongodb://localhost:27017';

MongoClient.connect(url, (err, client) => {
    if(err)
    {
        return console.log("Error: " + err);
    }
    db = client.db(dbName);
    server.listen(80, () => {
        console.log('HTTP server listening on port 80');
    })
});

server.get('/posts', (req, res) => {
    db.collection('posts').find().toArray((err, result) => {
        if(err) return console.log(err);
        res.send(result);
    })
});