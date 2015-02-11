/**
 * @class
 * @constructor
 *
 * @throws {Error}
 *      Throws error if specified invalid instance of class manager
 *
 * @param {Subclass.Class.ClassManager} classManager
 *      The instance of class manager
 */
Subclass.Class.ClassLoader = (function()
{
    function ClassLoader(classManager)
    {
        if (!classManager || !(classManager instanceof Subclass.Class.ClassManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the class manager instance', false)
                .received(classManager)
                .expected('an instance of Subclass.Class.ClassManager class')
                .apply()
            ;
        }

        /**
         * The instance of class manager
         *
         * @type {Subclass.Class.ClassManager}
         */
        this._classManager = classManager;

        // Adding event listeners

        var eventManager = classManager.getModule().getEventManager();
        var loadManager = classManager.getModule().getLoadManager();

        eventManager.getEvent('onAddToLoadStack')
            .addListener(function(fileName, callback) {
                var className = fileName.replace(/\.js$/, '');

                if (classManager.issetClass(className)) {
                    loadManager.removeFromStack(fileName);
                }
            })
        ;

        eventManager.getEvent('onProcessLoadStack')
            .addListener(function(stackItems) {
                for (var i = 0; i < stackItems.length; i++) {
                    var fileName = stackItems[i].file;
                    var className = fileName.replace(/\.js$/, '');

                    if (classManager.issetClass(className)) {
                        loadManager.removeFromStack(fileName);
                    }
                }
            })
        ;
    }

    /**
     * Returns the instance of class manager
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ClassLoader.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Returns the instance of load manager
     *
     * @returns {Subclass.Module.LoadManager}
     */
    ClassLoader.prototype.getLoadManager = function()
    {
        return this.getClassManager()
            .getModule()
            .getLoadManager()
        ;
    };

    /**
     * Loads the class by its name
     *
     * @param className
     *      The name of class. It should be compatible with the file path where
     *      it is located relative to "rootPath" configuration option of module.
     *
     * @param {Function} callback
     */
    ClassLoader.prototype.loadClass = function(className, callback)
    {
        var classManager = this.getClassManager();
        var loadManager = this.getLoadManager();
        var fileName = className + ".js";

        if (classManager.issetClass(className)) {
            return;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        loadManager.load(fileName, function() {
            if (!classManager.issetClass(className)) {
                Subclass.Error.create('The class "' + className + '" was not loaded.');
            }
            if (callback) {
                return callback();
            }
        });
    };

    /**
     * Tells that the class with specified name was loaded
     *
     * @param {string} className
     */
    ClassLoader.prototype.setClassLoaded = function(className)
    {
        var loadManager = this.getLoadManager();
        var fileName = className + '.js';

        //console.log(1, className);
        //
        //for (var i = 0; i < loadManager._stack.length; i++) {
        //    console.log((i + 1) + '.', loadManager._stack[i].file, loadManager._stack[i].fileFull);
        //}
        ////console.log(fileName);
        ////console.log('---------');
        //
        //console.log(loadManager.getStackItem(fileName));
        //console.log(this.getClassManager().issetClass(className));
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        //console.log('-----------------------');

        loadManager.removeFromStack(fileName);

        if (loadManager.isStackEmpty()) {
            loadManager.completeLoading();
        }
    };

    return ClassLoader;

})();