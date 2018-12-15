var fs = require('fs');

function view(templateName, response)
{
    //get current path of process
    //console.log(process.cwd());
    var templatePath = './src/components/' + templateName + '.html'; 
    //read the file then output the contents in html to the page
    var fileContents = fs.readFileSync(templatePath, {encoding: 'utf8'});
    response.write(fileContents);
}

module.exports.view = view;