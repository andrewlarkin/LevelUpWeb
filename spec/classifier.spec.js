requirejs(['classifier', 'configLoad', 'tasks'], function(Classifier, ConfigLoad, Tasks){
	var user, userLevels, c, tasksObj, interactionsObj;

	describe('Classifier', function(){

		beforeEach(function(){
			tasksObj = {};
			interactionsObj = {};
			c = undefined;
			user = undefined;
			Tasks._tasks = undefined;

			interactionsObj = {
				carousel: ['carousel_one', 'carousel_two']
			};

			tasksObj = {
				carousel_one: [{action: 'startmove'}, {action: 'stopmove'}],
				carousel_two: [{action: 'startmove'}, {action: 'stopmove'}, {action: 'mousedown'}]
			};

			spyOn(ConfigLoad, 'get').andCallFake(function(config){
				if (config === 'config/tasks'){
					return tasksObj;
				} else if (config === 'config/interactions') {
					return interactionsObj;
				}
			});

			//user skill levels are recorded as a value between 1 and 4
			userLevels = {carousel_one: 3, carousel_two: 2};
			user = {
				id: 12345,
				pointRate: 0.1,
				classifiers: {},
				getLevels: function(type){
					return userLevels;
				},
				setTime: function(){

				}
			};
		});

		describe('When instantiating a new classifier...', function(){

			it('stores the classifier as part of the user session object', function(){
				c = new Classifier('carousel', user);

				expect(user.classifiers.carousel).toBe(c);
			});

			it('returns the existing classifier if one is already associated with the user', function(){
				c = new Classifier('carousel', user);

				var _c = new Classifier('carousel', user);

				expect(_c).toBe(c);
			});

			it('gets a collection of tasks for the type of classifier', function(){
				c = new Classifier('carousel', user);

				expect(c.tasks).toEqual(tasksObj);
			});

			describe('...but there are no interactions available...', function(){
				it('sets the tasks to an empty object if no interactions are available', function(){
					interactionsObj = undefined;

					c = new Classifier('carousel', user);

					expect(c.tasks).toEqual({});
					expect(c.levels).toEqual({});
				});

				it('sets the tasks to an empty object if the interaction is not present in the object', function(){
					interactionsObj = {
						carousel: ['carousel_one', 'carousel_two']
					};

					taskObj = {
						carousel_one: [{action: 'startmove'}, {action: 'stopmove'}],
						carousel_two: [{action: 'startmove'}, {action: 'stopmove'}, {action: 'mousedown'}]
					};

					c = new Classifier('test', user);

					expect(c.tasks).toEqual({});
					expect(c.levels).toEqual({});
				});
			});

			describe('...but there are no tasks for the interaction...', function(){
				it('sets the tasks to an empty object if there are no tasks', function(){
					interactionsObj = {
						carousel: ['carousel_one', 'carousel_two']
					};

					spyOn(Tasks, 'get').andReturn(undefined);

					c = new Classifier('carousel', user);

					expect(c.tasks).toEqual({});
					expect(c.levels).toEqual({});
				});

				it('sets the tasks to an empty object if there are no tasks for the interaction', function(){
					interactionsObj = {
						carousel: ['carousel_one', 'carousel_two']
					};

					tasksObj = {
						testone: [{action: 'startmove'}, {action: 'stopmove'}],
						testtwo: [{action: 'startmove'}, {action: 'stopmove'}, {action: 'mousedown'}]
					};

					c = new Classifier('carousel', user);

					expect(c.tasks).toEqual({});
					expect(c.levels).toEqual({});
				});
					
			});

			it('gets the users current skill level', function(){
				c = new Classifier('carousel', user);

				expect(c.levels).toEqual(userLevels);
			});

			it('sets the users skill level to the lowest level if no skill level exists', function(){
				userLevels = undefined;

				c = new Classifier('carousel', user);

				expect(c.levels).toEqual({carousel_one: 1, carousel_two: 1});
			});

			it('sets the user skill level to the lowest level if no recorded level is available for only one task', function(){
				userLevels = {carousel_one: 3};

				c = new Classifier('carousel', user);

				expect(c.levels).toEqual({carousel_one: 3, carousel_two: 1});
			});

		});

		describe('When matching a sequence of actions', function(){
			beforeEach(function(){
				interactionsObj = {
					carousel: ['carousel_one', 'carousel_two']
				};

				tasksObj = {
					carousel_one: [{action: 'startmove'}, {action: 'stopmove'}],
					carousel_two: [{action: 'startmove'}, {action: 'stopmove'}, {action: 'mousedown'}]
				};

				c = new Classifier('carousel', user);

				spyOn(c, 'evaluate');
			});

			it('matches the sequence if the tasks is identical', function(){
				c.match([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}]);

				expect(c.evaluate).toHaveBeenCalledWith([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}], 'carousel_one');
			});

			it('matches the sequence if the sequence contains all the actions of the task', function(){
				c.match([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}, {action: 'pause', time: 500}]);

				expect(c.evaluate).toHaveBeenCalled();
			});

			it('does not match the sequence if the properties do not match', function(){
				c.tasks.carousel_one = [{action: 'startmove'}, {action: 'stopmove', element: 'b', role: 'test'}];

				c.match([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}]);

				expect(c.evaluate).not.toHaveBeenCalled();
			});

			it('does not match if all of the expected actions have not been matched', function(){
				c.match([{action: 'startmove', posx: 100, posy: 150, time: 0}]);

				expect(c.evaluate).not.toHaveBeenCalled();
			});

			it('matches the best sequence if more than one sequence matches', function(){
				c.match([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}, {action: 'mousedown'}]);

				expect(c.evaluate).toHaveBeenCalledWith([{action: 'startmove', posx: 100, posy: 150, time: 0}, {action: 'stopmove', posx: 220, posy: 150, time: 1200}, {action: 'mousedown'}], 'carousel_two');
			});
		});

		describe('When evaulating a sequence of actions...', function(){

			beforeEach(function(){
				interactionsObj = {
					carousel: ['carousel_one', 'carousel_two']
				};

				tasksObj = {
					carousel_one: [{action: 'startmove'}, {action: 'stopmove'}],
					carousel_two: [{action: 'startmove'}, {action: 'stopmove'}, {action: 'mousedown'}]
				};

				c = new Classifier('carousel', user);

				spyOn(user, 'setTime');
			});

						it('calls the appropriate calculator method', function(){
				spyOn(c.timeCalculators, 'startmove');

				c.evaluate([{action: 'startmove'}], 'test');

				expect(c.timeCalculators.startmove).toHaveBeenCalled();
			});

			it('reduces the time by 200ms for each action that goes from a keyboard to a mouse', function(){
				c.evaluate([{action: 'mousedown', time: 0}, {action: 'mouseup', time: 1000}, {action: 'pause', time: 300}, {action: 'keydown', 'time': 0}, {action: 'keyup', 'time': 900}], 'test');

				//Even though the total times add up to 2200, we still have to factor out 400ms for each key level action.  This still leaves 1400, but since we homed from the mouse to the keyboard, 200ms is removed
				expect(user.setTime).toHaveBeenCalledWith(1200, 'test');
			});

			describe('...and we are calling a calulator method...', function(){
				it('sets the moveStartTime, movePosX and movePosY values when calling "startmove" and returns the action time value', function(){
					expect(c.timeCalculators.startmove({action: 'startmove', posx: 100, posy: 200, time: 0})).toEqual(0);
					expect(c.timeCalculators._moveStartTime).toEqual(0);
					expect(c.timeCalculators._movePosX).toEqual(100);
					expect(c.timeCalculators._movePosY).toEqual(200);
				});

				it('returns 0 if no _moveStartTime, _movePosY or _movePosX values are set when calling stopmove', function(){
					expect(c.timeCalculators.stopmove({action: 'stopmove', posx: 200, posy: 250, time: 0})).toEqual(0);
				});

				it('factors out the user average time to move the mouse 200px', function(){
					user.pointRate = 0.1;

					c.timeCalculators.startmove({action: 'startmove', posx: 100, posy: 200, time: 0});

					expect(c.timeCalculators.stopmove({action: 'stopmove', posx: 400, posy: 600, time: 6000})).toEqual(1000);
				});

				it('sets the moveStartTime, movePosY and movePosX values to null after calling stopmove', function(){
					user.pointRate = 0.1;

					c.timeCalculators.startmove({action: 'startmove', posx: 100, posy: 200, time: 0});

					c.timeCalculators.stopmove({action: 'stopmove', posx: 400, posy: 600, time: 6000});

					expect(c.timeCalculators._moveStartTime).toEqual(null);

				});

				it('sets the mouseStartTime values when calling mousedown and returns the action time value', function(){
					expect(c.timeCalculators.mousedown({action: 'mousedown', time: 0})).toEqual(0);
					expect(c.timeCalculators._mouseStartTime).toEqual(0);
				});

				it('returns 0 of no _mouseStartTime value is set calling mouseup', function(){
					expect(c.timeCalculators.mouseup({action: 'mouseup', time: 1000})).toEqual(0);
				});

				it('returns the difference between the mousedown and mouseup times, minus an expected 400ms', function(){
					c.timeCalculators.mousedown({action: 'mousedown', time: 0});

					expect(c.timeCalculators.mouseup({action: 'mouseup', time: 1000})).toEqual(600);
				});

				it('sets the mouseStartTIme to null after calling mouseup', function(){
					c.timeCalculators.mousedown({action: 'mousedown', time: 0});
					c.timeCalculators.mouseup({action: 'mouseup', time: 1000});

					expect(c.timeCalculators._mouseStartTime).toEqual(null);
				});

				it('sets the keyStartTime values when calling keydown and returns the action time value', function(){
					expect(c.timeCalculators.keydown({action: 'keydown', time: 0})).toEqual(0);
					expect(c.timeCalculators._keyStartTime).toEqual(0);
				});

				it('returns 0 of no _keyStartTime value is set calling keyup', function(){
					expect(c.timeCalculators.keyup({action: 'keyup', time: 1000})).toEqual(0);
				});

				it('returns the difference between the keydown and keyup times, minus an expected 400ms', function(){
					c.timeCalculators.keydown({action: 'keydown', time: 0});

					expect(c.timeCalculators.keyup({action: 'keyup', time: 1000})).toEqual(600);
				});

				it('sets the keyStartTIme to null after calling keyup', function(){
					c.timeCalculators.keydown({action: 'keydown', time: 0});
					c.timeCalculators.keyup({action: 'keyup', time: 1000});

					expect(c.timeCalculators._keyStartTime).toEqual(null);
				});

				it('returns the action time for a pause', function(){
					expect(c.timeCalculators.pause({action: 'pause', time: 1000})).toEqual(1000);
				});

			});

		});

	});
});