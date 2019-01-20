const renderer = require('./renderer.js');
const git = require('./GithubCommitLink.js');
const fetch = require('isomorphic-fetch');
const pug = require('pug');

//get latest Commit (as Promise), then assign the promise value
var latestCommit = git.getLatestCommit();
latestCommit.then(value => {
    latestCommit = value;
});

function home(req, res)
{
    /*
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('header', {}, res);
    renderer.view('body', {}, res);

    renderer.view('footer', latestCommit, res);
    res.end();
    */

    //pug implementation
    res.render('home.pug');
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
            console.log(data[0].title + ", " + data[0].body);
        })
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('header', {}, res);
    //blog page created by parsing database of posts, and shoving them into a template
    renderer.view('blog', {}, res);
    renderer.view('footer', latestCommit, res);
    res.end();
}

module.exports.home = home;
module.exports.blog = blog;