//define('levelup', ['jquery', 'mousetracker'], function($, MT){
require(['mouseTracker', 'sequence', 'actionTimer', 'socketManager', 'interaction'], function(MT, Sequence, AT, SM, Interaction){
  //connect to socket.io
  SM.connect('http://localhost');

  //instantiate an interaction object for each tagged interaction element
  var interactions = $('[data-luw-interaction]');

  interactions.each(function(index){
    new Interaction($(this));
  });


  //bind levelup event to socket broadcast of levelup
  SM.listen('levelup', function(context, level){
    $(document).trigger('levelup', context, level);
  });

  //start tracking mouse movements
  MT.startTracking();

  //set up pause timer
  var pauseTimer = new AT();

});