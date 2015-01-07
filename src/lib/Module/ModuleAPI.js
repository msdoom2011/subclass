/**
 * @class
 */
Subclass.Module.ModuleAPI = (function()
{
    /**
     * @param {Subclass.Module.Module} module
     * @constructor
     */
    function ModuleAPI(module)
    {
        /**
         * Module instance
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;
    }

    /**
     * Returns module instance
     * @returns {*}
     */
    ModuleAPI.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns name of the module
     *
     * @returns {string}
     */
    ModuleAPI.prototype.getName = function()
    {
        return this.getModule().getName.apply(this.getModule(), arguments);
    };

    /**
     * Returns class definition
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ModuleAPI.prototype.getClass = function(className)
    {
        return this.getModule().getClassManager().getClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * Checks whether class with specified name exists
     *
     * @param {string} className
     * @returns {boolean}
     */
    ModuleAPI.prototype.issetClass = function(className)
    {
        return this.getModule().getClassManager().issetClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * Creates class builder for class of specified type
     *
     * @param {string} classType
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ModuleAPI.prototype.buildClass = function(classType)
    {
        return this.getModule().getClassManager().buildClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * Modifies existent class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ModuleAPI.prototype.alterClass = function(className)
    {
        return this.getModule().getClassManager().alterClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * Sets callback when all classes was defined and loaded
     */
    ModuleAPI.prototype.onReady = function(callback)
    {
        return this.getModule().onReady.apply(this.getModule(), arguments);
    };

    /**
     * Sets callback when all classes was defined and loaded
     */
    ModuleAPI.prototype.triggerReady = function()
    {
        return this.getModule().triggerReady.apply(this.getModule(), arguments);
    };

    /**
     * Checks if current class manager instance was initialized
     *
     * @returns {boolean}
     */
    ModuleAPI.prototype.isReady = function()
    {
        return this.getModule().isReady.apply(this.getModule(), arguments);
    };

    /**
     * Sets module configs. It's allowed while module is not ready yet
     *
     * @returns {*}
     */
    ModuleAPI.prototype.setConfigs = function()
    {
        return this.getModule().setConfigs.apply(this.getModule(), arguments);
    };

    /**
     * Returns module configs manager
     *
     * @returns {Subclass.Module.ModuleConfigs}
     */
    ModuleAPI.prototype.getConfigManager = function()
    {
        return this.getModule().getConfigManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns event manager instance
     *
     * @returns {Subclass.Event.EventManager}
     */
    ModuleAPI.prototype.getEventManager = function()
    {
        return this.getModule().getEventManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ModuleAPI.prototype.getClassManager = function()
    {
        return this.getModule().getClassManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    ModuleAPI.prototype.getPropertyManager = function()
    {
        return this.getModule().getPropertyManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns service manager instance
     *
     * @returns {Subclass.Service.ServiceManager}
     */
    ModuleAPI.prototype.getServiceManager = function()
    {
        return this.getModule().getServiceManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns parameter manager instance
     *
     * @returns {Subclass.Parameter.ParameterManager}
     */
    ModuleAPI.prototype.getParameterManager = function()
    {
        return this.getModule().getParameterManager.apply(this.getModule(), arguments);
    };

    /**
     * Returns service class instance
     *
     * @param {string} serviceName
     * @returns {Object}
     */
    ModuleAPI.prototype.getService = function(serviceName)
    {
        return this.getModule().getServiceManager().getService.apply(
            this.getModule().getServiceManager(),
            arguments
        );
    };

    /**
     * Sets parameter value
     *
     * @param parameterName
     * @param value
     */
    ModuleAPI.prototype.setParameter = function(parameterName, value)
    {
        return this.getModule().getParameterManager().setParameter.apply(
            this.getModule().getParameterManager(),
            arguments
        );
    };

    /**
     * Returns parameter value
     *
     * @param {string} parameterName
     * @returns {*}
     */
    ModuleAPI.prototype.getParameter = function(parameterName)
    {
        return this.getModule().getParameterManager().getParameter.apply(
            this.getModule().getParameterManager(),
            arguments
        );
    };

    /**
     * Returns root module
     *
     * @returns {Subclass.Module.Module}
     */
    ModuleAPI.prototype.getRootModule = function()
    {
        return this.getModule().getRoot.apply(this.getModule(), arguments);
    };

    /**
     * Checks whether current module is a root module
     *
     * @returns {boolean}
     */
    ModuleAPI.prototype.isRootModule = function()
    {
        return this.getModule().isRoot.apply(this.getModule(), arguments);
    };

    /**
     * Returns parent module
     *
     * @returns {Subclass.Module.Module|null|Object}
     */
    ModuleAPI.prototype.getParentModule = function()
    {
        var parent = this.getModule().getParent.apply(this.getModule(), arguments);

        if (parent == this.getModule()) {
            parent = null;
        }
        return parent;
    };

    return ModuleAPI;

})();