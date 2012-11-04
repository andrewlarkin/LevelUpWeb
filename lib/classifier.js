define('classifier', function(){
	
	
	/*
		Classifiers:
			actions: [
				{
					action: "startMove",
					time: 0,
				},
				{
					action: "mouseEnter",
					time: 980,
					element: "backButton"
				},
				{
					action: "stopMove",
					time: 1000,
					distance: 200
				},
				{
					action: "mouseDown",
					time: 1502
					element: "backButton"
				},
				{
					action: "mouseUp",
					time: 1604,
					element: "backButton"
				}
			]
	*/

	var Classifier = function(type, user){
		if (typeof user.classifiers[type] !== 'undefined') {
			return user.classifiers[type];
		}

		//get tasks

		//get current user skill level

		user.classifiers[type] = this;
	};

	Classifier.prototype.parseActions = function(actions){

	};

	Classifier.prototype.getLevels = function(){

	};

	Classifier.prototype.setLevel = function(){

	};

	return Classifier;
});