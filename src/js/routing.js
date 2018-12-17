var renderer = require('./renderer.js');
var git = require('./GithubCommitLink.js');

function home(request, response)
{
    response.writeHead(200, {'Content-Type': 'text/html'});
    renderer.view('header', {}, response);
    renderer.view('body', {}, response);

    //get github commit
    var latestGitCommit = git.getLatestCommit();
    renderer.view('footer', {'gitCommit': latestGitCommit}, response);
    response.end();
}

function css(request, response)
{
    
}

module.exports.home = home;