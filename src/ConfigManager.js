/**
 * @class
 * @constructor
 * @description
 *
 * The class which holds and manages module configuration.
 * It can validate, set and get configuration parameters.<br /><br />
 *
 * To see the list of available configuration parameters
 * look at description of {@link Subclass.Module}
 * class constructor parameters.
 *
 * @param {Subclass.Module} module
 *      The module instance
 */
Subclass.ConfigManager = (function()
{
    /**
     * @alias Subclass.ConfigManager
     */
    function ConfigManager(module)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Indicates is the current module a plug-in
         *
         * @type {boolean}
         * @private
         */
        this._plugin = false;

        /**
         * Indicates that current module is a plugin and belongs to specified module
         *
         * @type {(string|null)}
         * @private
         */
        this._pluginOf = null;

        /**
         * Root path of the project
         *
         * @type {string}
         * @private
         */
        this._rootPath = "";

        /**
         * A list of files
         *
         * @type {Array}
         * @private
         */
        this._files = [];

        /**
         * List of class manager events
         *
         * @type {Object}
         * @private
         */
        this._events = {};


        // Initializing operations

        this.registerEvent('onInitialize');
        this.getEvent('onInitialize').trigger();
    }

    ConfigManager.$parent = Subclass.Extendable;

    ConfigManager.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Sets new module configs.
     *
     * New configuration parameters will rewrite earlier ones, for example,
     * specified in module constructor or in earlier call of ConfigManager#setConfigs method.
     *
     * @method setConfigs
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *     Throws error when:<br />
     *     - if module is ready;<br />
     *     - specified argument is not a plain object;<br />
     *     - in configuration object specified non agreed parameter.
     *
     * @param {Object} moduleConfigs
     *     Object with module configuration parameters
     *
     * @example
     * ...
     *
     * var moduleInst = Subclass.createModule('myApp');
     *
     * ...
     * var moduleConfigs = moduleInst.getConfigManager();
     * var parameterManager = moduleInst.getParameterManager();
     *
     * moduleConfigs.setConfigs({ // or easily use moduleInst.setConfigs({...});
     *     rootPath: "path/to/project/root/dir",  // adds new parameter
     * });
     *
     * moduleConfigs.getRootPath();               // Return "path/to/project/root/dir"
     * ...
     */
    ConfigManager.prototype.setConfigs = function (moduleConfigs)
    {
        var $this = this;

        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change configs in ready module.');
        }
        if (moduleConfigs && !Subclass.Tools.isPlainObject(moduleConfigs)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the module configuration", false)
                .received(moduleConfigs)
                .expected("a plain object")
                .apply()
            ;
        }
        if (moduleConfigs) {
            if (moduleConfigs.hasOwnProperty('pluginOf')) {
                this.setPluginOf(moduleConfigs.pluginOf);
            }
            if (moduleConfigs.hasOwnProperty('files')) {
                this.setFiles(moduleConfigs.files);
            }

            for (var configName in moduleConfigs) {
                if (
                    !moduleConfigs.hasOwnProperty(configName)
                    || [
                        'pluginOf',
                        'files',
                        'onReady'
                    ].indexOf(configName) >= 0
                ) {
                    continue;
                }
                var setterName = "set" + configName[0].toUpperCase() + configName.substr(1);

                if (!this[setterName]) {
                    Subclass.Error.create(
                        'Configuration option "' + configName + '" is not allowed ' +
                        'by the module.'
                    );
                }
                this[setterName](moduleConfigs[configName]);
            }
            if (moduleConfigs.hasOwnProperty('onReady')) {
                $this.setOnReady(moduleConfigs.onReady);
            }
        }
    };

    /**
     * Returns module instance to which current configuration manager belongs
     *
     * @method getModule
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {Subclass.Module}
     */
    ConfigManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets a specific state would be current module a plug-in or not.
     *
     * If module is marked as a plug-in then its registered onReady callback functions
     * will be invoked only when the root module becomes ready.
     *
     * @method setPlugin
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - was specified not boolean value
     *
     * @param {boolean} isPlugin
     *      Should be current module a plugin or not
     */
    ConfigManager.prototype.setPlugin = function(isPlugin)
    {
        this.checkModuleIsReady();

        if (typeof isPlugin != 'boolean') {
            Subclass.Error.create('InvalidModuleOption')
                .option('plugin')
                .module(this.getModule().getName())
                .received(isPlugin)
                .expected('a boolean value')
                .apply()
            ;
        }
        this._plugin = isPlugin;
    };

    /**
     * Reports whether the current module is a plug-in of another module or not
     *
     * @method getPlugin
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {boolean}
     */
    ConfigManager.prototype.getPlugin = function()
    {
        return this._plugin;
    };

    /**
     * @method isPlugin
     * @memberOf Subclass.ConfigManager.prototype
     * @alias Subclass.ConfigManager#getPlugin
     */
    ConfigManager.prototype.isPlugin = ConfigManager.prototype.getPlugin;

    /**
     * Marks current module that it should be a plug-in of the module with specified name.
     *
     * If was specified name of parent module then the module configuration parameter
     * "plugin" will forcibly set to true.
     *
     * @method setPluginOf
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if specified argument is not string or null
     *
     * @param {string} parentModuleName
     *      A name of the parent module
     */
    ConfigManager.prototype.setPluginOf = function(parentModuleName)
    {
        this.checkModuleIsReady();

        if (parentModuleName !== null && typeof parentModuleName != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('pluginOf')
                .module(this.getModule().getName())
                .received(parentModuleName)
                .expected('a string (name of another module that is not marked as a plugin)')
                .apply()
            ;
        }
        this._pluginOf = parentModuleName;
        this.setPlugin(true);
    };

    /**
     * Returns name of the parent module if current one is a plug-in of the specified module
     *
     * @method getPluginOf
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {(string|null)}
     */
    ConfigManager.prototype.getPluginOf = function()
    {
        return this._pluginOf;
    };

    /**
     * Sets root directory path of the project.
     * It's required if autoload configuration parameter is turned on.
     *
     * @method setRootPath
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not string argument value
     *
     * @param {string} rootPath
     *      A path to the project root directory
     *
     * @example
     *
     * ...
     * var moduleConfigs = moduleInst.getConfigManager();
     *     moduleConfigs.setRootPath("path/to/the/directory/root");
     * ...
     */
    ConfigManager.prototype.setRootPath = function(rootPath)
    {
        this.checkModuleIsReady();

        if (typeof rootPath != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('rootPath')
                .module(this.getModule().getName())
                .received(rootPath)
                .expected('a string')
                .apply()
            ;
        }
        this._rootPath = rootPath;
    };

    /**
     * Returns root directory path of the project
     *
     * @method getRootPath
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {(string|null)}
     */
    ConfigManager.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Sets and loads specified files.
     *
     * @method setFiles
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not array of strings argument value
     *
     * @param {string[]} files
     *      An array with file names which will be loaded before module
     *      will become ready. Each file name can be an absolute or relative.
     *      If file name specified with sign "^" at start it means that is an absolute path.
     *      Otherwise it is a path of file relative to "rootPath".
     *
     * @param {Function} callback
     *      The callback function which will invoked after
     *      the specified main file will loaded
     */
    ConfigManager.prototype.setFiles = function(files, callback)
    {
        this.checkModuleIsReady();

        if (!files || !Array.isArray(files)) {
            Subclass.Error.create(
                "Trying to set invalid files array in module configuration set. " +
                "It must contain the names of files."
            );
        }

        var module = this.getModule();
        var loadManager = module.getLoadManager();

        for (var i = 0; i < files.length; i++) {
            loadManager.loadFile(files[i]);
        }
    };

    /**
     * Reports whether current module loads some files
     *
     * @method hasFiles
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {boolean}
     */
    ConfigManager.prototype.hasFiles = function()
    {
        return !!this._files.length;
    };

    ///**
    // * Defines custom data types relying on existent property types
    // * registered in Subclass.Property.PropertyManager.
    // *
    // * You can also redefine definitions of standard data types,
    // * for example, if you want to set default value for all number properties or
    // * customize it to be not nullable etc.
    // *
    // * @method setDataTypes
    // * @memberOf Subclass.ConfigManager.prototype
    // *
    // * @throws {Error}
    // *      Throws error if trying to change value after the module became ready
    // *
    // * @param {Object.<Object>} propertyDefinitions
    // *      A plain object with property definitions. Each property
    // *      in turn also is a plain object. To learn more look at
    // *      {@link Subclass.Property.PropertyManager#createProperty}
    // *
    // * @example
    // * ...
    // *
    // * var moduleConfigs = moduleInst.getConfigManager();
    // *
    // * // Setting data types
    // * moduleConfigs.setDataTypes({
    // *     percents: {               // name of data type
    // *         type: "string",       // type of property
    // *         pattern: /^[0-9]+%$/, // RegExp instance object
    // *         value: "0%"           // default property value
    // *     },
    // *     ...
    // * });
    // * ...
    // *
    // * // Registering TestClass
    // * moduleInst.registerClass("Name/Of/TestClass", {
    // *     ...
    // *     $_properties: {
    // *         percentsProp: { type: "percents" }
    // *         ...
    // *     },
    // *     ...
    // * });
    // *
    // * // Creating TestClass instance
    // * var testClass = moduleInst.getClass("Name/Of/TestClass");
    // * var testClassInst = testClass.createInstance();
    // *
    // * // Trying to set percentsProp property value
    // * testClass.setPercentsProp("10%"); // normally set
    // * testClass.setPercentsProp("10");  // throws error
    // * ...
    // */
    //ConfigManager.prototype.setDataTypes = function(propertyDefinitions)
    //{
    //    this.checkModuleIsReady();
    //    this.getModule()
    //        .getPropertyManager()
    //        .defineDataTypes(propertyDefinitions)
    //    ;
    //};
    //
    ///**
    // * Returns defined custom data types in the form in which they were set
    // *
    // * @method getDataTypes
    // * @memberOf Subclass.ConfigManager.prototype
    // *
    // * @returns {Object.<Object>}
    // */
    //ConfigManager.prototype.getDataTypes = function()
    //{
    //    return this.getModule()
    //        .getPropertyManager()
    //        .getDataTypeManager()
    //        .getTypeDefinitions()
    //    ;
    //};
    //
    /**
     * Sets callback function which will be invoked before all registered user application
     * parts (i.e. classes) will be configured.
     *
     * It is a good opportunity to modify its configuration using plugins of application.
     *
     * @method setOnConfig
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param callback
     */
    ConfigManager.prototype.setOnConfig = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var eventManager = this.getModule().getEventManager();
        var onConfigEvent = eventManager.getEvent('onConfig');

        onConfigEvent.addListener(callback);
    };

    /**
     * Sets callback function which will be invoked after the all classes of the module
     * will be loaded (if configuration parameter "autoload" was set in true) and registered.<br><br>
     *
     * It is the same as "onReady" parameter in module configuration. If it was defined
     * in module configuration too the new callback function will be added to the onReady
     * callbacks storage and will be invoked after other callback functions
     * which were registered earlier.<br><br>
     *
     * If there were no classes registered in module at the moment and onReady callback
     * function was not set earlier, the call of current method invokes specified callback immediately.
     *
     * @method setOnReady
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param {Function} callback
     *      Callback function which will do some initializing manipulations
     */
    ConfigManager.prototype.setOnReady = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var module = this.getModule();
        var classManager = module.getClassManager();
        var eventManager = module.getEventManager();
        var onReadyEvent = eventManager.getEvent('onReady');
        var triggerable = true;

        // If onReady callback was registered earlier just add new listener

        if (onReadyEvent.hasListeners()) {
            triggerable = false;
        }

        onReadyEvent.addListener(callback);

        // Triggers onReady event if allows to trigger current event
        // and where registered any classes
        // and there are no classes that are in loading process

        if (
            triggerable
            && module.isPrepared()
            && !classManager.isEmpty()
            && !classManager.isLoading()
        ) {
            //module.setReady();
            eventManager.getEvent('onLoadingEnd').trigger();
        }
    };

    /**
     * Ensures that the module is not ready
     *
     * @method checkModuleIsReady
     * @private
     * @ignore
     */
    ConfigManager.prototype.checkModuleIsReady = function()
    {
        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change configs in ready module.');
        }
    };

    return ConfigManager;
})();