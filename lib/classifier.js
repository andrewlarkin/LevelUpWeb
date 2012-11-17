define(['tasks', 'configLoad'], function(Tasks, ConfigLoad){

	var Classifier = function(type, user){
		if (typeof user.classifiers[type] !== 'undefined') {
			return user.classifiers[type];
		}

		var taskNames, levels, interactions, i,
				self = this,

				moveStartTime,
				movePosX, movePosY,

				keyStartTime, mouseStartTime;

		this.timeTable = {
			startmove: function(action){
				moveStartTime = action.time;
				movePosX = action.posx;
				movePosY = action.posy;

				return 0;
			},
			stopmove: function(action){
				var time, distance;
				if (moveStartTime && movePosX && movePosY) {
					//Good ol' Pythagorean Theorem
					distance = Math.sqrt((Math.abs(movePosX - action.posx) * Math.abs(movePosX - action.posx)) + (Math.abs(movePosY - action.posy) * Math.abs(movePosY - action.posy)));

					time = action.time - moveStartTime;

					return ((time / distance) * 200) - user.mousespeed;
				}
				return 0;
			},
			mousedown: function(action){
				mouseStartTime = action.time;

				return 0;
			},
			mouseup: function(action){
				if (mouseStartTime) {
					return action.time - mouseStartTime - 400;
				}

				return 0;
			},
			keydown: function(action){
				keyStartTime = action.time;

				return 0;
			},
			keyup: function(action){
				if (keyStartTime) {
					return action.time - mouseStartTime - 400;
				}

				return 0;
			},
			scroll: function(action){
				//need to find method to eval scrolls
			}
		};

		interactions = ConfigLoad.get('config/interactions');

		if (typeof interactions !== 'undefined') {
			taskNames = interactions[type] || [];
		} else {
			taskNames = [];
		}
		//TODO: classify lower level skill levels at the same time?

		levels = user.getLevels(type) || {};

		this.tasks = {};
		this.levels = {};

		for (i = 0; i < taskNames.length; i += 1){
			this.tasks[taskNames[i]] = Tasks.get(taskNames[i]);
			if (this.tasks[taskNames[i]]) {
				this.levels[taskNames[i]] = levels[taskNames[i]] || 1;
			}
		}

		user.classifiers[type] = this;
	};

	//TODO: use a better algorythm for this
	Classifier.prototype.match = function(sequence){

		var best, certainty = 0, numMatched, isMatched, prop, i, k, j = 0;
		//for each stored task
		for (var task in this.tasks) {
			numMatched = 0;
			j = 0;
			for (k = 0; k < sequence.length; k += 1) {
				isMatched = false;
				while (!isMatched && j < this.tasks[task].length){

					//match the first atomic expected action by comparing to each action in the sequence
					for (prop in this.tasks[task][j]){
						isMatched = this.tasks[task][j][prop] === sequence[k][prop];
						console.log(isMatched);
						if (!isMatched) {
							break;
						}
					}

					if (isMatched) {
						numMatched += 1;
					}

					if (!this.tasks[task][j].repeatable){
						j += 1;
					}
					//continue matching from current position with the next atomic action
				}

				if (j >= this.tasks[task].length) {
					break;
				}
			}

			//if there isn't a complete match (ie, one or more of the expected actions was not found) consider it a failed match.  Discard certainty.
			if (j < this.tasks[task].length || !isMatched) {
				continue;
			} else if (numMatched / sequence.length > certainty) {

				best = task;
				certainty = numMatched / sequence.length;
			}
		}

		if (best) {
			this.evaluate(sequence, best);
		}
			//if it is a match, store certainty value

		//Once all expected tasks are compared to the sequence pass the best match and the sequence to the evaluate method
	};

	Classifier.prototype.evaluate = function(sequence, task){
		//iterate through the sequence adjusting the time value as we proceed:
		var i, totalTime = 0;

		for (i = 0; i < sequence.length; i += 1){
			totalTime += this.timeTable[sequence[i].action](sequence[i]);

			//factor out homing time between mouse and keyboard
			if (i + 1 !== sequence.length &&  ((sequence[i].action.indexOf('key') !== -1 && sequence[i + 1].action.indexOf('key') === -1) ||
					(sequence[i].action.indexOf('key') === -1 && sequence[i + 1].action.indexOf('key') !== -1))){
				totalTime -= 200;
			}
		}

			//for any mousedown or keydown event, record the respective "start" time index
			//for any mouseup or keyup event, calculate the time from the last mousedown/keydown and subtract 400ms
			//for any transition from the mouse to the keyboard, subtract 200ms
			//for any startmove event, record the "movestart" time index
			//for any stopmove, calculate time from startmove and factor out the user's mouse movement speed (see move method)

		//The resulting time is the user's mental time.  Set this value to the user
	};

	return Classifier;
});