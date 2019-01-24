const git = require('./GithubCommitLink.js');
const fetch = require('isomorphic-fetch');

//get latest Commit (as Promise), then assign the promise value
var latestCommit = git.getLatestCommit();
var gitCommit_short;
var gitCommit_hash;
latestCommit.then(value => {
    latestCommit = value;
});

function home(req, res)
{
    //pug implementation
    res.render('index.pug', 
    {
        githubCommit_short: latestCommit['gitCommit-short'],
        githubCommit_hash: latestCommit['gitCommit-hash']
    });
}

function blog(req, res)
{
    //server-side fetch requires the full url, so generate the baseUrl based off the request
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    //query the api endpoint set up in server.js
    fetch(baseUrl + '/posts', {method: 'GET'})
        .then(function(res){
            if(res.ok)
            {
                return res.json();
            }
            throw new Error('Request failed.');
        })
        .then(function(data) {
            //do shit
            res.render('blog.pug', {posts: data, githubCommit: gitCommit_short['gitCommit-short']});
        })
}

module.exports.home = home;
module.exports.blog = blog;