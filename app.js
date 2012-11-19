var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['express', 'http', 'socket.io', 'user', 'classifier'], function(express, http, io, User, Classifier){
    //spool up webserver

    //create a user object for this connection

    //When a sequence is received:
      //create classifier for that type (as provided by the request)
        //type is determined based on what interaction the user has entered or focused on
      //call classifier.match to verify that the sequence is valid and, if it is, evaluate it
        //evaluation will automatically update the user
});