const git = require('../GithubCommitLink.js');
const fetch = require('isomorphic-fetch');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');

router.use(bodyParser.urlencoded({extended: true}));

router.use(session({
    secret: 'git gud',
    resave: true,
    saveUninitialized: false
}));

//get latest Commit (as Promise), then assign the promise value
var latestCommit = git.getLatestCommit();
latestCommit.then(value => {
    latestCommit = value;
});

router.get('/', (req, res) => {
    //pug implementation
    res.render('index.pug', 
    {
        githubCommit_short: latestCommit['gitCommit-short'],
        githubCommit_hash: latestCommit['gitCommit-hash']
    });
});

router.get('/blog', (req, res) => {
    //server-side fetch requires the full url, so generate the baseUrl based off the request
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    //query the api endpoint set up in server.js
    fetch(baseUrl + '/posts', {method: 'GET'})
        .then(function(res){
            if(res.ok)
            {
                //do a GET request, get all the blog posts from the request
                return res.json();
            }
            throw new Error('Request failed.');
        })
        .then(function(data) {
            //render the blog.pug layout, insert all posts from the GET request into the template
            res.render('blog.pug', 
            {
                posts: data, 
                githubCommit_short: latestCommit['gitCommit-short'],
                githubCommit_hash: latestCommit['gitCommit-hash'],
            });
        })
});

router.get('/login', (req, res) => {
    res.render('login.pug');
});


var User = require("../../models/user.model");
router.post('/userLogin', (req, res) => {
    User.authenticate(req.body.username, req.body.password, (error, user) => {
        //callback 
        if(error || !user) {
            var err = new Error('Wrong username or password.');
            err.status = 401;
            return next(err);
        }
        else
        {
            //pulls _id from mongodb generated ID
            req.session.userId = user._id;
            return res.redirect('/');
        }
    });
});

var Post = require("../../models/post.model");
router.get('/posts', (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) return console.log(err);
        res.send(posts);
    });
});

module.exports = router;