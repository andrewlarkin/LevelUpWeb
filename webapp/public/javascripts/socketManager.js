define('socketManager', ['io'], function(io){
  var SM, openSocket, isOpen = false;

  SM = {
    connect: function(url){
      if (isOpen || typeof io === 'undefined') {
        return;
      }

      openSocket = io.connect(url);

      openSocket.on('connect', function(){
        isOpen = true;
      });

      openSocket.on('disconnect', function(){
        isOpen = false;
      });
    },

    disconnect: function(){
      if (!isOpen) {
        return;
      }

      openSocket.disconnect();
    },

    emit: function(event, data){
      if (!isOpen) {
        return;
      }

      openSocket.emit(event, data);
    },

    listen: function(event, callback){
      openSocket.on(event, callback);
    },

    isOpen: function(){
      return isOpen;
    }
  };

  return SM;
});