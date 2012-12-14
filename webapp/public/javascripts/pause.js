define(['actionTimer', 'sequence'], function(AT, Sequence){
  var time = new AT(),
      pauseTimer = 0;

  var Pause = {
    start: function(){
      $(document).unbind('scroll mousemove mousedown keydown', Pause.record);

      $(document).on('scroll mousemove mousedown keydown', Pause.reset);
    },

    reset: function(event){
      pauseTimer = clearTimeout(pauseTimer);

      pauseTimer = setTimeout(function(){
        time.start();

        $(document).unbind('scroll mousemove mousedown keydown', Pause.reset);

        $(document).on('scroll mousemove mousedown keydown', Pause.record);

        clearTimeout(pauseTimer);
      }, 150);
    },

    record: function(event){
      var t = time.get();

      if (time > 0) {
        Sequence.record({
          action: 'pause',
          time: t
        });
      }

      time.stop();

      $(document).on('scroll mousemove mousedown keydown', Pause.reset);

      $(document).unbind(event);
    }
  };

  return Pause;

});