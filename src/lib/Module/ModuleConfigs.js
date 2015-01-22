/**
 * @class
 * @constructor
 * @description
 *
 * The class which holds and manages module configuration.
 * It can validate, set and get configuration parameters.<br><br>
 *
 * To see the list of available configuration parameters
 * look at description of {@link Subclass.Module.Module}
 * class constructor parameters.
 *
 * @param {Subclass.Module.Module} module
 *      The module instance
 */
Subclass.Module.ModuleConfigs = (function()
{
    /**
     * @alias Subclass.Module.ModuleConfigs
     */
    function ModuleConfigs(module)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module.Module}
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
         * Checks whether autoload classes enabled
         *
         * @type {boolean}
         * @private
         */
        this._autoload = true;

        /**
         * Root path of the project
         *
         * @type {(string|null)}
         * @private
         */
        this._rootPath = null;

        /**
         *
         * @type {boolean}
         * @private
         */
        this._onReadyCall = true;
    }

    /**
     * Sets new module configs.
     *
     * New configuration parameters will rewrite earlier ones, for example,
     * specified in module constructor or in earlier call of ModuleConfigs#setConfigs method.
     *
     * @method setConfigs
     * @memberOf Subclass.Module.ModuleConfigs.prototype
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
     * var moduleInst = new Subclass.createModule('myApp', {
     *     autoload: false,
     *     parameters: {
     *         mode: "dev"
     *     },
     *     services: {
     *         myService: {
     *             className: "Path/To/MyService",
     *             arguments: ["%mode%"]
     *         }
     *     }
     * });
     *
     * ...
     * var moduleConfigs = moduleInst.getConfigManager();
     * var parameterManager = moduleInst.getParameterManager();
     *
     * moduleConfigs.setConfigs({ // or easily use moduleInst.setConfigs({...});
     *     autoload: true,                        // will replace old value
     *     rootPath: "path/to/project/root/dir",  // adds new parameter
     *     parameters: {
     *         mode: "prod",                      // replaces old value
     *         name: "some name"                  // adds new parameter to "parameters"
     *     }
     * });
     *
     * moduleConfigs.isAutoload();                // Returns true
     * moduleConfigs.getRootPath();               // Return "path/to/project/root/dir"
     * parameterManager.issetParameter('name');   // Returns true
     * ...
     */
    ModuleConfigs.prototype.setConfigs = function (moduleConfigs)
    {
        var $this = this;

        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        if (moduleConfigs && !Subclass.Tools.isPlainObject(moduleConfigs)) {
            Subclass.Exception.InvalidArgument(
                "moduleConfigs",
                moduleConfigs,
                "a plain object"
            );
        }
        if (moduleConfigs) {
            for (var configName in moduleConfigs) {
                if (
                    !moduleConfigs.hasOwnProperty(configName)
                    || [
                        'parameters',
                        'services',
                        'pluginOf',
                        'files',
                        'onReady'
                    ].indexOf(configName) >= 0
                ) {
                    continue;
                }
                var setterName = "set" + configName[0].toUpperCase() + configName.substr(1);

                if (!this[setterName]) {
                    throw new Error(
                        'Configuration parameter "' + configName + '" is not allowed ' +
                        'by the module.'
                    );
                }
                this[setterName](moduleConfigs[configName]);
            }
            if (moduleConfigs.hasOwnProperty('pluginOf')) {
                this.setPluginOf(moduleConfigs.pluginOf);
            }

            function setRestConfigs() {
                if (moduleConfigs.hasOwnProperty('parameters')) {
                    $this.setParameters(moduleConfigs.parameters);
                }
                if (moduleConfigs.hasOwnProperty('services')) {
                    $this.setServices(moduleConfigs.services);
                }
                if (moduleConfigs.hasOwnProperty('onReady')) {
                    $this.setOnReady(moduleConfigs.onReady);
                }
            }

            if (moduleConfigs.hasOwnProperty('files')) {
                this.setFiles(moduleConfigs.files, setRestConfigs);

            } else {
                setRestConfigs();
            }
        }
    };

    /**
     * Returns module instance to which current configuration manager belongs
     *
     * @method getModule
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {Subclass.Module.Module}
     */
    ModuleConfigs.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets a specific state would be current module a plug-in or not.
     *
     * If module is marked as a plug-in then the configuration parameter "autoload"
     * will forcibly set to false and modules registered onReady callback functions
     * will be invoked only when the root module becomes ready.
     *
     * @method setPlugin
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - was specified not boolean value
     *
     * @param {boolean} isPlugin
     *      Should be current module a plugin or not
     */
    ModuleConfigs.prototype.setPlugin = function(isPlugin)
    {
        this._checkModuleIsReady();

        if (typeof isPlugin != 'boolean') {
            throw new Error('Invalid value of "plugin" option. It must be a boolean value.');
        }
        this._plugin = isPlugin;
    };

    /**
     * Reports whether the current module is a plug-in of another module or not
     *
     * @method getPlugin
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {boolean}
     */
    ModuleConfigs.prototype.getPlugin = function()
    {
        return this._plugin;
    };

    /**
     * @method isPlugin
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @alias Subclass.Module.ModuleConfigs#getPlugin
     */
    ModuleConfigs.prototype.isPlugin = ModuleConfigs.prototype.getPlugin;

    /**
     * Marks current module that it should be a plug-in of the module with specified name.
     *
     * If was specified name of parent module then the module configuration parameter
     * "plugin" will forcibly set to true.
     *
     * @method setPluginOf
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if specified argument is not string or null
     *
     * @param {string} parentModuleName
     *      A name of the parent module
     */
    ModuleConfigs.prototype.setPluginOf = function(parentModuleName)
    {
        this._checkModuleIsReady();

        if (parentModuleName !== null && typeof parentModuleName != 'string') {
            throw new Error(
                'Invalid module config option "pluginOf". ' +
                'It must be a string (name of another module).'
            );
        }
        this._pluginOf = parentModuleName;
        this.setPlugin(true);
    };

    /**
     * Returns name of the parent module if current one is a plug-in of the specified module
     *
     * @method getPluginOf
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {(string|null)}
     */
    ModuleConfigs.prototype.getPluginOf = function()
    {
        return this._pluginOf;
    };

    /**
     * Sets autoload config parameter which tells whether will be used class autoloading
     *
     * @method setAutoload
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not boolean argument value
     *
     * @param {boolean} autoload
     *      Should be used class autoload or not
     */
    ModuleConfigs.prototype.setAutoload = function(autoload)
    {
        this._checkModuleIsReady();

        if (typeof autoload != 'boolean') {
            throw new Error('Specified not valid "autoload" option. It must be boolean.');
        }
        this._autoload = autoload;
    };

    /**
     * Reports whether class autoload function is turned on
     *
     * @method getAutoload
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {boolean}
     */
    ModuleConfigs.prototype.getAutoload = function()
    {
        return this._autoload;
    };

    /**
     * Alias of method {@link Subclass.Module.ModuleConfigs#getAutoload}
     *
     * @method isAutoloadEnabled
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @alias Subclass.Module.ModuleConfigs#getAutoload
     */
    ModuleConfigs.prototype.isAutoloadEnabled = ModuleConfigs.prototype.getAutoload;

    /**
     * Sets root directory path of the project.
     * It's required if autoload configuration parameter is turned on.
     *
     * @method setRootPath
     * @memberOf Subclass.Module.ModuleConfigs.prototype
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
    ModuleConfigs.prototype.setRootPath = function(rootPath)
    {
        this._checkModuleIsReady();

        if (typeof rootPath != 'string') {
            throw new Error(
                'Trying to set invalid root path of the project. ' +
                'It must be a string.'
            );
        }
        this._rootPath = rootPath;
    };

    /**
     * Returns root directory path of the project
     *
     * @method getRootPath
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {(string|null)}
     */
    ModuleConfigs.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Sets and loads specified files.
     *
     * @method setFiles
     * @memberOf Subclass.Module.ModuleConfigs.prototype
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
     *
     */
    ModuleConfigs.prototype.setFiles = function(files, callback)
    {
        this._checkModuleIsReady();

        function throwInvalidArgument() {
            throw new Error(
                "Trying to set invalid files array in module configuration set. " +
                "It must contain the names of files."
            );
        }

        if (!files || !Array.isArray(files)) {
            throwInvalidArgument();
        }
        if (Subclass.Tools.isEmpty(files)) {
            callback();
        }
        for (var i = 0; i < files.length; i++) {
            if (typeof files[i] != 'string') {
                throwInvalidArgument();
            }
            if (!files[i].match(/^\^/i)) {
                files[i] = this.getRootPath() + files[i];

            } else {
                files[i] = files[i].substr(1);
            }
        }

        var classManager = this.getModule().getClassManager();

        if (this.isAutoloadEnabled()) {
            classManager.pauseLoading();

            Subclass.Tools.loadJS(files.shift(), function loadCallback() {
                classManager.pauseLoading();

                if (Subclass.Tools.isEmpty(files)) {
                    classManager.startLoading();
                    classManager.completeLoading();
                    return callback();

                } else {
                    return Subclass.Tools.loadJS(
                        files.shift(),
                        loadCallback
                    );
                }
            });
        }
    };

    /**
     * Defines custom data types relying on existent property types
     * registered in Subclass.Property.PropertyManager.
     *
     * @method setDataTypes
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if trying to change value after the module became ready
     *
     * @param {Object.<Object>} propertyDefinitions
     *      A plain object with property definitions. Each property
     *      in turn also is a plain object. To learn more look at
     *      {@link Subclass.Property.PropertyManager#createProperty}
     *
     * @example
     * ...
     *
     * var moduleConfigs = moduleInst.getConfigManager();
     *
     * // Setting data types
     * moduleConfigs.setDataTypes({
     *     percents: {               // name of data type
     *         type: "string",       // type of property
     *         pattern: /^[0-9]+%$/, // RegExp instance object
     *         value: "0%"           // default property value
     *     },
     *     ...
     * });
     * ...
     *
     * // Registering TestClass
     * moduleInst.registerClass("Name/Of/TestClass", {
     *     ...
     *     $_properties: {
     *         percentsProp: { type: "percents" }
     *         ...
     *     },
     *     ...
     * });
     *
     * // Creating TestClass instance
     * var testClass = moduleInst.getClass("Name/Of/TestClass");
     * var testClassInst = testClass.createInstance();
     *
     * // Trying to set percentsProp property value
     * testClass.setPercentsProp("10%"); // normal set
     * testClass.setPercentsProp("10");  // throws error
     * ...
     */
    ModuleConfigs.prototype.setDataTypes = function(propertyDefinitions)
    {
        this._checkModuleIsReady();
        this.getModule()
            .getPropertyManager()
            .defineCustomDataTypes(propertyDefinitions)
        ;
    };

    /**
     * Returns defined custom data types in the form in which they were set
     *
     * @method getDataTypes
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {Object.<Object>}
     */
    ModuleConfigs.prototype.getDataTypes = function()
    {
        return this.getModule()
            .getPropertyManager()
            .getCustomTypesManager()
            .getTypeDefinitions()
        ;
    };

    /**
     * Registers new parameters or redefines already existent with the same name.
     *
     * @method setParameters
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if trying to change value after the module became ready
     *
     * @param {Object} parameters
     *      A plain object with properties which hold
     *      properties whatever you need
     *
     * @example
     * ...
     *
     * var moduleConfigs = moduleInst.getConfigManager();
     *
     * // setting new parameters
     * moduleConfigs.setParameters({
     *      param1: "string value",
     *      param2: 1000,
     *      param3: { a: 10, b: "str" },
     *      ...
     * });
     * ...
     *
     * moduleInst.getParameter("param1"); // returns "string value"
     * moduleInst.getParameter("param2"); // returns 1000
     * moduleInst.getParameter("param3"); // returns { a: 10, b: "str" }
     * ...
     */
    ModuleConfigs.prototype.setParameters = function(parameters)
    {
        this._checkModuleIsReady();

        if (!parameters || !Subclass.Tools.isPlainObject(parameters)) {
            throw new Error(
                'Specified invalid parameters set. ' +
                'It must be a plain object.'
            );
        }
        var parameterManager = this.getModule().getParameterManager();

        for (var paramName in parameters) {
            if (!parameters.hasOwnProperty(paramName)) {
                continue;
            }
            parameterManager.registerParameter(
                paramName,
                parameters[paramName]
            );
        }
    };

    /**
     * Returns all registered parameters in the form in which they were set
     *
     * @method getParameters
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {Object}
     */
    ModuleConfigs.prototype.getParameters = function()
    {
        var parameters = this.getModule().getParameterManager().getParameters();
        var parameterDefinitions = {};

        for (var i = 0; i < parameters.length; i++) {
            var parameterValue = parameters[i].getValue();
            var parameterName = parameters[i].getName();

            parameterDefinitions[parameterName] = Subclass.Tools.copy(parameterValue);
        }
        return parameterDefinitions;
    };

    /**
     * Registers new services and redefines already existent ones with the same name.
     *
     * @method setServices
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if trying to change value after the module became ready
     *
     * @param {Object.<Object>} services
     *      A plain object which consists of pairs key/value. The keys
     *      are the service names and values are the service definitions.
     *      To see more info about service definition look at
     *      {@link Subclass.Service.Service} class constructor
     *
     * @example
     *
     * var moduleInst = Subclass.createModule("app", {
     *      parameters: {
     *          mode: "dev"
     *      },
     *      ...
     * });
     * ...
     *
     * var moduleConfigs = moduleInst.getConfigManager();
     *
     * // Registering services
     * moduleConfigs.setServices({
     *      logger: {
     *          className: "Name/Of/LoggerService", // name of service class
     *          arguments: [ "%mode%" ],            // arguments for service class constructor
     *          calls: {                            // methods that will be called right away after service was created
     *              setParams: [                    // method name
     *                  "param 1 value",            // method argument 1
     *                  "param 2 value"             // method argument 2
     *              ],
     *          }
     *      }
     * });
     * ...
     *
     * // Creating service class
     * moduleInst.registerClass("Name/Of/LoggerService", {
     *      _mode: null,
     *      _param1: null,
     *      _param2: null,
     *
     *      $_constructor: function(mode)
     *      {
     *          this._mode = mode;
     *      },
     *
     *      setParams: function(param1, param2)
     *      {
     *          this._param1 = param1;
     *          this._param2 = param2;
     *      }
     * });
     * ...
     *
     * var logger = moduleInst.getService('logger');
     *
     * var mode = logger._mode;     // "dev"
     * var param1 = logger._param1; // "param 1 value"
     * var param2 = logger._param2; // "param 2 value"
     * ...
     */
    ModuleConfigs.prototype.setServices = function(services)
    {
        this._checkModuleIsReady();

        if (!services || !Subclass.Tools.isPlainObject(services)) {
            throw new Error(
                'Invalid definition of services set. ' +
                'It must be a plain object.'
            );
        }
        var serviceManager = this.getModule().getServiceManager();

        for (var serviceName in services) {
            if (!services.hasOwnProperty(serviceName)) {
                continue;
            }
            serviceManager.registerService(
                serviceName,
                services[serviceName]
            );
        }
    };

    /**
     * Returns all registered services in the form as they were defined
     *
     * @method getServices
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {Object.<Object>}
     */
    ModuleConfigs.prototype.getServices = function()
    {
        var services = this.getModule().getServiceManager().getServices();
        var serviceDefinitions = {};

        for (var i = 0; i < services.length; i++) {
            var serviceDefinition = services[i].getDefinition();
            var serviceName = services[i].getName();

            serviceDefinitions[serviceName] = Subclass.Tools.copy(serviceDefinition);
        }
        return serviceDefinitions;
    };

    /**
     * Sets callback function which will invoked when all classes of the module
     * will be loaded (if configuration parameter "autoload" was set in true) and registered.<br><br>
     *
     * It is the same as "onReady" parameter in module configuration. If it was defined
     * in module configuration too the new callback function will be added to the onReady
     * callbacks storage and will be invoked after other callback functions
     * which were registered earlier.<br><br>
     *
     * If "autoload" configuration parameter was set in false and there were no classes
     * registered in module at the moment and onReady callback function was not set earlier,
     * the call of current method invokes specified callback immediately.
     *
     * @method setOnReady
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param {Function} callback
     *      Callback function which will do some initializing manipulations
     */
    ModuleConfigs.prototype.setOnReady = function(callback)
    {
        this._checkModuleIsReady();

        if (typeof callback != "function") {
            throw new Error('On ready callback must be function.');
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
            && !module.isReady()
            && !classManager.isEmpty()
            && !classManager.isLoading()
        ) {
            module.setReady();
        }
    };

    /**
     * Defines whether the module on ready callback
     * will be invoked automatically when module will ready.
     *
     * @method setOnReadyCall
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not boolean argument value
     *
     * @param {boolean} onReadyCall
     *      Whether onReady callbacks will automatically invoked
     */
    ModuleConfigs.prototype.setOnReadyCall = function(onReadyCall)
    {
        this._checkModuleIsReady();

        if (typeof onReadyCall != 'boolean') {
            Subclass.Exception.InvalidArgument(
                "onReadyCall",
                onReadyCall,
                "a boolean"
            );
        }
        this._onReadyCall = onReadyCall;
    };

    /**
     * Reports whether the module on ready callback
     * will be invoked automatically when module will ready
     *
     * @method getOnReadyCall
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @returns {boolean}
     */
    ModuleConfigs.prototype.getOnReadyCall = function()
    {
        return this._onReadyCall;
    };

    /**
     * The same as the method {@link Subclass.Module.ModuleConfigs#getOnReadyCall}
     *
     * @alias Subclass.Module.ModuleConfigs#getOnReadyCall
     * @method isOnReadyAutoCall
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     */
    ModuleConfigs.prototype.isOnReadyAutoCall = ModuleConfigs.prototype.getOnReadyCall;

    /**
     * Ensures that the module is not ready
     *
     * @method _checkModuleIsReady
     * @private
     */
    ModuleConfigs.prototype._checkModuleIsReady = function()
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
    };

    return ModuleConfigs;

})();