/**
 * @class
 * @constructor
 *
 * @throws {Error}
 *      Throws error if specified invalid instance of class manager
 *
 * @param {Subclass.ClassManager} classManager
 *      The instance of class manager
 */
Subclass.Class.ClassLoader = (function()
{
    function ClassLoader(classManager)
    {
        if (!classManager || !(classManager instanceof Subclass.ClassManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the class manager instance', false)
                .received(classManager)
                .expected('an instance of Subclass.ClassManager class')
                .apply()
            ;
        }

        /**
         * The instance of class manager
         *
         * @type {Subclass.ClassManager}
         */
        this._classManager = classManager;

        // Adding event listeners

        var eventManager = classManager.getModule().getEventManager();
        var loadManager = classManager.getModule().getLoadManager();

        // Removing from load stack all files of classes which are already loaded

        eventManager.getEvent('onAddToLoadStack')
            .addListener(function(evt, fileName, callback) {
                var className = fileName.replace(/\.js$/, '');

                if (classManager.isset(className)) {
                    loadManager.removeFromStack(fileName);
                }
            })
        ;

        // Removing from load stack process all files of classes which are already loaded

        eventManager.getEvent('onProcessLoadStack')
            .addListener(function(evt, stackItems) {
                for (var i = 0; i < stackItems.length; i++) {
                    var fileName = stackItems[i].file;
                    var className = fileName.replace(/\.js$/, '');

                    if (classManager.isset(className)) {
                        loadManager.removeFromStack(fileName);
                    }
                }
            })
        ;
    }

    /**
     * Returns the instance of class manager
     *
     * @method getClassManager
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @returns {Subclass.ClassManager}
     */
    ClassLoader.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Returns the instance of load manager
     *
     * @method getLoadManager
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @returns {Subclass.LoadManager}
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
     * @method loadClass
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @param className
     *      The name of class. It should be compatible with the file path where
     *      it is located relative to "rootPath" setting option of module.
     *
     * @param {Function} callback
     *      The callback function which will be invoked after the class will be loaded
     */
    ClassLoader.prototype.loadClass = function(className, callback)
    {
        var classManager = this.getClassManager();
        var loadManager = this.getLoadManager();
        var fileName = className + ".js";

        if (classManager.isset(className)) {
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
        loadManager.loadFile(fileName, function() {
            if (!classManager.isset(className)) {
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
     * @method setClassLoaded
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @param {string} className
     *      The name of class
     */
    ClassLoader.prototype.setClassLoaded = function(className)
    {
        var loadManager = this.getLoadManager();
        var fileName = className + '.js';

        loadManager.removeFromStack(fileName);

        if (loadManager.isStackEmpty()) {
            loadManager.completeLoading();
        }
    };

    return ClassLoader;

})();