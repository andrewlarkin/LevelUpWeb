//define('levelup', ['jquery'], function($){
(function(){
  var socket = io.connect('http://localhost');

  var actionTimer,
      sequence = [];

  //get every tagged interaction on the page
  //find the key elements, bind the appropriate events to those elements

  //bind mouse move logic
  var mousetimer,
      isMoving = false;

  var checkActionTimer = function(){
    actionTimer = clearTimeout(actionTimer);

    actionTimer = setTimeout(function(){
      actionTimer = clearTimeout(actionTimer);
      sequence = [];  
      Timer.stop();

    }, 500);
  };

  //TODO: set pauses itermitantly
  $(document).on('mousemove', function(event){
    checkActionTimer();

    if (!isMoving) {
      isMoving = true;
      sequence.push({action: 'startmove', posx: event.pageX, posy: event.pageY, time: Timer.get()});
    }

    mousetimer = clearTimeout(mousetimer);

    mousetimer = setTimeout(function(e){
      mousetimer = clearTimeout(mousetimer);
      isMoving = false;
      //TODO: set context for this event
      sequence.push({action: 'stopmove', posx: e.pageX, posy: e.pageY, time: Timer.get() - 400});

      console.log(sequence);
    }.bind(this, event), 400);
  });

  var Timer = {
    _time: 0,
    start: function(){
      if (this._time === 0) {
        this._time = Date.now();
      }
    },
    get: function(){
      if (this._time === 0){
        this.start();
        return 0;
      } else {
        return Date.now() - this._time;
      }
    },
    stop: function(){
      this._time = 0;
    }
  };


  return {};
  //socket.emit('test', {my: 'data'});
})();