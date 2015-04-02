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
 * load manager, class manager and make all manipulations whatever you need.
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
 //* dataTypes    {Object}    opt          Object, which keys are the type
 //*                                       names and values are
 //*                                       its definitions.
 //*
 //*                                       It allows to create the new data
 //*                                       types based on the default
 //*                                       (registered) data types using
 //*                                       configuration whatever you need.
 //*
 //*                                       Also you may to change
 //*                                       configuration of the default
 //*                                       data types.
 //*
 //*                                       Example:
 //*
 //*                                       var moduleConfigs = {
 //*                                         ...
 //*                                         dataTypes: {
 //*
 //*                                           // creating the new type
 //*                                           percents: {
 //*                                             type: "string",
 //*                                             pattern: /^[0-9]+%$/
 //*                                           },
 //*
 //*                                           // altering existent type
 //*                                           number: {
 //*                                             type: "number",
 //*                                             nullable: false,
 //*                                             default: 100
 //*                                           }
 //*                                         },
 //*                                         ...
 //*                                       };
 *
 * onReady      {Function}  opt          Callback function that will be
 *                                       invoked when all module classes
 *                                       will be loaded.
 *
 //
 //
 //=========================================================================
 //================================ SERVICE ================================
 //=========================================================================
 //* services     {Object}    opt          List of service definitions.
 //*                                       To see more about service
 //*                                       definition configuration look at
 //*                                       {@link Subclass.Service.Service}
 //*
 //*                                       Example:
 //*
 //*                                       var moduleConfigs = {
 //*                                         ...
 //*                                         services: {
 //*                                           foo: {
 //*                                             className: "Path/Of/FooClass",
 //*                                             arguments: ["%mode%]
 //*                                           },
 //*                                           bar: {
 //*                                             className: "Path/Of/BarClass"
 //*                                           },
 //*                                           ...
 //*                                         },
 //*                                         ...
 //*                                       };
 //=========================================================================
 //================================ SERVICE ================================
 //=========================================================================
 * </pre>
 */
