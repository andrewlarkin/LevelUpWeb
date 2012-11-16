var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['tasks'], function(Tasks){
    console.log(Tasks);
});