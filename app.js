var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['express', 'http', 'socket.io', 'user_json', 'classifier'], function(express, http, socketio, User, Classifier){
    
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
    try {
      var user;

      socket.on('authenticate', function(id){
        user = new User(id);

        user.on('levelChange', function(context, level){
          socket.emit('levelChange', context, level);
        });
      });

      socket.on('sequence', function(data){
        if (typeof user !== 'undefined'){
          var classifier = new Classifier(data.context, user);

          classifier.match(data.sequence);
        }
      });
    } catch (e) {
      console.log(e);
    }
  });

});