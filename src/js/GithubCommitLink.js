var Git = require('nodegit');

async function getLatestCommit()
{
    var latestCommit = {'gitCommit-hash': '', 'gitCommit-short': ''};

    await Git.Repository.open(process.cwd()).then(function(repository){
        return repository.getHeadCommit();
    }).then(function(commit) {
        return commit.sha();
    }).then(function (hash){
        latestCommit["gitCommit-hash"] = hash;
        latestCommit['gitCommit-short'] = hash.substring(0, 7);
    });

    return latestCommit;
}

module.exports.getLatestCommit = getLatestCommit;