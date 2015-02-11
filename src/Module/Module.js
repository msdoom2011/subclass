/**
 * @namespace
 */
Subclass.Module = {};

/**
 * @namespace
 */
Subclass.Module.Error = {};

/**
 * @class
 * @constructor
 * @description
 *
 * The class which allows to create Subclass module.
 * It's a structural unit that allows to split the project on multiple parts.
 * The main goal of current class is to provide extensibility of the project
 * by plug-ins (other modules which were marked as plug-ins).<br /><br />
 *
 * Using this class you can get access to module configuration, event manager,
 * class manager, property manager, parameter manager, service manager
 * and make all manipulations whatever you need.
 *
 * @throws {Error}
 *      Throws if was missed or is not a string the module name
 *
 * @param {string} moduleName
 *      A name of creating module
 *
 * @param {string[]} [modulePlugins=[]]
 *      Array with names of another modules which are plugins for current one
 *
 * @param {Object} [moduleConfigs={}]
 *      Module configuration object. Allowed configs are: <pre>
 *
 * plugin       {boolean}   opt   false  Tells that current module is
 *                                       a plugin and its onReady callback
 *                                       will be called only after this
 *                                       module will be included in main
 *                                       module.
 *
 * pluginOf     {string}    opt          Specifies parent module to which
 *                                       current one belongs to. If its sets
 *                                       in true the "plugin" option will
 *                                       atomatically sets in true.
 *
 * rootPath     {string}    opt          The path to root directory of the
 *                                       project.
 *
 * files        {string[]}  opt          Array of JS file names which you
 *                                       want to be loaded before the
 *                                       onReady callbacks will be called.
 *
 *                                       By default the path of the files
 *                                       is relative to the path specified
 *                                       in the "rootPath" option.
 *
 *                                       But also you may to specify the path
 *                                       not tied to the "rootPath" by the
 *                                       adding the symbol "^" at the start
 *                                       of the file name.
 *
 *                                       Example:
 *
 *                                       var moduleConfigs = {
 *                                         rootPath: "/asserts/scripts/app/",
 *                                         files: [
 *
 *                                           // path relative to rootPath
 *                                           "app.js",
 *
 *                                           // absolute path
 *                                           "^/asserts/vendors/script.js
 *                                         ],
 *                                         ...
 *                                       };
 *
 * dataTypes    {Object}    opt          Object, which keys are the type
 *                                       names (alias) and value are
 *                                       its definitions.
 *
 *                                       It allows to create the new data
 *                                       types based on the default data
 *                                       types using configuration whatever
 *                                       you need.
 *
 *                                       Also you may to change the
 *                                       configuration of the default
 *                                       data types.
 *
 *                                       Example:
 *
 *                                       var moduleConfigs = {
 *                                         ...
 *                                         dataTypes: {
 *
 *                                           // the new type
 *                                           percents: {
 *                                             type: "string",
 *                                             pattern: /^[0-9]+%$/
 *                                           },
 *
 *                                           // change existent type
 *                                           number: {
 *                                             type: "number",
 *                                             nullable: false,
 *                                             default: 100
 *                                           }
 *                                         },
 *                                         ...
 *                                       };
 *
 * onReady      {Function}  opt          Callback function that will be
 *                                       invoked when all module classes
 *                                       will be loaded.
 *
 * parameters   {Object}    opt          Object with parameters which can
 *                                       be used in service definitions
 *                                       or in any other places of the
 *                                       module.
 *
 *                                       Example:
 *
 *                                       var moduleConfigs = {
 *                                         ...
 *                                         parameters: {
 *                                           mode: "dev",
 *                                           foo: 111,
 *                                           bar: true,
 *                                           ...
 *                                         },
 *                                         ...
 *                                       };
 *
 * services     {Object}    opt          List of service definitions.
 *                                       To see more about service
 *                                       definition configuration look at
 *                                       {@link Subclass.Service.Service}
 *
 *                                       Example:
 *
 *                                       var moduleConfigs = {
 *                                         ...
 *                                         services: {
 *                                           foo: {
 *                                             className: "Path/Of/FooClass",
 *                                             arguments: ["%mode%]
 *                                           },
 *                                           bar: {
 *                                             className: "Path/Of/BarClass"
 *                                           },
 *                                           ...
 *                                         },
 *                                         ...
 *                                       };
 * </pre>
 */
