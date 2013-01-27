
define(['socket.io', 'user_json', 'classifier'], function(socketio, User, Classifier){
  var levelupweb = function(server) {

    var io = socketio.listen(server);

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

  };

  return levelupweb;
});