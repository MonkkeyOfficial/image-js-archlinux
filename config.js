var fs = require('fs'),
    path = require('path');

var config = JSON.parse(fs.readFileSync(path.resolve(path.join('/root', 'config.json'))));
config.maxSize = config.maxSize ? config.maxSize : 1000; // byte

module.exports = config;