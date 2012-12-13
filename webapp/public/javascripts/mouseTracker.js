define('mouseTracker', ['jquery', 'sequence'], function($, Sequence){

  var MT, handlers, timers, 
      startAction,
      isMoving = false,
      moveTicks = 0;

  timers = {
    mouse: 0
  };

  handlers = {
    mouseMove: function(event){
      moveTicks += 1;

      if (moveTicks > 20) {

        if (!isMoving) {
          isMoving = true;
          
          MT.startmove(event.pageX, event.pageY);
        }

        clearTimeout(timers.mouse);

        timers.mouse = setTimeout(function(e){
          MT.stopmove(e.pageX, e.pageY, e.toElement);

          timers.mouse = clearTimeout(timers.mouse);
          isMoving = false;
          moveTicks = 0;
        }.bind(this, event), 50);
      }
    }
  };

  $(document).on('sequenceReset', function(){
    startAction = null;
    timers.mouse = clearTimeout(timers.mouse);
    isMoving = false;
  });

  MT = {
    startTracking: function(){
      $(document).on('mousemove', handlers.mouseMove);
    },

    stopTracking: function(){
      $(document).unbind('mousemove', handlers.mouseMove);

      startAction = null;
    },

    startmove: function(posx, posy){
      startAction = Sequence.record({
        action: 'startmove',
        posx: posx,
        posy: posy
      });
    },

    stopmove: function(posx, posy, element){
      if (!isMoving && !startAction) {
        return;
      }

      var tag, role;

      element = $(element);

      if (!element.attr('data-luw-role')) {
        element = element.parents('[data-luw-role]').first();
      }

      tag = element.prop('tagName') || '';
      tag = tag.toLowerCase();
      role = element.attr('data-luw-role');

      Sequence.update(startAction, {element: tag, role: role});

      Sequence.record({
        action: 'stopmove',
        posx: posx,
        posy: posy,
        element: tag,
        role: role
      });

      startAction = null;
    }
  };

  return MT;

});
