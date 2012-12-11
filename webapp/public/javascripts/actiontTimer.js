define('actionTimer', function(){
  
  var AT = function(){
    this._time = 0;
  };

  AT.prototype.start = function(){
    if (this._time === 0) {
      this._time = Date.now();
    }
  };

  AT.prototype.get = function(){
    if (this._time === 0) {
      this.start();
      return 0;
    } else {
      return Date.now() - this._time;
    }
  };

  AT.prototype.stop = function(){
    this._time = 0;
  };


  /*var checkActionTimer = function(){
    actionTimer = clearTimeout(actionTimer);

    actionTimer = setTimeout(function(){
      actionTimer = clearTimeout(actionTimer);
      sequence = [];
      Timer.stop();

    }, 500);
  };*/

  return AT;

});