var config = requrie('./config.js');

process.chdir('/root/bin');

var descriptor = fs.openSync('/dev/stdin', 'rs');
var code = Buffer.alloc(config.maxSize);
var nb = fs.readSync(descriptor, code, 0, config.maxSize, null);
code = code.toString('utf8');
code = code.substring(0, nb);

var params = JSON.parse(code);

params.args = params.args ? params.args : config.args;
params.args = params.args ? ' ' + params.args : '';
params.stdin = params.stdin ? params.stdin : config.stdin;

module.exports = params;
