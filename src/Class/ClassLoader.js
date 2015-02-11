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
    }

    ClassLoader.prototype.getClassManager = function()
    {
        return this._classManager;
    };

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

        loadManager.addToStack(fileName, function() {
            var classInst = classManager.getClass(className);
            return callback(classInst);
        });
    };

    /**
     * Tells that the class with specified name was loaded
     *
     * @param {string} className
     */
    ClassLoader.prototype.setClassLoaded = function(className)
    {
        var classManager = this.getClassManager();
        var loadManager = this.getLoadManager();
        var fileName = className + '.js';

        loadManager.removeFromStack(fileName);
    };

    return ClassLoader;

})();