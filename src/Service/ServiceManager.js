/**
 * @namespace
 */
Subclass.Service = {};

/**
 * @namespace
 */
Subclass.Service.Error = {};

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
     * Initializing service manager
     *
     * @method initialize
     * @memberOf Subclass.Service.ServiceManager.prototype
     */
    ServiceManager.prototype.initialize = function()
    {
        var eventManager = this.getModule().getEventManager();
        var $this = this;

        eventManager.getEvent('onReadyBefore').addListener(function() {
            if ($this.getModule().isRoot()) {
                $this.normalizeServices();
            }
        });
        eventManager.getEvent('onAddPlugin').addListener(function(pluginModule) {
            $this.normalizeServices();
        });
    };

    /**
     * Returns module instance
     *
     * @method getModule
     * @memberOf Subclass.Service.ServiceManager.prototype
     * @returns {Subclass.Module.Module}
     */
    ServiceManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns service factory instance
     *
     * @method getModule
     * @memberOf Subclass.Service.ServiceManager.prototype
     * @returns {Subclass.Service.ServiceFactory}
     */
    ServiceManager.prototype.getServiceFactory = function()
    {
        return this._serviceFactory;
    };

    /**
     * Normalizes services.<br /><br />
     *
     * Converts the service definitions to the single format.
     * It's actual in cases when in definition of the service was
     * specified the "extends" option that links to another service.<br /><br />
     *
     * The lacking options in services that extends another service
     * will be added from the parent service
     *
     * @example
     * var moduleConfis = {
     *      services: {
     *
     *          // Extending from another service
     *
     *          error: {
     *              className: "Name/Of/BaseErrorClass",
     *              arguments: ["%mode%"],
     *              tags: ["errorManager"]
     *          },
     *          invalidArgumentError: {
     *              extends: "error"
     *          },
     *
     *          ...
     *
     *          // Extending from abstract service
     *
     *          bugAbstract: {
     *              abstract: true,
     *              arguments: ["%mode%"],
     *              tags: ["logger"]
     *          },
     *          bug1: {
     *              extends: "bugAbstract",
     *              className: "Name/Of/BugClass1"
     *          },
     *          bug2: {
     *              extends: "bugAbstract",
     *              className: "Name/Of/BugClass2"
     *          },
     *          ...
     *      }
     * }
     *
     */
    ServiceManager.prototype.normalizeServices = function()
    {
        var serviceDefinitions = this.getServices();

        for (var serviceName in serviceDefinitions) {
            if (!serviceDefinitions.hasOwnProperty(serviceName)) {
                continue;
            }
            var parentServiceName = serviceDefinitions[serviceName].getExtends();
            var definition = serviceDefinitions[serviceName].getDefinition();

            if (parentServiceName) {
                var parentServiceDefinition = this.getServiceDefinition(parentServiceName);
                var parentDefinition = Subclass.Tools.copy(parentServiceDefinition.getDefinition());

                if (!definition.abstract) {
                    definition.abstract = false;
                }

                definition = Subclass.Tools.extend(parentDefinition, definition);
                serviceDefinitions[serviceName].setDefinition(definition);
            }
        }
    };

    /**
     * Returns all registered services
     *
     * @param {boolean} [privateServices = false]
     *      If passed true it returns services only from current module
     *      without services from its plug-ins.
     *
     * @returns {Object.<Subclass.Service.Service>}
     */
    ServiceManager.prototype.getServices = function(privateServices)
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var serviceDefinitions = {};
        var $this = this;

        if (privateServices !== true) {
            privateServices = false;
        }
        if (privateServices) {
            return this._services;
        }

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(serviceDefinitions, $this._services);
                return;
            }
            var moduleServiceManager = module.getServiceManager();
            var moduleServices = moduleServiceManager.getServices();

            Subclass.Tools.extend(serviceDefinitions, moduleServices);
        });

        return serviceDefinitions;
    };

    /**
     * Returns all services tagged by passed tag
     *
     * @param {string} tag
     * @returns {Object[]}
     */
    ServiceManager.prototype.getServicesByTag = function(tag)
    {
        var serviceDefinitions = this.getServices();
        var taggedServices = [];

        for (var serviceName in serviceDefinitions) {
            if (!serviceDefinitions.hasOwnProperty(serviceName)) {
                continue;
            }
            var taggedService = serviceDefinitions[serviceName];
            var tags = taggedService.getTags();

            if (tags.indexOf(tag) >= 0 && !taggedService.getAbstract()) {
                taggedServices.push(taggedService);
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
        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t define new services when module is ready.');
        }
        var service = new Subclass.Service.Service(this, serviceName, serviceDefinition);
        this._services[serviceName] = service;

        var classManager = this.getModule().getClassManager();

        if (serviceDefinition.className) {
            classManager.addToLoadStack(serviceDefinition.className);
        }

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
            Subclass.Error.create('Service with name "' + serviceName + '" is not exists.');
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
            Subclass.Error.create('Service with name "' + serviceName + '" is not exists.');
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