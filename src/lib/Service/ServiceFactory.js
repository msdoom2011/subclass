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
     * Returns service manager instance
     *
     * @returns {Subclass.Service.ServiceManager}
     */
    ServiceFactory.prototype.getServiceManager = function()
    {
        return this._serviceManager;
    };

    /**
     * Returns service class instance
     *
     * @param {Subclass.Service.Service} service
     * @returns {Object}
     */
    ServiceFactory.prototype.getService = function(service)
    {
        if (service.isInitialized() && service.isSingleton()) {
            return service.getInstance();
        }
        if (!service.isInitialized()) {
            service.initialize();
        }
        var serviceClassInst = this.createService(service);
        service.setInstance(serviceClassInst);

        return serviceClassInst;
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

            classInst.processTaggedServices(taggedServices);
        }

        return classInst;
    };

    return ServiceFactory;

})();