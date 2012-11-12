requirejs(['configLoad', 'fs'], function(ConfigLoad, fs){
    var testStr = '{"test": "testData"}',
        testFile;

    describe('ConfigLoad', function(){
        beforeEach(function(){
            testFile = fs.openSync('test.json', 'w');
            fs.writeSync(testFile, testStr);
        });

        afterEach(function(){
            ConfigLoad.unload('test');
            fs.unlinkSync("test.json");
        });

        describe('When calling the load method...', function(){
            it('loads the requested file if it exists', function(){
                ConfigLoad.load('test.json');

                expect(ConfigLoad.get('test').test).toEqual("testData");
            });
        });

        describe('When invoking the unload method', function(){
            it('removes the loaded resource from the cache object', function(){
                ConfigLoad.load('test.json');

                expect(ConfigLoad.get('test').test).toEqual("testData");

                ConfigLoad.unload('test');
                //if the resource has been unloaded, we will have to attempt to load it again...
                spyOn(ConfigLoad, 'load');

                ConfigLoad.get('test');

                expect(ConfigLoad.load).toHaveBeenCalled();
            });
        });

        describe('When calling the get method...', function(){
            it('loads the requested file and returns the data', function(){
                expect(ConfigLoad.get('test')).toEqual({test: "testData"});
            });

            it('loads the file if the data is not cached', function(){
                spyOn(ConfigLoad, 'load');

                ConfigLoad.get('test');

                expect(ConfigLoad.load).toHaveBeenCalled();
            });

            it('loads the cached data if the file is already loaded', function(){
                ConfigLoad.load('test.json');

                spyOn(ConfigLoad, 'load');

                ConfigLoad.get('test');

                expect(ConfigLoad.load).not.toHaveBeenCalled();
            });
        });

    });
});