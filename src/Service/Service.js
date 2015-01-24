/**
 * @class
 */
Subclass.Service.Service = (function()
{
    /**
     * @param {Subclass.Service.ServiceManager} serviceManager
     *      An instance of service manager
     *
     * @param {string} serviceName
     *      A name of the creating service
     *
     * @param {Object} serviceDefinition
     *      Definition of the service.
     *
     *      Allowed options:
     *      ----------------------------------------------------------------------------------------------
     *
     *      abstract       {boolean}    optional     If it's true that means you can't create instance
     *                                               of class.
     *
     *      extends        {string}     optional     Specifies name of service which current one will extends
     *
     *      className      {string}     required     Service class name,
     *
     *      arguments      {Array}      optional     Array of arguments, that will injected
     *                                               into $_constructor function of the class
     *
     *      calls          {Object}     optional     List of key/value pairs where key is a method name
     *                                               of the service class and value is an array with
     *                                               arguments for this method.
     *
     *                                               Example: {
     *                                                   methodName1: [arg1, arg2, ...],
     *                                                   methodName2: [arg1, arg2, ...],
     *                                                   ...
     *                                               }
     *
     *      singleton      {boolean}    optional     Tells whether current service will returns
     *                                               new instance when you trying to get it using
     *                                               serviceManager.getService() method call.
     *                                               It's true by default.
     *
     *      tags           {Array}      optional     Array of service names.
     *
     * @constructor
     */
    function Service(serviceManager, serviceName, serviceDefinition)
    {
        if (!serviceManager || !(serviceManager instanceof Subclass.Service.ServiceManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('service manager', false)
                .received(serviceManager)
                .expected('instance of "Subclass.Service.ServiceManager" class')
                .apply()
            ;
        }
        if (!serviceName || typeof serviceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('name of service', false)
                .received(serviceName)
                .expected('a string')
                .apply()
            ;
        }
        /**
         * Service manager instance
         *
         * @type {Subclass.Service.ServiceManager}
         * @private
         */
        this._serviceManager = serviceManager;

        /**
         * Name of the service
         *
         * @type {string}
         * @private
         */
        this._name = serviceName;

        /**
         * Definition of the service
         *
         * @type {Object}
         * @private
         */
        this._definition = this.setDefinition(serviceDefinition);

        /**
         * Instance of service class
         *
         * @type {Object}
         * @private
         */
        this._instance = null;

        /**
         * Indicates whether current service is initialized
         *
         * @type {boolean}
         * @private
         */
        this._initialized = false;
    }

    /**
     * Returns instance of service manager
     *
     * @returns {Subclass.Service.ServiceManager}
     */
    Service.prototype.getServiceManager = function()
    {
        return this._serviceManager;
    };

    /**
     * Returns name of the service
     *
     * @returns {string}
     */
    Service.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets service definition
     *
     * @param {Object} definition
     * @returns {Object}
     * @throws {Error}
     */
    Service.prototype.setDefinition = function(definition)
    {
        if (!definition || !Subclass.Tools.isPlainObject(definition)) {
            Subclass.Error.create('InvalidArgument')
                .argument('definition of service', false)
                .received(definition)
                .expected('a plain object')
                .apply()
            ;
        }
        this._definition = definition;

        return definition;
    };

    /**
     * Returns service definition
     *
     * @returns {Object}
     */
    Service.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Initializes service
     */
    Service.prototype.initialize = function()
    {
        this.validateDefinition();
        this.processDefinition();
    };

    /**
     * Checks whether current service was initialized
     *
     * @returns {boolean}
     */
    Service.prototype.isInitialized = function()
    {
        return this._initialized;
    };

    /**
     * Creates and returns instance of service class
     *
     * @returns {Object}
     */
    Service.prototype.createInstance = function()
    {
        return this.getServiceManager()
            .getServiceFactory()
            .getService(this)
        ;
    };

    /**
     * Sets service class instance
     *
     * @param {Object} instance
     */
    Service.prototype.setInstance = function(instance)
    {
        if (this.getAbstract()) {
            Subclass.Error.create('AbstractService')
                .service(this.getName())
                .apply()
            ;
        }
        this._instance = instance;
    };

    /**
     * Returns service class instance
     *
     * @returns {Object}
     */
    Service.prototype.getInstance = function()
    {
        if (this.getAbstract()) {
            Subclass.Error.create('AbstractService')
                .service(this.getName())
                .apply()
            ;
        }
        return this._instance;
    };

    /**
     * Validates "abstract" attribute
     *
     * @param {*} isAbstract
     * @returns {boolean}
     */
    Service.prototype.validateAbstract = function(isAbstract)
    {
        if (typeof isAbstract != 'boolean') {
            Subclass.Error.create('InvalidServiceOption')
                .option('abstract')
                .service(this.getName())
                .received(isAbstract)
                .expected('a boolean')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "abstract" attribute
     *
     * @param {boolean} isAbstract
     */
    Service.prototype.setAbstract = function(isAbstract)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateAbstract(isAbstract);
        this.getDefinition().abstract = isAbstract;
    };

    /**
     * Returns "abstract" attribute value
     * @returns {string}
     */
    Service.prototype.getAbstract = function()
    {
        return this.getDefinition().abstract;
    };

    /**
     * Validates "extends" attribute
     *
     * @param {*} parentServiceName
     * @returns {boolean}
     */
    Service.prototype.validateExtends = function(parentServiceName)
    {
        if (typeof parentServiceName != 'string') {
            Subclass.Error.create('InvalidServiceOption')
                .option('extends')
                .service(this.getName())
                .received(parentServiceName)
                .expected('a string')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "extends" attribute
     *
     * @param {string} parentServiceName
     */
    Service.prototype.setExtends = function(parentServiceName)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateExtends(parentServiceName);
        this.getDefinition().extends = parentServiceName;
    };

    /**
     * Returns "extends" attribute value
     * @returns {string}
     */
    Service.prototype.getExtends = function()
    {
        return this.getDefinition().extends;
    };

    /**
     * Validates "className" attribute
     *
     * @param {*} className
     * @returns {boolean}
     */
    Service.prototype.validateClassName = function(className)
    {
        if (typeof className != 'string') {
            Subclass.Error.create('InvalidServiceOption')
                .option('className')
                .service(this.getName())
                .received(className)
                .expected('a string')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "className" attribute
     *
     * @param {string} className
     */
    Service.prototype.setClassName = function(className)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateClassName(className);
        this.getDefinition().className = className;
    };

    /**
     * Returns "className" attribute
     * @returns {string}
     */
    Service.prototype.getClassName = function()
    {
        return this.getDefinition().className;
    };

    /**
     * Validates "arguments" attribute
     *
     * @param {*} args
     * @returns {boolean}
     */
    Service.prototype.validateArguments = function(args)
    {
        if (args !== null && !Array.isArray(args)) {
            Subclass.Error.create('InvalidServiceOption')
                .option('arguments')
                .service(this.getName())
                .received(args)
                .expected('an array')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "arguments" attribute
     *
     * @param {Array} args
     */
    Service.prototype.setArguments = function(args)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateArguments(args);
        this.getDefinition().arguments = args;
    };

    /**
     * Normalizes arguments
     *
     * @param args
     */
    Service.prototype.normalizeArguments = function(args)
    {
        var serviceManager = this.getServiceManager();
        var parameterManager = serviceManager.getModule().getParameterManager();

        if (!args) {
            return [];
        }

        args = Subclass.Tools.extend([], args);

        for (var i = 0; i < args.length; i++) {
            var value = args[i];

            if (typeof value == 'string' && value.match(/^@[a-z_0-9]+$/i)) {
                var serviceName = value.substr(1);
                args[i] = serviceManager.getService(serviceName);

            } else if (typeof value == 'string' && value.match(/%.+%/i)) {
                var regex = /%([^%]+)%/i;

                while (regex.test(value)) {
                    var parameterName = value.match(regex)[1];
                    var parameterValue = parameterManager.getParameter(parameterName);

                    value = value.replace(regex, parameterValue);
                }
                args[i] = value;
            }
        }
        return args;
    };

    /**
     * Returns "arguments" attribute
     *
     * @returns {Array}
     */
    Service.prototype.getArguments = function()
    {
        return this.getDefinition().arguments || [];
    };

    /**
     * Validates "calls" attribute
     *
     * @param {*} calls
     * @returns {boolean}
     */
    Service.prototype.validateCalls = function(calls)
    {
        try {
            if ((!calls && calls !== null) || (calls && typeof calls != 'object')) {
                throw 'error'
            }
            if (calls) {
                for (var methodName in calls) {
                    if (!calls.hasOwnProperty(methodName)) {
                        continue;
                    }
                    if (!Array.isArray(calls[methodName])) {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            Subclass.Error.create('InvalidServiceOption')
                .option('calls')
                .service(this.getName())
                .received(calls)
                .expected('a plain object with array properties')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "calls" attribute
     *
     * @param {Object.<Array>} calls
     */
    Service.prototype.setCalls = function(calls)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateCalls(calls);
        this.getDefinition().calls = calls;
    };

    /**
     * Normalizes arguments for call methods
     *
     * @param {Object.<Array>} calls
     * @returns {{}}
     */
    Service.prototype.normalizeCalls = function(calls)
    {
        if (!calls) {
            return {};
        }

        calls = Subclass.Tools.extend({}, calls);

        if (calls) {
            for (var methodName in calls) {
                if (!calls.hasOwnProperty(methodName)) {
                    continue;
                }
                calls[methodName] = this.normalizeArguments(calls[methodName]);
            }
        }
        return calls;
    };

    /**
     * Returns "calls" attribute
     *
     * @returns {Array}
     */
    Service.prototype.getCalls = function()
    {
        return this.getDefinition().calls || {};
    };

    /**
     * Validates "singleton" attribute
     *
     * @param {*} singleton
     * @returns {boolean}
     */
    Service.prototype.validateSingleton = function(singleton)
    {
        if (singleton !== null && typeof singleton != 'boolean') {
            Subclass.Error.create('InvalidServiceOption')
                .option('singleton')
                .service(this.getName())
                .received(singleton)
                .expected('a boolean')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "singleton" attribute
     *
     * @param {string} singleton
     */
    Service.prototype.setSingleton = function(singleton)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateSingleton(singleton);
        this.getDefinition().singleton = singleton;
    };

    /**
     * Returns "singleton" attribute
     *
     * @returns {string}
     */
    Service.prototype.getSingleton = Service.prototype.isSingleton = function()
    {
        return this.getDefinition().singleton;
    };

    /**
     * Validates "tags" attribute
     *
     * @param {*} tags
     * @returns {boolean}
     */
    Service.prototype.validateTags = function(tags)
    {
        if (tags !== null && !Array.isArray(tags)) {
            Subclass.Error.create('InvalidServiceOption')
                .option('tags')
                .service(this.getName())
                .received(tags)
                .expected('an array of strings')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "tags" attribute
     *
     * @param {Array} tags
     */
    Service.prototype.setTags = function(tags)
    {
        if (this.isInitialized()) {
            Subclass.Error.create('ServiceInitialized')
                .service(this.getName())
                .apply()
            ;
        }
        this.validateTags(tags);
        this.getDefinition().tags = tags;
    };

    /**
     * Returns "tags" attribute
     *
     * @returns {Array}
     */
    Service.prototype.getTags = function()
    {
        return this.getDefinition().tags || [];
    };

    /**
     * Returns base service definition
     *
     * @returns {Object}
     */
    Service.prototype.getBaseDefinition = function()
    {
        return {

            /**
             * Is abstract state
             *
             * @type {boolean}
             */
            abstract: false,

            /**
             * Parent service name
             *
             * @type {string}
             */
            extends: null,

            /**
             * Name of service class
             *
             * @type {string}
             */
            className: null,

            /**
             * Array of class constructor arguments
             *
             * @type {Array}
             */
            arguments: [],

            /**
             * List with method names and its arguments which will be called
             * immediately after service class instance creation
             *
             * @type {Object}
             */
            calls: {},

            /**
             * Tells whether current class is singleton or not
             *
             * @type {boolean}
             */
            singleton: true,

            /**
             * List of tags
             *
             * @type {string[]}
             */
            tags: []
        }
    };

    /**
     * Validates service definition
     */
    Service.prototype.validateDefinition = function()
    {
        var serviceManager = this.getServiceManager();
        var tags = this.getTags();
        var args = this.getArguments();
        var calls = this.getCalls();
        var chain = [this.getName()];
        var $this = this;

        if (arguments[0] && Array.isArray(chain)) {
            chain = arguments[0];
        }

        function validateArguments(arg)
        {
            if (typeof arg == 'string' && arg.match(/^@[a-z_0-9]+$/i)) {
                var serviceName = arg.substr(1);

                if (tags.indexOf(serviceName) >= 0 || serviceName == chain[0]) {
                    Subclass.Error.create(
                        'Can\'t create instance of service "' + this.getName() + '". ' +
                        'Circular dependency injection was found.'
                    );
                }
                if (chain.indexOf(serviceName) > 0) {
                    return;
                }
                var service = serviceManager.getServiceDefinition(serviceName);
                    chain.concat(service.validateDefinition(chain));
            }
        }

        // Validating arguments

        for (var i = 0; i < args.length; i++) {
            validateArguments(args[i]);
        }

        // Validating calls

        for (var methodName in calls) {
            if (calls.hasOwnProperty(methodName)) {
                for (i = 0; i < calls[methodName].length; i++) {
                    validateArguments(calls[methodName][i]);
                }
            }
        }

        return chain;
    };

    /**
     * Processing service definition
     */
    Service.prototype.processDefinition = function()
    {
        var definition = this.getDefinition();
        this._definition = this.getBaseDefinition();

        for (var attrName in definition) {
            if (!definition.hasOwnProperty(attrName)) {
                continue;
            }
            var setterMethod = "set" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        // Tells that service was initialized

        this._initialized = true;
    };

    return Service;

})();