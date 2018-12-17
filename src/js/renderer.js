var fs = require('fs');

function view(templateName, values, response)
{
    //get current path of process
    //console.log(process.cwd());
    var templatePath = './src/components/' + templateName + '.html'; 
    //read the file then output the contents in html to the page
    var fileContents = fs.readFileSync(templatePath, {encoding: 'utf8'});
    fileContents = mergeValues(values, fileContents);
    response.write(fileContents);
}

/*
    Add our values to the html by looking for text like "{{test}}" 
    and replacing it with the matching key (in this case, test)
*/
function mergeValues(values, content)
{
    for(var key in values)
    {
        content = content.replace('{{' + key + '}}', values[key]);
    }
    return content;
}

module.exports.view = view;