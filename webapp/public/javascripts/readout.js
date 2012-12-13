define(['jquery', 'socketManager'], function($, SM){

  var instances = {},
      instanceCounter = 0;

  SM.listen('levelChange', function(interaction, level){
    var i;

    if (typeof instances[interaction] === 'undefined'){
      return;
    }

    for (i in instances[interaction]){
      instances[interaction][i].changeLevel(level);
    }
    
  });

  var Readout = function(interaction, element){
    var self = this;

    this.root = $(element);

    if (this.root.data(interaction + '-readout')){
      return instances[interaction][this.root.data(interaction + '-readout')];
    }

    instances[interaction] = instances[interaction] || [];

    instanceCounter += 1;
    instances[interaction][instanceCounter] = this;
    this.root.data(interaction + '-readout', instanceCounter);

    this.interaction = interaction;

    this.container = this.root.find('[data-readout-role="level-container"]');
  };

  Readout.prototype.changeLevel = function(level){
    this.container.children().each(function(index){
      $(this).toggleClass('is-active', index < level);
    });
  };

  return Readout;
});