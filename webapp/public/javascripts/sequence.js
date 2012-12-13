define('sequence', ['jquery', 'actionTimer', 'socketManager'], function($, AT, SM){
  var Sequence, 
      currentSequence = [],
      currentContext = null;
      time = new AT();

  $(document).on('contextChange', function(event, context){
    if(!context) {
      Sequence.send();
    }

    currentContext = context;
  });

  //TODO: LastTime should be tracked HERE, the time value for each should be since the last update
  //That makes no sense, though... 

  Sequence = {
    record: function(props){
      props.time = time.get();

      //return the index of the pushed item;
      return currentSequence.push(props) - 1;
    },

    update: function(index, props){
      currentSequence[index] = $.extend({}, currentSequence[index], props);
    },

    send: function(){
      if (SM.isOpen()){
        SM.emit('sequence', {context: currentContext, sequence: currentSequence});
      }

      Sequence.reset();
    },

    reset: function(){
      currentContext = null;
      currentSequence = [];

      $(document).trigger('sequenceReset');
    }
  };

  return Sequence;

});