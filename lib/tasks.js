define('tasks', ['configLoad'], function(ConfigLoad){

    var taskList = ConfigLoad.get('config/tasks');

    var Tasks = {
        get: function(type){
            return taskList[type];
        }
    };

    return Tasks;
});