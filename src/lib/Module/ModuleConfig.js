/**
 * @class
 */
Subclass.Module.ModuleConfig = (function()
{
    function ModuleConfig(module, moduleConfigs)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

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
         * Callback which will be called when all application classes are already loaded
         *
         * @type {(Function|null)}
         * @private
         */
        this._readyCallback = null;
    }

    ModuleConfig.prototype.initialize = function(moduleConfigs)
    {
        // Performing configs

        if (moduleConfigs && !Subclass.Tools.isPlainObject(moduleConfigs)) {
            throw new Error('Specified invalid configs. It must be an object.');
        }
        if (moduleConfigs) {
            for (var configName in moduleConfigs) {
                if (
                    !moduleConfigs.hasOwnProperty(configName)
                    || configName == 'parameters'
                    || configName == 'services'
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
            if (moduleConfigs.hasOwnProperty('parameters')) {
                this.setParameters(moduleConfigs.parameters);
            }
            if (moduleConfigs.hasOwnProperty('services')) {
                this.setServices(moduleConfigs.services);
            }
        }
    };

    /**
     * Returns module instance
     *
     * @returns {Subclass.Module.Module}
     */
    ModuleConfig.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets autoload option
     *
     * @param autoload
     */
    ModuleConfig.prototype.setAutoload = function(autoload)
    {
        if (typeof autoload != 'boolean') {
            throw new Error('Specified not valid "autoload" option. It must be boolean.');
        }
        this._autoload = autoload;
    };

    /**
     * Alias of method "getAutoload"
     * @type {Function}
     */
    ModuleConfig.prototype.getAutoload = function()
    {
        return this._autoload;
    };

    /**
     * Checks whether class autoload enabled or not
     *
     * @returns {boolean}
     */
    ModuleConfig.prototype.isAutoloadEnabled = ModuleConfig.prototype.getAutoload;

    /**
     * Sets root path of the project which is needed for auto load classes functionality.
     *
     * @param {string} rootPath
     */
    ModuleConfig.prototype.setRootPath = function(rootPath)
    {
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
    ModuleConfig.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Defines custom property types
     *
     * @param {Object.<Object>} propertyDefinitions
     */
    ModuleConfig.prototype.setDataTypes = function(propertyDefinitions)
    {
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
    ModuleConfig.prototype.getDataTypes = function()
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
    ModuleConfig.prototype.setParameters = function(parameters)
    {
        var serviceManager = this.getModule().getServiceManager();

        for (var paramName in parameters) {
            if (!parameters.hasOwnProperty(paramName)) {
                continue;
            }
            serviceManager.registerParameter(paramName, parameters[paramName]);
        }
    };

    /**
     * Register services
     *
     * @param {Object.<Object>} services
     */
    ModuleConfig.prototype.setServices = function(services)
    {
        var serviceManager = this.getModule().getServiceManager();

        for (var serviceName in services) {
            if (!services.hasOwnProperty(serviceName)) {
                continue;
            }
            serviceManager.registerService(serviceName, services[serviceName]);
        }
    };

    /**
     * Sets callback when all classes was defined and loaded
     *
     * @param {(Function|null)} callback
     */
    ModuleConfig.prototype.setOnReady = function(callback)
    {
        if ((!callback && callback !== null) || typeof callback != "function") {
            throw new Error('On ready callback must be function or null.');
        }
        var module = this.getModule();
        var classManager = module.getClassManager();

        this._readyCallback = callback;

        if (!classManager.isEmpty() && !classManager.isLoading()) {
            module.callReadyCallback();
        }
    };

    ModuleConfig.prototype.getOnReady = function()
    {
        return this._readyCallback;
    };

    return ModuleConfig;

})();