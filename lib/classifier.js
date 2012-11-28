define(['tasks', 'configLoad'], function(Tasks, ConfigLoad){

	var Classifier = function(type, user){
		if (typeof user.classifiers[type] !== 'undefined') {
			return user.classifiers[type];
		}

		this.user = user;

		var taskNames, levels, interactions, i,
				self = this;

		this.timeCalculators = {
			_moveStartTime: null,
			_movePosX: null,
			_movePosY: null,
			_keyStartTime: null,
			_mouseStartTime: null,

			startmove: function(action){
				this._moveStartTime = action.time;
				this._movePosX = action.posx;
				this._movePosY = action.posy;

				return action.time;
			},
			stopmove: function(action){
				var time, distance;

				if (this._moveStartTime !== null && this._movePosX !== null && this._movePosY !== null) {
					//Good ol' Pythagorean Theorem
					distance = Math.sqrt((Math.abs(this._movePosX - action.posx) * Math.abs(this._movePosX - action.posx)) + (Math.abs(this._movePosY - action.posy) * Math.abs(this._movePosY - action.posy)));

					console.log(distance);

					time = action.time - this._moveStartTime;

					this._moveStartTime = null;
					this._movePosX = null;
					this._movePosY = null;

					return time - (distance / user.pointRate);
				}

				return 0;
			},
			mousedown: function(action){
				this._mouseStartTime = action.time;

				return action.time;
			},
			mouseup: function(action){
				var time;

				if (this._mouseStartTime !== null) {
					time = action.time - this._mouseStartTime - 400;
					this._mouseStartTime = null;

					return time;
				}

				return 0;
			},
			keydown: function(action){
				this._keyStartTime = action.time;

				return action.time;
			},
			keyup: function(action){
				var time;

				if (this._keyStartTime !== null) {
					time = action.time - this._keyStartTime - 400;

					this._keyStartTime = null;

					return time;
				}

				return 0;
			},
			pause: function(action){
				return action.time;
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

		this.tasks = {};
		this.levels = {};

		//TODO: classify lower level skill levels at the same time?
		user.getLevels(taskNames, function(levels){
			for (i = 0; i < taskNames.length; i += 1){
				this.tasks[taskNames[i]] = Tasks.get(taskNames[i]);
				if (this.tasks[taskNames[i]]) {
					this.levels[taskNames[i]] = levels[taskNames[i]] || 1;
				}
			}
		}.bind(this));


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

			totalTime += this.timeCalculators[sequence[i].action](sequence[i]);

			//factor out homing time between mouse and keyboard
			//TODO: This won't work for pauses
			if (i + 1 !== sequence.length &&  ((sequence[i].action.indexOf('key') !== -1 && sequence[i + 1].action.indexOf('key') === -1) ||
					(sequence[i].action.indexOf('key') === -1 && sequence[i + 1].action.indexOf('key') !== -1))){
				totalTime -= 200;
			}

			//TODO: the logic for mousedown/mouseup won't work for drag scenarios
		}

		this.user.setTime(totalTime, task);
	};

	return Classifier;
});