/**
 * @class
 */
Subclass.Service.ServiceFactory = (function()
{
    /**
     * @param {Subclass.Service.ServiceManager} serviceManager
     * @constructor
     */
    function ServiceFactory(serviceManager)
    {
        /**
         * Service manager instance
         *
         * @type {Subclass.Service.ServiceManager}
         */
        this._serviceManager = serviceManager;
    }

    /**
     * Returns service class instance
     *
     * @param {Subclass.Service.Service} service
     * @returns {Object}
     */
    ServiceFactory.prototype.getService = function(service)
    {
        if (service.isInitialized() && service.isSingleton()) {
            return service;
        }
        if (!service.isInitialized()) {
            service.initialize();
        }

        return this.createService(service);
    };

    /**
     * Creates and returns service class instance
     *
     * @param {Subclass.Service.Service} service
     */
    ServiceFactory.prototype.createService = function(service)
    {
        var serviceManager = this.getServiceManager();
        var classManager = serviceManager.getClassManager();

        // Creating class instance

        var classDef = classManager.getClass(service.getClassName());
        var classInst = classDef.createInstance.apply(classDef, service.getArguments());

        // Processing calls

        var calls = service.getCalls();

        for (var methodName in calls) {
            if (!calls.hasOwnProperty(methodName)) {
                continue;
            }
            classInst[methodName].apply(classInst, calls[methodName]);
        }

        // Processing tags

        if (classInst.isImplements('Subclass/Service/TaggableInterface')) {
            var taggedServices = serviceManager.getServicesByTag(service.getName());

            service.processTaggedServices(taggedServices);
        }
    };

    return ServiceFactory;

})();