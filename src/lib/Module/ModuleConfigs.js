/**
 * @class
 */
Subclass.Module.ModuleConfigs = (function()
{
    function ModuleConfigs(module)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

        /**
         * Indicates is the current module a plugin
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
                    || configName == 'parameters'
                    || configName == 'services'
                    || configName == 'plugin'
                    || configName == 'pluginOf'
                    || configName == 'onReady'
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
     * Returns module instance
     *
     * @returns {Subclass.Module.Module}
     */
    ModuleConfigs.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets plugin state
     *
     * @param {boolean} isPlugin
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
     * Returns is plugin state
     *
     * @returns {boolean}
     */
    ModuleConfigs.prototype.getPlugin = ModuleConfigs.prototype.isPlugin = function()
    {
        return this._plugin;
    };

    /**
     * Sets "pluginOf" option
     *
     * @param parentModuleName
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
     * Returns "pluginOf" option value
     * @returns {string|null}
     */
    ModuleConfigs.prototype.getPluginOf = function()
    {
        return this._pluginOf;
    };

    /**
     * Sets "autoload" option
     *
     * @param {boolean} autoload
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
     * Returns "autoload" option value
     *
     * @returns {boolean}
     */
    ModuleConfigs.prototype.getAutoload = function()
    {
        return this._autoload;
    };

    /**
     * Checks whether class autoload enabled or not
     *
     * @returns {boolean}
     */
    ModuleConfigs.prototype.isAutoloadEnabled = ModuleConfigs.prototype.getAutoload;

    /**
     * Sets root path of the project which is needed for auto load classes functionality.
     *
     * @param {string} rootPath
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
     * Returns root path of the project
     *
     * @returns {string|*}
     */
    ModuleConfigs.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Defines custom property types
     *
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

        eventManager.getEvent('onReady').addListener(callback);

        if (!classManager.isEmpty() && !classManager.isLoading()) {
            module.triggerOnReady();
        }
    };

    return ModuleConfigs;

})();