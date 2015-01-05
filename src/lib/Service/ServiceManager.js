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
     * @param {ClassManager} classManager
     * @constructor
     */
    function ServiceManager(classManager)
    {
        /**
         * Instance of class manager
         *
         * @type {ClassManager}
         * @private
         */
        this._classManager = classManager;

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
     * Returns class manager instance
     *
     * @returns {ClassManager}
     */
    ServiceManager.prototype.getClassManager = function()
    {
        return this._classManager;
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
     * @returns {Object.<Subclass.Service.Service>}
     */
    ServiceManager.prototype.getServices = function()
    {
        return this._services;
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
        return this.getServiceFactory().getService(this._services[serviceName]);
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
        return this._services[serviceName];
    };

    /**
     * Checks whether service with specified name was ever registered
     *
     * @param {string} serviceName
     * @returns {boolean}
     */
    ServiceManager.prototype.issetService = function(serviceName)
    {
        return !!this._services[serviceName];
    };

    /**
     * Registers new parameter
     *
     * @param {string} paramName
     * @param {*} paramValue
     */
    ServiceManager.prototype.registerParameter = function(paramName, paramValue)
    {
        this._parameters[paramName] = paramValue;
    };

    /**
     * Sets parameter value
     *
     * @param {string} paramName
     * @param {*} paramValue
     */
    ServiceManager.prototype.setParameter = function(paramName, paramValue)
    {
        if (!this.issetProperty(paramName)) {
            throw new Error('Parameter with name "' + paramName + '" is not exists.');
        }
        this._parameters[paramName] = paramValue;
    };

    /**
     * Returns parameter value
     *
     * @param {string} paramName
     * @return {*}
     */
    ServiceManager.prototype.getParameter = function(paramName)
    {
        if (!this.issetParameter(paramName)) {
            throw new Error('Parameter with name "' + paramName + '" is not exists.');
        }
        return this._parameters[paramName];
    };

    /**
     * Checks whether parameter with passed name is exists
     *
     * @param {string} paramName
     * @returns {boolean}
     */
    ServiceManager.prototype.issetParameter = function(paramName)
    {
        return !!this._parameters[paramName];
    };

    return ServiceManager;

})();