Subclass.Module.Module = (function()
{
    /**
     * @alias Subclass.Module.Module
     */
    function Module(moduleName, modulePlugins, moduleConfigs)
    {
        var $this = this;

        if (!moduleName || typeof moduleName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleName)
                .expected('a string')
                .apply()
            ;
        }
        if (!moduleConfigs) {
            moduleConfigs = {};
        }
        if (!modulePlugins) {
            modulePlugins = [];
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
         * Module public api
         *
         * @type {Subclass.Module.ModuleAPI}
         * @private
         */
        this._api = new Subclass.Module.ModuleAPI(this);

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         * @private
         */
        this._eventManager = new Subclass.Event.EventManager(this);

        // Registering events

        this.getEventManager()
            .registerEvent('onModuleInit')
            .registerEvent('onReady')
            .registerEvent('onReadyBefore')
            .registerEvent('onReadyAfter')
            .registerEvent('onAddPlugin')
        ;

        /**
         * The load manager instance
         *
         * @type {Subclass.Module.LoadManager}
         * @private
         */
        this._loadManager = new Subclass.Module.LoadManager(this);

        /**
         * Collection of modules
         *
         * @type {Subclass.Module.ModuleManager}
         * @private
         */
        this._moduleManager = new Subclass.Module.ModuleManager(this, modulePlugins);

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
         * @type {Subclass.Module.ConfigManager}
         * @private
         */
        this._configManager = new Subclass.Module.ConfigManager(this);

        /**
         * Checks whether module is prepared for ready
         *
         * @type {boolean}
         * @private
         */
        this._prepared = false;

        /**
         * Tells that module is ready
         *
         * @type {boolean}
         * @private
         */
        this._ready = false;


        // Initializing module

        this.setConfigs(moduleConfigs);
        this.getClassManager().initialize();
        this.getLoadManager().initialize();
        this.getServiceManager().initialize();

        var eventManager = this.getEventManager();
        eventManager.getEvent('onModuleInit').triggerPrivate();

        // Calling onReady callback
        eventManager.getEvent('onLoadingEnd')
            .addListener(function() {
                $this.setReady();
            }
        );
    }

    /**
     * Returns name of the module
     *
     * @method getName
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {string}
     */
    Module.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets parent module.<br />
     * Allows to specify that the current module is a plugin relative to the parent module
     *
     * @method setParent
     * @memberOf Subclass.Module.Module.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not valid argument
     *
     * @param {(Subclass.Module.Module|null)} parentModule
     *      The parent module instance
     */
    Module.prototype.setParent = function(parentModule)
    {
        if (parentModule !== null && !(parentModule instanceof Subclass.Module.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the parent module instance", false)
                .received(parentModule)
                .expected('an instance of "Subclass.Module.Module"')
                .apply()
            ;
        }
        this._parent = parentModule;
    };

    /**
     * Returns parent module
     *
     * @method getParent
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {(Subclass.Module.Module|null)}
     */
    Module.prototype.getParent = function()
    {
        return this._parent;
    };

    /**
     * Checks whether current module belongs to another module,
     * i.e. is a plugin relative to another module
     *
     * @method hasParent
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.hasParent = function()
    {
        return !!this._parent;
    };

    /**
     * Returns the root parent module.<br /><br />
     *
     * If module is a plugin it holds a link to the parent module.
     * If parent in turn has a parent and so on, the module which is on the top
     * of the inheritance chain is called a root module.
     *
     * @method getRoot
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Module.Module}
     */
    Module.prototype.getRoot = function()
    {
        var parent = this;

        if (arguments[0] && arguments[0] instanceof Subclass.Module.Module) {
            parent = arguments[0];
        }
        if (parent.hasParent()) {
            parent = parent.getRoot(parent.getParent());
        }
        return parent
    };

    /**
     * Checks whether current module is root module,
     * i.e. hasn't the parent module and isn't a plugin.
     *
     * @method isRoot
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isRoot = function()
    {
        return !this.hasParent() && !this.isPlugin();
    };

    /**
     * Checks whether current module is a plug-in.
     *
     * @method isPlugin
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {*}
     */
    Module.prototype.isPlugin = function()
    {
        return this.getConfigManager().isPlugin();
    };

    /**
     * Returns the public api of the module which
     * is an instance of class Subclass.Module.ModuleAPI
     *
     * @method getAPI
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Module.ModuleAPI}
     */
    Module.prototype.getAPI = function()
    {
        return this._api;
    };

    /**
     * The same as the {@link Subclass.Module.ConfigManager#setConfigs}
     *
     * @method setConfigs
     * @memberOf Subclass.Module.Module.prototype
     */
    Module.prototype.setConfigs = function(configs)
    {
        return this.getConfigManager().setConfigs(configs);
    };

    /**
     * Returns an instance of manager that holds and processes module configuration.
     *
     * @method getConfigManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Module.ConfigManager}
     */
    Module.prototype.getConfigManager = function()
    {
        return this._configManager;
    };

    /**
     * Returns an instance of manager that allows to register new events,
     * subscribe listeners and triggers them at the appointed time
     *
     * @method getEventManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Event.EventManager}
     */
    Module.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns an instance of manager that holds and can process all plugins (modules which
     * names were specified earlier in module constructor as modulePlugins)
     * and link on this module
     *
     * @method getModuleManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Module.ModuleManager}
     */
    Module.prototype.getModuleManager = function()
    {
        return this._moduleManager;
    };

    /**
     * Returns the instance of load manager
     *
     * @method getLoadManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Module.LoadManager}
     */
    Module.prototype.getLoadManager = function()
    {
        return this._loadManager;
    };

    /**
     * Returns an instance of property manager which allows to register
     * custom data types and creates typed property instance by its definition.
     *
     * @method getPropertyManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    Module.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Returns class manager instance that allows to register, process, and get
     * classes of different type: Class, AbstractClass, Interface, Trait, Config
     *
     * @method getClassManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Class.ClassManager}
     */
    Module.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Returns an instance of parameter manager which allows to register parameters,
     * set and get its values throughout the project
     *
     * @method getParameterManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Parameter.ParameterManager}
     */
    Module.prototype.getParameterManager = function()
    {
        return this._parameterManager;
    };

    /**
     * Returns an instance of service manager which allows to register, build and
     * get services throughout the project
     *
     * @method getServiceManager
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {Subclass.Service.ServiceManager}
     */
    Module.prototype.getServiceManager = function()
    {
        return this._serviceManager;
    };

    /**
     * The same as the {@link Subclass.Module.ConfigManager#setOnReady}
     *
     * @method onReady
     * @memberOf Subclass.Module.Module.prototype
     *
     * @param {Function} callback
     *      The callback function
     */
    Module.prototype.onReady = function(callback)
    {
        this.getConfigManager().setOnReady(callback);
    };

    /**
     * Invokes registered onReady callback functions forcibly.<br /><br />
     *
     * If current module contains plug-ins then will be invoked onReady callbacks
     * from current module first and then will be invoked onReady callbacks
     * from plug-ins in order as they were added to the current module.
     *
     * @method triggerOnReady
     * @memberOf Subclass.Module.Module.prototype
     */
    Module.prototype.triggerOnReady = function()
    {
        this.getEventManager().getEvent('onReady').trigger();
    };

    /**
     * Sets that module is prepared
     *
     * @method setPrepared
     * @memberOf Subclass.Module.Module.prototype
     */
    Module.prototype.setPrepared = function()
    {
        this._prepared = true;
    };

    /**
     * Checks whether the module is prepared
     *
     * @method isPrepared
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isPrepared = function()
    {
        return this._prepared;
    };

    /**
     * Brings module to ready state and invokes registered onReady callback functions.
     * It can be invoked only once otherwise nothing will happen.
     *
     * @method setReady
     * @memberOf Subclass.Module.Module.prototype
     */
    Module.prototype.setReady = function()
    {
        if (this.isReady()) {
            return;
        }
        var loadManager = this.getLoadManager();
        this.setPrepared();

        if (
            !loadManager.isLoadingLocked()
            && loadManager.isStackEmpty()
            && this.isPluginsReady()
        ) {
            this._ready = true;

            if (this.isPlugin() && this.hasParent()) {
                var rootModule = this.getRoot();
                var rootModuleManager = rootModule.getModuleManager();

                if (rootModuleManager.issetLazyModule(this.getName())) {
                    rootModuleManager.resolveLazyModule(this.getName());
                }
                if (!rootModule.isReady()) {
                    return rootModule.setReady();
                }
            }

            if ((
                    this.isRoot()
                ) || (
                    this.isPlugin()
                    && this.hasParent()
                    && this.getRoot().isReady()
                )
            ) {
                this.getEventManager().getEvent('onReadyBefore').trigger();
                this.triggerOnReady();
                this.getEventManager().getEvent('onReadyAfter').trigger();
            }
        }
    };

    /**
     * Checks if current class manager instance is ready and was
     * initialized by invoking onReady registered callback functions
     *
     * @method isReady
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isReady = function()
    {
        return this._ready;
    };

    /**
     * Checks whether the all module plug-ins are ready
     *
     * @method isPluginsReady
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isPluginsReady = function()
    {
        var moduleManager = this.getModuleManager();
        var plugins = moduleManager.getPlugins();
        var result = true;

        if (moduleManager.hasLazyModules()) {
            return false;
        }

        for (var i = 0; i < plugins.length; i++) {
            if (
                result
                && (
                    !plugins[i].isPrepared()
                    || !plugins[i].isPluginsReady()
                )
            ) {
                result = false;
                break;
            }
        }
        return result;
    };

    /**
     * Allows to add plug-in to the current module.
     * If specified the second argument it means that first
     * will be loaded the specified files and then the plug-in module
     * will be added to current module and will be invoked
     * it onReady callback functions.
     *
     * @method addPlugin
     * @memberOf Subclass.Module.Module.prototype
     *
     * @param {string} moduleName
     *      The name of the module which you want to add to the current one as a plug-in
     *
     * @param {(Array.<Object>|string)} [moduleFile]
     *      A file name with the definition of plug-in module.
     *
     * @param {Function} [callback]
     *      The callback function which will be invoked when plug-in module becomes ready.
     *      It is actual only if the module files (the second argument) was specified.
     *      Otherwise it will never be invoked.
     */
    Module.prototype.addPlugin = function(moduleName, moduleFile, callback)
    {
        var loadManager = this.getLoadManager();
        var $this = this;

        if (!moduleName || typeof moduleName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleName)
                .expected("a string")
                .apply()
            ;
        } else if (
            Subclass.issetModule(moduleName)
            && Subclass.getModule(moduleName).getParentModule()
        ) {
            Subclass.Error.create(
                'The module "' + moduleName + '" is already ' +
                'added as a plug-in to another module.'
            );
        }
        if (moduleFile && typeof moduleFile != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleFile)
                .expected("a string or be omitted")
                .apply()
            ;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (!moduleFile && callback) {
            Subclass.Error.create(
                'You can\'t specify the callback function without ' +
                'file of module "' + moduleName + '".'
            );
        }
        if (moduleFile) {
            loadManager.load(moduleFile, function() {
                if (callback) {
                    var module = Subclass.getModule(moduleName).getModule();
                    var moduleEventManager = module.getEventManager();

                    moduleEventManager.getEvent('onLoadingEnd').addListener(function() {
                        callback();
                    });
                }
                $this.addPlugin(moduleName);
            });

            return;
        }

        var eventManager = this.getEventManager();
        var moduleManager = this.getModuleManager();
            moduleManager.addPlugin(moduleName);

        if (this.isPrepared()) {
            var pluginModule = Subclass.getModule(moduleName).getModule();
            var pluginEventManager = pluginModule.getEventManager();
            var pluginLoadManager = pluginModule.getLoadManager();

            pluginLoadManager.unlockLoading();

            if (pluginModule.isPrepared()) {
                eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
            } else {
                pluginEventManager.getEvent('onLoadingEnd').addListener(100000, function () {
                    eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
                });
            }
        }
    };

    /**
     * Checks whether current module has any plugins
     *
     * @method hasPlugins
     * @memberOf Subclass.Module.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.hasPlugins = function()
    {
        return !!this.getModuleManager().getPlugins().length;
    };

    return Module;

})();