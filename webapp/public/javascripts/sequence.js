define('sequence', ['jquery', 'actionTimer', 'socketManager'], function($, AT, SM){
  var Sequence, 
      currentSequence = [],
      currentInteraction = null;
      time = new AT();

  $(document).on('contextChange', function(event, context){
    currentInteraction = context;
  });

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
      if (SM.isOpen && currentInteraction !== null){
        SM.send('sequence', {context: currentContext, sequence: currentSequence});
      }

      Sequence.reset();
    },

    reset: function(){
      currentInteraction = null;
      currentSequence = [];

      $(document).trigger('sequenceReset');
    }
  };

  return Sequence;

});