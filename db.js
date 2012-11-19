var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['mongoose'], function(mongoose){
  
});