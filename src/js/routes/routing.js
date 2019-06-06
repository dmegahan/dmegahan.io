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

router.get('/blog', (req, res, next) => {
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

router.get('/blog/:title', (req, res, next) => {
    //parse the :title and try to find a match (hyphens in place of spaces)
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    fetch(baseUrl + '/posts/' + req.params.title, {method: 'GET'})
        .then(function(res){
            if(res.ok)
            {
                return res.json();
            }
            throw new Error('Request failed.');
        })
        .then(function(data) {
            res.render('blog.pug',
            {
                posts: data,
                githubCommit_short: latestCommit['gitCommit-short'],
                githubCommit_hash: latestCommit['gitCommit-hash'],
            });
        });
});

router.get('/login', (req, res) => {
    res.render('login.pug');
});

var User = require("../../models/user.model");
router.post('/login', (req, res, next) => {
    if( req.body.username &&
        req.body.password)
        {
            User.authenticate(req.body.username, req.body.password, (error, user) => {
                //callback 
                if(error || !user) {
                    var err = new Error('Wrong username or password.');
                    err.status = 401;
                    next(err);
                }
                else
                {
                    //pulls _id from mongodb generated ID
                    req.session.userId = user._id;
                    return res.redirect('/create');
                }
            });
        } else {
            //TODO: add error here
        }
});

var Post = require("../../models/post.model");
router.get('/posts', (req, res, next) => {
    Post.find({}, (err, posts) => {
        if(err) next(err);
        res.send(posts);
    });
});

router.get('/posts/:title', (req, res, next) => {
    Post.find({urlTitle: req.params.title}, (err, posts) => {
        if(err) next(err);
        res.send(posts);
    });
});

router.get('/create', (req, res) => {
    res.render('create.pug')
});

router.post('/create', (req, res, next) => {
    var err;
    if(!req.session.userId) //some basic checking, should fix this up later to be more robust
    {
        err = new Error("You are not logged in and/or unable to create blog posts with your current permissions.");
        err.status = 403;
        next(err);
    }

    req.body['author'] = user;
    var rawTags = req.body['tags'];
    //split raw tags on commas
    req.body['tags'] = rawTags.split(',');
    req.body['urlTitle'] = makeStringURLFriendly(req.body['title']);

    var newPost = new Post(req.body);
    Post.create(newPost, (err, post) => {
        if (err) 
        {
            next(err);
        }
        else
        {
            res.redirect('/blog');
        }
    });
});

//Take in a title and process it to be url friendly
function makeStringURLFriendly(str)
{
    //a string is url friendly if it contains no spaces. We'll replace spaces with hyphens
    let urlStr = str.replace(/ +(?= )/g,''); //if there are multiple spaces, replace them with 1 space instead
    urlStr = urlStr.replace(/ /g, '-');; //replace the spaces with hyphens

    //we don't care about caps or anything, so make it all lower case
    return urlStr.toLowerCase();
}

router.use(logErrors);
router.use(generalError);

function logErrors(err, req, res, next)
{
    console.error(err.stack);
    next(err);
}

function generalError(err, req, res, next)
{
    res.render('error.pug',
    {
        status: err.status,
        message: err.message
    });
}

module.exports = router;