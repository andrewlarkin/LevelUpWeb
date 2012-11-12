var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['tasks'], function(Tasks){
    print(Tasks.get('carousel'));
});