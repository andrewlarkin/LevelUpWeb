define(['mongoose', 'tasks', 'events'], function(mongoose, Tasks, Events){

  var db = mongoose.createConnection('mongodb://localhost/luw'),
      User, userSchema, t, taskCollection, userModel,
      ObjectId = mongoose.Schema.Types.ObjectId,

      userQueue = [];

  //create user schema
  userSchema = new mongoose.Schema({
    pointRate: Number
  });

  taskCollection = Tasks.get();

  for (t in taskCollection) {
    userSchema.add({t: 'number'});
  }

  //add method to get times for all users and get the quartiles
  userSchema.statics.getQuartiles = function(task, cb){
    this.model.find().sort(task).exec(function(err, data){
      var n = data.length,
          q1Index = (0.25 * n) + 0.5,
          q2Index = (0.5 * n) + 0.5,
          q3Index = (0.75 * n) + 0.5;

      cb(task, {Q1: data[q1Index][task], Q2: data[q2Index][task], Q3: data[q3Index][task], Q4: data[n-1][task]});
    });
  };

  //add method to get current user's times for any given task (or all tasks)
  userSchema.method.getTime = function(task){
    return this[task];
  };

  userSchema.method.setTime = function(task, time) {
    this[task] = time;

    this.save();
  };

  userSchema.method.getLevels = function(tasks, cb){
    if (typeof tasks === 'string') {
      tasks = [tasks];
    }

    var i, levels = {}, complete = false;

    for (i = 0; i < tasks.length; i += 1){
      levels[task] = null;

      this.getQuartiles(tasks[i], function(task, quartiles){
        var time = this.getTime(task), l;

        if (time <= quartiles.Q1) {
          levels[task] = 1;
        } else if (time <= quartiles.Q2) {
          levels[task] = 2;
        } else if (time <= quartiles.Q3) {
          levels[task] = 3;
        } else {
          levels[task] = 4;
        }

        for (l in levels) {
          complete = levels[l] !== null;
        }

        if (complete) {
          cb(levels);
        }
      }.bind(this));
    }
  };

  //TODO: add some sort of error handling
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function(){
    userModel = db.model('User', userSchema);

    while (userQueue.length > 0) {
      userQueue.shift()();
    }
  });

  User = {
    get: function(_id, cb) {
      if (typeof userModel === 'undefined') {
        userQueue.push(function(){
          userModel.findById(ObjectId(_id), function(err, user){
            if (!user) {
              user = new userModel();
            }

            cb(user);
          });
        });
      } else {
        userModel.findById(ObjectId(_id), function(err, user){
          if (!user) {
            user = new userModel();
          }

          cb(user);
        });
      }
    },

    create: function(cb) {
      var user = new userModel();

      cb(user);
    }
  };

  return User;

});