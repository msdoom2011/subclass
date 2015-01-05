/**
 * @namespace
 */
Subclass.Module = {};

/**
 * @class
 */
Subclass.Module.Module = (function()
{
    /**
     * Subclass module constructor
     *
     * @param {string} moduleName
     * @param {Object} [moduleConfigs]
     *
     *      Allowed configs are:
     *      ------------------------------------------------------------------------------------------------------
     *
     *      autoload        {boolean}           optional    Enables class autoload or not. It's true by default
     *
     *      rootPath        {string}            optional    Path to root directory of the project. It's required
     *                                                      if you planning to use autoload
     *
     *      dataTypes       {Object.<Object>}   optional    Object, which keys will be type names (alias)
     *                                                      and value will be its definitions
     *
     *      parameters      {Object}            optional    Object with parameters which can be used
     *                                                      in service definitions or in any other places,
     *                                                      i.e in classes.
     *
     *      services        {Object.<Object>}   optional    List of service definitions.
     *
     *      onReady         {Function}          optional    Callback that will be invoked when all module
     *                                                      classes will be loaded
     *
     * @constructor
     */
    function Module(moduleName, moduleConfigs)
    {
        var $this = this;

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         * @private
         */
        this._eventManager = new Subclass.Event.EventManager(this);

        /**
         * Class manager instance
         *
         * @type {ClassManager}
         * @private
         */
        this._classManager = Subclass.Class.ClassManager.create(this);

        /**
         * Property manager instance
         *
         * @type {Subclass.Property.PropertyManager}
         * @private
         */
        this._propertyManager = Subclass.Property.PropertyManager.create(this);

        /**
         * Service manager instance
         *
         * @type {Subclass.Service.ServiceManager}
         * @private
         */
        this._serviceManager = new Subclass.Service.ServiceManager(this);

        /**
         * Collection of module dependencies
         *
         * @type {Array.<Subclass.Module.Module>}
         * @private
         */
        this._dependencies = [];

        /**
         * Module configuration
         *
         * @type {Subclass.Module.ModuleConfig}
         * @private
         */
        this._configs = {};

        /**
         * Tells that module is ready
         *
         * @type {boolean}
         * @private
         */
        this._ready = false;


        // Initializing

        if (Array.isArray(moduleConfigs)) {
            this._dependencies = moduleConfigs;

            if (arguments[2] && typeof arguments[2] == 'object') {
                this._configs = arguments[2];
            }

        } else if (moduleConfigs) {
            this._configs = moduleConfigs;
        }

        // Performing configs

        this._configs = new Subclass.Module.ModuleConfig(this,this._configs);
        this._configs.initialize(moduleConfigs);


        // Performing dependencies
        // @TODO

        // Adding event listeners

        this.getEventManager().getEvent('onLoadingEnd')
            .addListener(function() {
                $this.callReadyCallback();
            })
        ;
    }

    /**
     * Returns module configs
     *
     * @returns {Subclass.Module.ModuleConfig}
     */
    Module.prototype.getConfigs = function()
    {
        return this._configs;
    };

    /**
     * Returns event manager instance
     *
     * @returns {Subclass.Event.EventManager}
     */
    Module.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns class manager instance
     *
     * @returns {ClassManager}
     */
    Module.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    Module.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Returns service manager instance
     *
     * @returns {Subclass.Service.ServiceManager}
     */
    Module.prototype.getServiceManager = function()
    {
        return this._serviceManager;
    };

    /**
     * Sets callback when all classes was defined and loaded
     */
    Module.prototype.onReady = function(callback)
    {
        this.getConfigs().setOnReady(callback);
    };

    /**
     * Invokes init callback
     */
    Module.prototype.callReadyCallback = function()
    {
        if (!this.getConfigs().getOnReady()) {
            return;
        }
        if (this.getClassManager().isLoadStackEmpty()) {
            var onReadyCallback = this.getConfigs().getOnReady();
            this._ready = true;

            if (onReadyCallback) {
                onReadyCallback();
            }
        }
    };

    /**
     * Checks if current class manager instance was initialized
     *
     * @returns {boolean}
     */
    Module.prototype.isReady = function()
    {
        return this._ready;
    };

    /**
     * Returns class definition
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    Module.prototype.getClass = function(className)
    {
        return this.getClassManager().getClass(className);
    };

    /**
     * Checks whether class with specified name exists
     *
     * @param {string} className
     * @returns {boolean}
     */
    Module.prototype.issetClass = function(className)
    {
        return this.getClassManager().issetClass(className);
    };

    /**
     * Creates class builder for class of specified type
     *
     * @param {string} classType
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    Module.prototype.buildClass = function(classType)
    {
        return this.getClassManager().buildClass(classType);
    };

    /**
     * Modifies existent class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    Module.prototype.alterClass = function(className)
    {
        return this.getClassManager().alterClass(className);
    };

    return Module;

})();