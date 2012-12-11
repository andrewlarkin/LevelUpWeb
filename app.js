var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['express', 'http', 'socket.io', 'user', 'classifier'], function(express, http, socketio, User, Classifier){
    
  var app = express(),
      server = http.createServer(app),
      io = socketio.listen(server),

      assetPath = './webapp/public/',
      viewPath =  './webapp/views/',
      jsPath = assetPath + 'javascripts/',
      cssPath = assetPath + 'stylesheets/css/',
      imagePath = assetPath + 'images/';


  app.get('/', function(req, res){
    res.sendfile(viewPath + 'index.html');
  });

  app.get('/js/*', function(req, res){
    res.sendfile(jsPath + req.params[0]);
  });

  app.get('/css/*', function(req, res){
    res.sendfile(cssPath + req.params[0]);
  });

  //spool up webserver
  server.listen('3000');

  io.sockets.on('connection', function(socket){
    //read cookie
    var id = null;

    //create user object
    var user = new User(id);

    user.on('levelChange', function(context, level){
      socket.emit('levelChange', context, level);
    });

    socket.on('sequence', function(context, sequence){
      console.log(context, data);
      
      var classifier = new Classifier(context, user);

      classifier.match(sequence);
    });
  });

    

    //create a user object for this connection

        //type is determined based on what interaction the user has entered or focused on
      //call classifier.match to verify that the sequence is valid and, if it is, evaluate it
        //evaluation will automatically update the user
});