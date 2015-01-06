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
     *      plugin          {boolean}           optional    Tells that current module is a plugin and its onReady
     *                                                      callback will be called only after this module will
     *                                                      be included in main module. If plugin is true
     *                                                      the autoload parameter automatically sets in false
     *                                                      and can't be changed. Default false.
     *
     *      autoload        {boolean}           optional    Enables class autoload or not. It's true by default
     *
     *      rootPath        {string}            optional    Path to root directory of the project. It's required
     *                                                      if autoload parameter value is true.
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
        var dependencies, configs;
        var $this = this;

        if (Array.isArray(moduleConfigs)) {
            dependencies = moduleConfigs;

            if (arguments[2] && typeof arguments[2] == 'object') {
                configs = arguments[2];
            }

        } else if (moduleConfigs) {
            configs = moduleConfigs;
        }
        if (!configs) {
            configs = {};
        }
        if (!dependencies) {
            dependencies = [];
        }

        /**
         * Name of the module
         *
         * @type {string}
         * @private
         */
        this._name = moduleName;

        /**
         * Parent module (if current one is a plugin relative to parent module)
         *
         * @type {(Subclass.Module.Module|null)}
         * @private
         */
        this._parent = null;

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         * @private
         */
        this._eventManager = new Subclass.Event.EventManager(this);

        /**
         * Collection of modules
         *
         * @type {Subclass.Module.ModuleManager}
         * @private
         */
        this._moduleManager = new Subclass.Module.ModuleManager(this, dependencies);

        /**
         * Property manager instance
         *
         * @type {Subclass.Property.PropertyManager}
         * @private
         */
        this._propertyManager = new Subclass.Property.PropertyManager(this);

        /**
         * Class manager instance
         *
         * @type {Subclass.Class.ClassManager}
         * @private
         */
        this._classManager = new Subclass.Class.ClassManager(this);
        this._classManager.initialize();

        /**
         * Service manager instance
         *
         * @type {Subclass.Service.ServiceManager}
         * @private
         */
        this._serviceManager = new Subclass.Service.ServiceManager(this);

        /**
         * Parameter manager instance
         *
         * @type {Subclass.Parameter.ParameterManager}
         * @private
         */
        this._parameterManager = new Subclass.Parameter.ParameterManager(this);

        /**
         * Module configuration
         *
         * @type {Subclass.Module.ModuleConfig}
         * @private
         */
        this._configs = new Subclass.Module.ModuleConfig(this);
        this._configs.initialize(configs);

        /**
         * Tells that module is ready
         *
         * @type {boolean}
         * @private
         */
        this._ready = false;


        // Adding event listeners

        this.getEventManager().getEvent('onLoadingEnd').addListener(function() {
            if (!$this.getConfigs().isPlugin()) {
                $this.callReadyCallback();
            }
        });
    }

    /**
     * Returns module name
     *
     * @returns {string}
     */
    Module.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets parent module
     *
     * @param parentModule
     */
    Module.prototype.setParent = function(parentModule)
    {
        if (parentModule !== null && !(parentModule instanceof Subclass.Module.Module)) {
            throw new Error('Invalid parent module. It must be instance of "Subclass.Module.Module".');
        }
        this._parent = parentModule;
    };

    /**
     * Returns parent module
     *
     * @returns {(Subclass.Module.Module|null)}
     */
    Module.prototype.getParent = function()
    {
        return this._parent;
    };

    /**
     * Checks whether current module belongs to another module
     *
     * @returns {boolean}
     */
    Module.prototype.hasParent = function()
    {
        return !!this._parent;
    };

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
     * Returns module manager instance
     *
     * @returns {Subclass.Module.ModuleManager}
     */
    Module.prototype.getModuleManager = function()
    {
        return this._moduleManager;
    };

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
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
     * Returns parameter manager instance
     *
     * @returns {Subclass.Parameter.ParameterManager}
     */
    Module.prototype.getParameterManager = function()
    {
        return this._parameterManager;
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