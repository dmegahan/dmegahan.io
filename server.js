const routing = require('./src/js/routes/routing.js');
const express = require('express');
const mongoose = require('mongoose');
var session = require('express-session');

var server = express();

server.use(session({
    secret: "memes",
    resave: true,
    saveUninitialized: false
}))

server.use(express.static(__dirname + '/src/images'));
server.use(express.static(__dirname + '/src/components'));
server.use(express.static(__dirname + '/src/js'));

server.set('view engine', 'pug');
server.set('views', __dirname + '/src/views');

server.use('/', routing);

const dbName = 'dmegahanIO'
const url = 'mongodb://localhost:27017/' + dbName;

//connect to the mongo database
mongoose.connect(url, {useNewUrlParser: true});
mongoose.connection.on('connected', () => {
    server.listen(80, () => {
        console.log('HTTP server listening on port 80');
    })
})