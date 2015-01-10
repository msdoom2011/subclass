/**
 * @class
 * @constructor
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
     *      Throws error when:<br />
     *      - if module is ready;<br />
     *      - specified argument is not a plain object;<br />
     *      - in configuration object specified non agreed parameter.
     *
     * @param {Object} moduleConfigs
     *      Object with module configuration parameters
     *
     * @example
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
     * ...
     *
     * moduleInst.getConfigManager().setConfigs({ // or easily use moduleInst.setConfigs({...});
     *     autoload: true,                        // will replace old value
     *     rootPath: "path/to/project/root/dir",  // adds new parameter
     *     parameters: {
     *         mode: "prod",                      // replaces old value
     *         name: "some name"                  // adds new parameter to "parameters"
     *     }
     * });
     */
    ModuleConfigs.prototype.setConfigs = function (moduleConfigs)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        if (moduleConfigs && !Subclass.Tools.isPlainObject(moduleConfigs)) {
            throw new Error('Specified invalid configs. It must be an object.');
        }
        if (moduleConfigs) {
            for (var configName in moduleConfigs) {
                if (
                    !moduleConfigs.hasOwnProperty(configName)
                    || ['parameters', 'services', 'plugin', 'pluginOf', 'onReady'].indexOf(configName) >= 0
                ) {
                    continue;
                }
                var setterName = "set" + configName[0].toUpperCase() + configName.substr(1);

                if (!this[setterName]) {
                    throw new Error(
                        'Configuration parameter "' + configName + '" is not allowed ' +
                        'by the module configuration system.'
                    );
                }
                this[setterName](moduleConfigs[configName]);
            }
            if (moduleConfigs.hasOwnProperty('plugin')) {
                this.setPlugin(moduleConfigs.plugin);
            }
            if (moduleConfigs.hasOwnProperty('pluginOf')) {
                this.setPluginOf(moduleConfigs.pluginOf);
            }
            if (moduleConfigs.hasOwnProperty('parameters')) {
                this.setParameters(moduleConfigs.parameters);
            }
            if (moduleConfigs.hasOwnProperty('services')) {
                this.setServices(moduleConfigs.services);
            }
            if (moduleConfigs.hasOwnProperty('onReady')) {
                this.setOnReady(moduleConfigs.onReady);
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
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        if (typeof isPlugin != 'boolean') {
            throw new Error('Invalid value of "plugin" parameter. It must be a boolean value.');
        }
        if (isPlugin === true) {
            this._autoload = false;
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
        if (parentModuleName !== null && typeof parentModuleName != 'string') {
            throw new Error(
                'Invalid module config parameter "pluginOf". ' +
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
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
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
     * @param {string} rootPath
     *      A path to the project root directory
     */
    ModuleConfigs.prototype.setRootPath = function(rootPath)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        if (!rootPath || typeof rootPath != 'string') {
            throw new Error('Trying to set invalid root path of the project. It must be a string.');
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
     * Defines custom data types relying on existent property types.
     *
     * @method setDataTypes
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @param {Object.<Object>} propertyDefinitions
     */
    ModuleConfigs.prototype.setDataTypes = function(propertyDefinitions)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        this.getModule()
            .getPropertyManager()
            .defineCustomDataTypes(propertyDefinitions)
        ;
    };

    /**
     * Returns defined custom data types
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
     * Register parameters
     *
     * @method setParameters
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @param {Object} parameters
     */
    ModuleConfigs.prototype.setParameters = function(parameters)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
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
     * Returns all registered parameters
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
     * Register services
     *
     * @method setServices
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @param {Object.<Object>} services
     */
    ModuleConfigs.prototype.setServices = function(services)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
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
     * Returns all registered services
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
     * Sets callback when all classes was defined and loaded
     *
     * @method setOnReady
     * @memberOf Subclass.Module.ModuleConfigs.prototype
     * @param {(Function|null)} callback
     */
    ModuleConfigs.prototype.setOnReady = function(callback)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change configs in ready module.');
        }
        if ((!callback && callback !== null) || typeof callback != "function") {
            throw new Error('On ready callback must be function or null.');
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

    return ModuleConfigs;

})();