Subclass.Module = (function()
{
    /**
     * @alias Subclass.Module
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
         * @type {(Subclass.Module|null)}
         * @private
         */
        this._parent = null;

        /**
         * Module public api
         *
         * @type {Subclass.ModuleAPI}
         * @private
         */
        this._api = Subclass.Tools.createClassInstance(Subclass.ModuleAPI, this);

        /**
         * Event manager instance
         *
         * @type {Subclass.EventManager}
         * @private
         */
        this._eventManager = Subclass.Tools.createClassInstance(Subclass.EventManager, this);

        // Registering events

        this.getEventManager()
            .registerEvent('onInitializeBefore')
            .registerEvent('onInitialize')
            .registerEvent('onInitializeAfter')
            .registerEvent('onReady')
            .registerEvent('onReadyBefore')
            .registerEvent('onReadyAfter')
            .registerEvent('onAddPlugin')
        ;

        /**
         * The load manager instance
         *
         * @type {Subclass.LoadManager}
         * @private
         */
        this._loadManager = Subclass.Tools.createClassInstance(Subclass.LoadManager, this);

        /**
         * Collection of modules
         *
         * @type {Subclass.ModuleStorage}
         * @private
         */
        this._moduleStorage = Subclass.Tools.createClassInstance(Subclass.ModuleStorage, this, modulePlugins);
        //
        ///**
        // * Property manager instance
        // *
        // * @type {Subclass.Property.PropertyManager}
        // * @private
        // */
        //this._propertyManager = new Subclass.Property.PropertyManager(this);

        /**
         * Class manager instance
         *
         * @type {Subclass.ClassManager}
         * @private
         */
        this._classManager = Subclass.Tools.createClassInstance(Subclass.ClassManager, this);
        //=========================================================================
        //================================ SERVICE ================================
        //=========================================================================
        //
        ///**
        // * Service manager instance
        // *
        // * @type {Subclass.Service.ServiceManager}
        // * @private
        // */
        //this._serviceManager = new Subclass.Service.ServiceManager(this);
        //
        //=========================================================================
        //================================ SERVICE ================================
        //=========================================================================

        /**
         * Module configuration
         *
         * @type {Subclass.ConfigManager}
         * @private
         */
        this._configManager = Subclass.Tools.createClassInstance(Subclass.ConfigManager, this);

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

        var eventManager = this.getEventManager();

        // Adding initialize callbacks from static scope

        for (var i = 0; i < Module._initializersBefore.length; i++) {
            eventManager.getEvent('onInitializeBefore').addListener(Module._initializersBefore[i]);
        }
        for (i = 0; i < Module._initializersAfter.length; i++) {
            eventManager.getEvent('onInitializeAfter').addListener(Module._initializersAfter[i]);
        }

        eventManager.getEvent('onInitializeBefore').triggerPrivate(this);

        this.initializeExtensions();
        eventManager.getEvent('onInitialize').triggerPrivate(this);

        this.setConfigs(moduleConfigs);
        this.getClassManager().initialize();
        this.getLoadManager().initialize();
        //=========================================================================
        //================================ SERVICE ================================
        //=========================================================================
        //
        //this.getServiceManager().initialize();
        //
        //=========================================================================
        //================================ SERVICE ================================
        //=========================================================================


        eventManager.getEvent('onInitializeAfter').triggerPrivate(this);

        // Calling onReady callback

        eventManager.getEvent('onLoadingEnd').addListener(1000, function(evt) {
            $this.setReady();
        });
    }

    Module.$parent = Subclass.Extendable;

    /**
     * Array of function callbacks which will be invoked when module initializes
     * before module configuration options was processed
     *
     * @type {Array}
     * @static
     */
    Module._initializersBefore = [];

    /**
     * Array of function callbacks which will be invoked when module
     * initializes after module configuration options was processed
     *
     * @type {Array}
     * @static
     */
    Module._initializersAfter = [];

    /**
     * Adds new initializer to module
     */
    Module.onInitializeBefore = function(callback)
    {
        if (!callback || typeof callback != 'function') {
            Subclass.Error.create("InvalidArgument")
                .argument("the callback function", false)
                .expected("a function")
                .received(callback)
                .save()
            ;
        }
        if (this._initializersBefore.indexOf() < 0) {
            this._initializersBefore.push(callback);
        }
    };

    /**
     * Adds new initializer to module
     */
    Module.onInitializeAfter = function(callback)
    {
        if (!callback || typeof callback != 'function') {
            Subclass.Error.create("InvalidArgument")
                .argument("the callback function", false)
                .expected("a function")
                .received(callback)
                .save()
            ;
        }
        if (this._initializersAfter.indexOf() < 0) {
            this._initializersAfter.push(callback);
        }
    };

    /**
     * Returns name of the module
     *
     * @method getName
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not valid argument
     *
     * @param {(Subclass.Module|null)} parentModule
     *      The parent module instance
     */
    Module.prototype.setParent = function(parentModule)
    {
        if (parentModule !== null && !(parentModule instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the parent module instance", false)
                .received(parentModule)
                .expected('an instance of "Subclass.Module"')
                .apply()
            ;
        }
        this._parent = parentModule;
    };

    /**
     * Returns parent module
     *
     * @method getParent
     * @memberOf Subclass.Module.prototype
     *
     * @returns {(Subclass.Module|null)}
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
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.getRoot = function()
    {
        //var parent = this;
        //
        //if (arguments[0] && arguments[0] instanceof Subclass.Module) {
        //    parent = arguments[0];
        //}
        //if (parent.hasParent()) {
        //    parent = parent.getRoot(parent.getParent());
        //}

        if (this.hasParent()) {
            return this.getParent().getRoot();
        }
        return this;

        //return parent
    };

    /**
     * Checks whether current module is root module,
     * i.e. hasn't the parent module and isn't a plugin.
     *
     * @method isRoot
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     *
     * @returns {*}
     */
    Module.prototype.isPlugin = function()
    {
        return this.getConfigManager().isPlugin();
    };

    /**
     * Returns the public api of the module which
     * is an instance of class Subclass.ModuleAPI
     *
     * @method getAPI
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ModuleAPI}
     */
    Module.prototype.getAPI = function()
    {
        return this._api;
    };

    /**
     * The same as the {@link Subclass.ConfigManager#setConfigs}
     *
     * @method setConfigs
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setConfigs = function(configs)
    {
        return this.getConfigManager().setConfigs(configs);
    };

    /**
     * Returns an instance of manager that holds and processes module configuration.
     *
     * @method getConfigManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ConfigManager}
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
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.EventManager}
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
     * @method getModuleStorage
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ModuleStorage}
     */
    Module.prototype.getModuleStorage = function()
    {
        return this._moduleStorage;
    };

    /**
     * Returns the instance of load manager
     *
     * @method getLoadManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.LoadManager}
     */
    Module.prototype.getLoadManager = function()
    {
        return this._loadManager;
    };
    //
    ///**
    // * Returns an instance of property manager which allows to register
    // * custom data types and creates typed property instance by its definition.
    // *
    // * @method getPropertyManager
    // * @memberOf Subclass.Module.prototype
    // *
    // * @returns {Subclass.Property.PropertyManager}
    // */
    //Module.prototype.getPropertyManager = function()
    //{
    //    return this._propertyManager;
    //};

    /**
     * Returns class manager instance that allows to register, process, and get
     * classes of different type: Class, AbstractClass, Interface, Trait, Config
     *
     * @method getClassManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ClassManager}
     */
    Module.prototype.getClassManager = function()
    {
        return this._classManager;
    };
    //=========================================================================
    //================================ SERVICE ================================
    //=========================================================================
    ///**
    // * Returns an instance of service manager which allows to register, build and
    // * get services throughout the project
    // *
    // * @method getServiceManager
    // * @memberOf Subclass.Module.prototype
    // *
    // * @returns {Subclass.Service.ServiceManager}
    // */
    //Module.prototype.getServiceManager = function()
    //{
    //    return this._serviceManager;
    //};
    //=========================================================================
    //================================ SERVICE ================================
    //=========================================================================

    /**
     * The same as the {@link Subclass.ConfigManager#setOnReady}
     *
     * @method onReady
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.triggerOnReady = function()
    {
        this.getEventManager().getEvent('onReady').trigger();
    };

    /**
     * Sets that module is prepared
     *
     * @method setPrepared
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setPrepared = function()
    {
        this._prepared = true;
    };

    /**
     * Checks whether the module is prepared
     *
     * @method isPrepared
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setReady = function()
    {
        if (this.isReady()) {
            return;
        }
        var loadManager = this.getLoadManager();
        this.setPrepared();

        if (
            loadManager.isStackEmpty()
            && this.isPluginsReady()
        ) {
            this._ready = true;

            if (this.isPlugin() && this.hasParent()) {
                var rootModule = this.getRoot();
                var rootModuleStorage = rootModule.getModuleStorage();

                if (rootModuleStorage.issetLazyModule(this.getName())) {
                    rootModuleStorage.resolveLazyModule(this.getName());
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
     * @memberOf Subclass.Module.prototype
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
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isPluginsReady = function()
    {
        var moduleStorage = this.getModuleStorage();
        var plugins = moduleStorage.getPlugins();
        var result = true;

        if (moduleStorage.hasLazyModules()) {
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
     * @memberOf Subclass.Module.prototype
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
            loadManager.loadFile(moduleFile, function() {
                if (callback) {
                    var module = Subclass.getModule(moduleName).getModule();
                    var moduleEventManager = module.getEventManager();

                    moduleEventManager.getEvent('onLoadingEnd').addListener(callback);
                }
                $this.addPlugin(moduleName);
            });

            return;
        }

        var eventManager = this.getEventManager();
        var moduleStorage = this.getModuleStorage();
            moduleStorage.addPlugin(moduleName);

        if (this.isPrepared()) {
            var pluginModule = Subclass.getModule(moduleName).getModule();
            var pluginEventManager = pluginModule.getEventManager();
            var pluginLoadManager = pluginModule.getLoadManager();

            if (pluginModule.isPrepared()) {
                eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
            } else {
                pluginLoadManager.startLoading();
                pluginEventManager.getEvent('onLoadingEnd').addListener(100000, function (evt) {
                    eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
                });
            }
        }
    };

    /**
     * Checks whether current module has any plugins
     *
     * @method hasPlugins
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.hasPlugins = function()
    {
        return !!this.getModuleStorage().getPlugins().length;
    };

    return Module;

})();