var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['luw'], function(LevelUpWeb){
    
  exports = LevelUpWeb;

});