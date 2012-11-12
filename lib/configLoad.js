define('configLoad', ['fs'], function(fs){
    var cache, ConfigLoad, basePath;

    basePath = "./";

    cache = {};

    ConfigLoad = {
        load: function(path, isAsync, callback) {
            var stats, resource, resourceStr;

            try {
                //get file information
                stats = fs.lstatSync(path);

                //is it a directory?
                if (stats.isDirectory()){
                    //recurse over files in directory
                } else {

                    resourceStr = fs.readFileSync(path);

                    if (resourceStr !== '') {
                        cache[path.replace('.json', '')] = JSON.parse(resourceStr);
                    }
                }

            } catch (e) {
                //
            }
        },

        unload: function(config){
            if (typeof cache[config] !== 'undefined') {
                cache[config] = undefined;
            }
        },

        get: function(config){
            
            if (typeof cache[config] === 'undefined') {
                this.load(config + '.json');
            }

            return cache[config];
        }
    };

    return ConfigLoad;
});