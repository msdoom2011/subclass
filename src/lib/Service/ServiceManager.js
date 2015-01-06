/**
 * @namespace
 */
Subclass.Service = {};

/**
 * @class
 */
Subclass.Service.ServiceManager = (function()
{
    /**
     * @param {Subclass.Module.Module} module
     * @constructor
     */
    function ServiceManager(module)
    {
        /**
         * Instance of module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * Instance of service factory
         *
         * @type {Subclass.Service.ServiceFactory}
         * @private
         */
        this._serviceFactory = new Subclass.Service.ServiceFactory(this);

        /**
         * List of properties
         *
         * @type {Object}
         * @private
         */
        this._parameters = {};

        /**
         * List of services
         *
         * @type {Object.<Subclass.Service.Service>}
         * @private
         */
        this._services = {};
    }

    /**
     * Returns module instance
     *
     * @returns {Subclass.Module.Module}
     */
    ServiceManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns service factory instance
     *
     * @returns {Subclass.Service.ServiceFactory}
     */
    ServiceManager.prototype.getServiceFactory = function()
    {
        return this._serviceFactory;
    };

    /**
     * Returns all registered services
     *
     * @param {boolean} [privateServices = false]
     *      If passed true it returns services only from current module
     *      without services from its dependencies.
     *
     * @returns {Object.<Subclass.Service.Service>}
     */
    ServiceManager.prototype.getServices = function(privateServices)
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var services = {};
        var $this = this;

        if (privateServices !== true) {
            privateServices = false;
        }
        if (privateServices) {
            return this._services;
        }

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(services, $this._services);
                return;
            }
            var moduleServiceManager = module.getServiceManager();
            var moduleServices = moduleServiceManager.getServices();

            Subclass.Tools.extend(services, moduleServices);
        });

        return services;
    };

    /**
     * Returns all services tagged by passed tag
     *
     * @param {string} tag
     * @returns {Object[]}
     */
    ServiceManager.prototype.getServicesByTag = function(tag)
    {
        var services = this.getServices();
        var taggedServices = [];

        for (var serviceName in services) {
            if (!services.hasOwnProperty(serviceName)) {
                continue;
            }
            var tags = services[serviceName].getTags();

            if (tags.indexOf(tag) >= 0) {
                taggedServices.push(this.getService(serviceName));
            }
        }

        return taggedServices;
    };

    /**
     * Registers new service
     *
     * @param {string} serviceName
     * @param {Object} serviceDefinition
     */
    ServiceManager.prototype.registerService = function(serviceName, serviceDefinition)
    {
        var service = new Subclass.Service.Service(this, serviceName, serviceDefinition);
        this._services[serviceName] = service;

        var classManager = this.getModule().getClassManager();
            classManager.addToLoadStack(serviceDefinition.className);

        return service;
    };

    /**
     * Returns service class instance
     *
     * @param {string} serviceName
     * @returns {Object}
     */
    ServiceManager.prototype.getService = function(serviceName)
    {
        if (!this.issetService(serviceName)) {
            throw new Error('Service with name "' + serviceName + '" is not exists.');
        }
        return this.getServiceFactory().getService(this.getServices()[serviceName]);
    };

    /**
     * Returns service instance
     *
     * @param {string} serviceName
     * @returns {Subclass.Service.Service}
     */
    ServiceManager.prototype.getServiceDefinition = function(serviceName)
    {
        if (!this.issetService(serviceName)) {
            throw new Error('Service with name "' + serviceName + '" is not exists.');
        }
        return this.getServices()[serviceName];
    };

    /**
     * Checks whether service with specified name was ever registered
     *
     * @param {boolean} [privateServices]
     * @param {string} serviceName
     * @returns {boolean}
     */
    ServiceManager.prototype.issetService = function(serviceName, privateServices)
    {
        return !!this.getServices(privateServices)[serviceName];
    };

    return ServiceManager;

})();