define(['mongoose', 'configLoad'], function(mongoose, ConfigLoad){

  var db = mongoose.createConnection('mongodb://localhost/luw'),
      userSchema, User;


  userSchema = new mongoose.Schema({
    id: String,
    pointRate: Number
  });

  //TODO: add some sort of error handling
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function(){
    //create the User model
  });

  //create user schema

  //add method to get times for all users and get the quartiles

  //add method to get current user's times for any given task (or all tasks)

  //add a method to ge the current user's average point rate
  // actually, this could just be done with setters and getters for all user values

  //when retrieving a user document, if document doesn't exist, create a new one


  /*
    user data: {
      id: a unique id for the user
      pointRate: movement speed, px/ms
      times: {
        eachTask: time (in ms)
      }

    }
  */

});