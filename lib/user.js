define(['mongoose', 'configLoad'], function(Mongoose, ConfigLoad){

  /*
    user data: {
      id: a unique id for the user
      pointRate: movement speed, px/ms
      times: {
        eachTask: time (in ms)
      }

    }
  */

  var User = function(id){
    //if no id is provided, consider it a new user
      //create new user record in database
  };

  User.prototype.getPointRate = function(){

  };

  User.prototype.getLevels = function(){

  };

  User.prototype.setTime = function(){
    //write to the database
  };

});