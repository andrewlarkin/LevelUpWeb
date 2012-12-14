define('interaction', ['jquery', 'sequence'], function($, Sequence){
  //TODO: potentially make a base interaction class that is inherited by each interaction type?

  var instances = [],
      instanceCounter;

  var Interaction = function(element){
    var self, components;

    self = this;

    this.root = $(element);

    this.context = this.root.attr('data-luw-interaction');

    if (this.root.data(this.context + '-interaction')) {
      return instances[this.root.data(this.context + '-interaction')];
    }

    instanceCounter += 1;
    instances[instanceCounter] = this;
    this.root.data(this.context + '-interaction', instanceCounter);

    this.timers = {
      context: 0
    };

    this._mousedown = null;
    this._keydown = null;

    this.handlers = {
      mouseenter: function(event){
        self.timers.context = clearTimeout(self.timers.context);

        $(document).trigger('contextChange', self.context);
      },

      mouseleave: function(event){
        self.timers.context = setTimeout(function(){
          $(document).trigger('contextChange', null);

          self.timers.context = clearTimeout(self.timers.context);
        }, 1000);
      },

      component_event: function(event){
        Sequence.record({
          action: event.type,
          element: event.data.element,
          role: event.data.role
        });
      },

      scroll: function(event) {

      }
    };

    this.root.on({
      mouseenter: this.handlers.mouseenter,
      mouseleave: this.handlers.mouseleave
    });

    components = this.root.find('[data-luw-role]');

    components.each(function(index){
      var el = $(this),
          events = el.attr('data-luw-event').split(','),
          tag = el.prop('tagName').toLowerCase(),
          role = el.attr('data-luw-role'),
          i;

      for (i = 0; i < events.length; i += 1){
        if(events[i] === scroll || events[i] === 'mousewheel') {
          $(this).on('scroll', {element: tag, role: role}, self.handlers.scroll);
        } else {
          $(this).on(events[i], {element: tag, role: role}, self.handlers.component_event);
        }
      }
    });

  };

  return Interaction;
});