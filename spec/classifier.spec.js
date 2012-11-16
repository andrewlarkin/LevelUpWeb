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
				classifiers: {},
				getLevels: function(type){
					return userLevels;
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

		describe('When evaulating a sequence of actions...', function(){
			it('determines what task to use based on the input', function(){

			});

			it('calculates the mental time for the sequence based on the matched task', function(){

			});
		});

	});
});