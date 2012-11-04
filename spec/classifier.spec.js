var requirejs = require('requirejs');

requirejs.config({
    baseUrl: 'lib',
    nodeRequire: require
});

requirejs(['classifier'], function(Classifier){
	var user, c;

	describe('Classifier', function(){

		beforeEach(function(){
			user = {
				id: 12345,
				classifiers: {}
			};
		});

		describe('When instantiating a new classifier...', function(){

			it('stores the classifier as part of the user session object', function(){
				c = new Classifier('carousel', user)

				expect(user.classifiers.carousel).toBe(c);
			});

			it('returns the existing classifier if one is already associated with the user', function(){
				c = new Classifier('carousel', user);

				var _c = new Classifier('carousel', user);

				expect(_c).toBe(c);
			});

			it('gets a collection of tasks for the type of classifier', function(){

			});

			it('gets the users current skill level', function(){

			});

			it('sets the users skill level to the lowest level if no skill level exists', function(){

			});
		
		});

		

	});
});