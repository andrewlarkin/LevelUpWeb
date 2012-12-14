define(['tasks', 'events', 'data'], function(Tasks, events, data){

  var User = function(id){
    if (typeof id === 'undefined') {
      //create new id
    }

    this.id = id;

    this.data = data[id];

    this.classifiers = {};

    if (typeof this.data === 'undefined') {
      this.data = data[id] = {
        pointRate: 1000
      };
    }
  };

  User.prototype = new events.EventEmitter();

  User.prototype.getQuartiles = function(tasks, callback){
    if (typeof tasks === 'string') {
      tasks = [tasks];
    }

    var id, i, t, times = {}, quartiles = {},
        n, q1, q2, q3;

    for (id in data) {
      for (i = 0; i < tasks.length; i += 1) {
        if (typeof data[id][tasks[i]] !== 'undefined' && data[id][tasks[i]] > 0) {
          times[tasks[i]] = times[tasks[i]] || [];
          times[tasks[i]].push(data[id][tasks[i]]);
        }
      }
    }

    for (t in times) {
      times[t] = times[t].sort(function(a, b){
        return b - a;
      });

      n = times[t].length;
      q1 = Math.floor(0.25 * n);
      q2 = Math.floor(0.5 * n);
      q3 = Math.floor(0.75 * n);
      
      quartiles[t] = {
        Q1: times[t][q1],
        Q2: times[t][q2],
        Q3: times[t][q3],
        Q4: times[t][n-1]
      };
    }

    callback(quartiles);
  };

  User.prototype.getTime = function(task){
    return this.data[task];
  };

  User.prototype.setTime = function(task, time){
    this.data[task] = time;
  };

  User.prototype.getLevels = function(tasks, callback){
    if (typeof tasks === 'string') {
      tasks = [tasks];
    }

    var self = this;

    this.getQuartiles(tasks, function(quartiles){

      var levels = {}, i,
          time;

      for (i = 0; i < tasks.length; i += 1){
        time = self.getTime();

        if (time <= quartiles[tasks[i]].Q1) {
          levels[tasks[i]] = 1;
        } else if (time <= quartiles[tasks[i]].Q2) {
          levels[tasks[i]] = 2;
        } else if (time <= quartiles[tasks[i]].Q3) {
          levels[tasks[i]] = 3;
        } else {
          levels[tasks[i]] = 4;
        }
      }

      callback(levels);
    });
  };

  return User;

});