requirejs(['tasks', 'configLoad'], function(Tasks, ConfigLoad){
  describe('Tasks', function(){

    describe('When loading the task list...', function(){

      beforeEach(function(){
        Tasks._tasks = undefined;
      });

      it('returns a javascript object containing task data', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          point: [
            {action: "startmove"},
            {action: "stopmove"}
          ]
        });

        Tasks.load();

        expect(Tasks._tasks.point).toEqual([
          {action: "startmove"},
          {action: "stopmove"}
        ]);
      });

      it('it expands the task if it has been already expanded', function(){
          spyOn(ConfigLoad, 'get').andReturn({
            point: [
              {action: 'startmove'},
              {action: 'stopmove'}
            ],
            click: [
              {action: 'point'},
              {action: 'mousedown'}
            ]
          });

          Tasks.load();

          expect(Tasks._tasks.click).toEqual([
            {action: 'startmove'},
            {action: 'stopmove'},
            {action: 'mousedown'}
          ]);
      });

      it('expands the data even if it has not been expanded yet', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          click: [
            {action: 'point'},
            {action: 'mousedown'}
          ],
          point: [
            {action: 'startmove'},
            {action: 'stopmove'}
          ]
        });

        Tasks.load();

        expect(Tasks._tasks.click).toEqual([
          {action: 'startmove'},
          {action: 'stopmove'},
          {action: 'mousedown'}
        ]);
      });

      it('adds the element properties when expanding', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          point: [
            {action: 'startmove'},
            {action: 'stopmove'}
          ],
          click: [
            {action: 'point', element: 'a', role: 'test'},
            {action: 'mousedown'}
          ]
        });

        Tasks.load();

        expect(Tasks._tasks.click).toEqual([
          {action: 'startmove', element: 'a', role: 'test'},
          {action: 'stopmove', element: 'a', role: 'test'},
          {action: 'mousedown'}
        ]);
      });
    });

    describe('When getting the task data', function(){
      it('gets the data', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          point: [
            {action: 'startmove'},
            {action: 'stopmove'}
          ]
        });

        Tasks.load();

        expect(Tasks.get()).toEqual({
          point: [
            {action: "startmove"},
            {action: "stopmove"}
          ]
        });
      });

      it('gets specific tasks data if passed in as an argument', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          point: [
            {action: 'startmove'},
            {action: 'stopmove'}
          ]
        });

        Tasks.load();

        expect(Tasks.get('point')).toEqual([
          {action: "startmove"},
          {action: "stopmove"}
        ]);
      });

      it('returns undefined if an invalid task is passed in as an argument', function(){
        spyOn(ConfigLoad, 'get').andReturn({
          point: [
            {action: 'startmove'},
            {action: 'stopmove'}
          ]
        });

        Tasks.load();

        expect(Tasks.get('blah')).toBeUndefined();
      });

      it('loads the task data if none is available', function(){
        Tasks._tasks = undefined;

        spyOn(Tasks, 'load');

        Tasks.get();

        expect(Tasks.load).toHaveBeenCalled();
      });

      it('does not load the data if it has already been loaded', function(){
        Tasks.load();

        spyOn(Tasks, 'load');

        Tasks.get();

        expect(Tasks.load).not.toHaveBeenCalled();
      });

    });

  });
});