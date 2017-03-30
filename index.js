var config = require('./config.js'),
    params = require('./input.js'),
    fs = require('fs');

process.chdir('/root/bin');

function applyCodes(codes, callback, errorCallback)
{
    var counter = Object.keys(codes).length;
    var errors = [];
    var milestones = [];

    function done(localMilestones)
    {
        if(localMilestones)
            milestones = milestones.concat(localMilestones);
        
        --counter;
        if(counter === 0)
        {
            if(errors.length === 0)
                callback(milestones);
            else
                errorCallback(errors);
        }
    }

    for(var name in codes)
    {
        (function(name)
        {
            var value = codes[name];
            var filters = config.userFiles[name].filters;
            var response;

            function subDone()
            {
                var value = response.value;
                var p = config.userFiles[name].path;
                var content = fs.readFileSync(p).toString();
                content = content.replace(new RegExp("{{( )*user-code:" + name.replace(/(?=[\/\\^$*+?.()|{}[\]])/g, "\\") + "( )*}}"), value);
                fs.writeFile(p, content, e => {
                    if(e)
                        throw e;
                    done();
                });
            }
            

            var currentKeyIndex = 0;

            function execFilter()
            {
                if(currentKeyIndex >= filters.length)
                    subDone();
                else
                {
                    var filter = require(filters[currentKeyIndex]);
                    filter(value, response);
                }
            }

            response = {
                value: value,
                name: name,
                invalid: (message, index) => {
                    errors.push({ message: message, index: index });
                    done(response.milestones);
                },
                valid: (value) => {
                    if(value !== undefined)
                        response.value = value;
                    ++currentKeyIndex;
                    execFilter();
                },
                milestones: []
            }

            if(!filters || filters.length === 0)
            {
                subDone();
                return;
            }
            execFilter();
        })(name);
    }
}

// build
applyCodes(params.codes, () => {
    // execute
    var exec = require('child_process').exec;
    var child = exec(config.command.replace(/{{( )*args( )*}}/img, params.args), (e, stdout, stderr) => {
        console.log(JSON.stringify({
            error: e, stdout: stdout, stderr: stderr
        }));
    });
    if(params.stdin)
        if(params.stdin.constructor === Object)
            child.stdin.write(JSON.stringify(params.stdin));
        else
            child.stdin.write(params.stdin);
}, errors => {
    console.log(JSON.stringify({
        error: { type: 'filters', errors: errors }
    }));
});
