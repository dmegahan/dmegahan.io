const git = require('../GithubCommitLink.js');
const fetch = require('isomorphic-fetch');
const express = require('express');
const router = express.Router();

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

module.exports = router;