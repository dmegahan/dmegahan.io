var renderer = require('./renderer.js');
var git = require('./GithubCommitLink.js');

//get latest Commit (as Promise), then assign the promise value
var latestCommit = git.getLatestCommit();
latestCommit.then(value => {
    latestCommit = value;
});

function home(request, response)
{
    response.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('header', {}, response);
    renderer.view('body', {}, response);

    renderer.view('footer', latestCommit, response);
    response.end();
}

function blog(request, response)
{
    response.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('header', {}, response);
    //blog page created by parsing database of posts, and shoving them into a template
    renderer.view('blog', {}, response);
    renderer.view('footer', latestCommit, response);
    response.end();
}

module.exports.home = home;
module.exports.blog = blog;