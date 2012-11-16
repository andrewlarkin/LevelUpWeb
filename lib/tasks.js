define(['configLoad'], function(ConfigLoad){
    var taskList, expand, Tasks;

    //returns an array of action objects
    expand = function(task){

        var expandedTask = [], _t, i, t, temp, prop;

        for(i = 0; i < task.length; i += 1){

            //if we have already expanded this task, add the expanded task
            if (typeof Tasks._tasks[task[i].action] !== 'undefined') {
                
                for (t = 0; t < Tasks._tasks[task[i].action].length; t += 1){

                    _t = Tasks._tasks[task[i].action][t];

                    temp = {action: _t.action};

                    //in addition to action, each tasks can have an element, role or key
                    for (prop in task[i]){
                        if (prop !== 'action'){
                            temp[prop] = task[i][prop];
                        }
                    }

                    expandedTask.push(temp);
                }
            } else if (typeof taskList[task[i].action] !== 'undefined') {
                expandedTask = expandedTask.concat(expand(taskList[task[i].action]));
            } else {
                expandedTask.push(task[i]);
            }
        }

        return expandedTask;
    };

    Tasks = {

        load: function(){
            var task, t;

            taskList = ConfigLoad.get('config/tasks');

            this._tasks = {};

            for(task in taskList){
                if (typeof this._tasks[task] === 'undefined'){
                    this._tasks[task] = expand(taskList[task]);
                }
            }
        },

        get: function(task){
            if (typeof this._tasks === 'undefined') {
                this.load();
            }

            if (!task){
                return this._tasks;
            } else {
                return this._tasks[task];
            }
        }
    };

    return Tasks;
});