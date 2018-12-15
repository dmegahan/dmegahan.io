window.onload = function() {
    insertCommit(getLatestCommit());
}

function getLatestCommit(){
    var Git = require('nodegit');
    Git.Repository.open("https://github.com/dmegahan/dmegahan.io").then(function(repository){
        return repository.getHeadCommit();
    } ).then(function(commit) {
        return commit.sha();
    } ).then(function (hash){
        return hash;
    })
}

function insertCommit(gitCommit)
{
    document.getElementById("gitCommit").innerHTML = gitCommit;
}