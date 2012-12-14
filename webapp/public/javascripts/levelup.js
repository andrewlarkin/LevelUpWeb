//define('levelup', ['jquery', 'mousetracker'], function($, MT){
require(['mouseTracker', 'sequence', 'actionTimer', 'socketManager', 'interaction', 'pause'], function(MT, Sequence, AT, SM, Interaction, Pause){
  //connect to socket.io
  SM.connect('http://localhost');

  SM.listen('connect', function(){
    SM.emit('authenticate', 12345);
  });

  //instantiate an interaction object for each tagged interaction element
  var interactions = $('[data-luw-interaction]');

  interactions.each(function(index){
    new Interaction($(this));
  });


  //bind levelup event to socket broadcast of levelup
  SM.listen('levelup', function(context, level){
    $(document).trigger('levelup', context, level);
    console.log(context + ": " + level);
  });

  //start tracking mouse movements
  MT.startTracking();

  //set up pause timer
  Pause.start();

});