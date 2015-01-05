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
        this._definition = serviceDefinition;

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
     * Returns service definition
     *
     * @returns {Object}
     */
    Service.prototype.getDefinition = function()
    {
        return this._definition;
    };

    Service.prototype.initialize = function()
    {
        this.validateDefinition();
        this.processDefinition();
    };

    /**
     * Checks whether current service was initialized
     *
     * @returns {boolean|*}
     */
    Service.prototype.isInitialized = function()
    {
        return this._initialized;
    };

    /**
     * Sets service class instance
     *
     * @param {Object} instance
     */
    Service.prototype.setInstance = function(instance)
    {
        this._instance = instance;
    };

    /**
     * Returns service class instance
     *
     * @returns {Object|*}
     */
    Service.prototype.getInstance = function()
    {
        return this._instance;
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
            this._throwInvalidAttribute('className', 'a string');
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
            this._throwServiceInitialized();
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
            this._throwInvalidAttribute('arguments', 'an array');
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
            this._throwServiceInitialized();
        }
        this.validateArguments(args);
        args = this.normalizeArguments(args);
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

        if (!args) {
            return [];
        }

        for (var i = 0; i < args.length; i++) {
            var value = args[i];

            if (typeof value == 'string' && value.match(/^@[a-z_0-9]+$/i)) {
                var serviceName = value.substr(1);
                args[i] = serviceManager.getService(serviceName);

            } else if (typeof value == 'string' && value.match(/%.+%/i)) {
                var regex = /%([^%]+)%/i;

                while (regex.test(value)) {
                    var parameterName = value.match(regex)[1];
                    var parameterValue = serviceManager.getParameter(parameterName);

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
        if ((!calls && calls !== null) || (calls && typeof calls != 'object')) {
            this._throwInvalidAttribute('calls', 'a plain object with arrays');
        }
        if (calls) {
            for (var methodName in calls) {
                if (!calls.hasOwnProperty(methodName)) {
                    continue;
                }
                if (!Array.isArray(calls[methodName])) {
                    this._throwInvalidAttribute('calls', 'a plain object with arrays');
                }
            }
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
            this._throwServiceInitialized();
        }
        this.validateCalls(calls);
        this.getDefinition().calls = calls;

        if (calls) {
            for (var methodName in calls) {
                if (!calls.hasOwnProperty(methodName)) {
                    continue;
                }
                calls[methodName] = this.normalizeArguments(calls[methodName]);
            }
        }
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
            this._throwInvalidAttribute('singleton', 'a boolean');
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
            this._throwServiceInitialized();
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
            this._throwInvalidAttribute('tags', 'an array');
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
            this._throwServiceInitialized();
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
        return this.getDefinition().tags;
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

                if (serviceName == chain[0]) {
                    $this._throwRecursionInjection(serviceName);
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

    /**
     * Throws error when specified attribute is not valid
     *
     * @param {string} attributeName
     * @param {string} types
     * @throws {Error}
     * @private
     */
    Service.prototype._throwInvalidAttribute = function(attributeName, types)
    {
        throw new Error(
            'Invalid value of attribute "' + attributeName + '" ' +
            'in definition of service ' + this.getName() + '. ' +
            'It must be ' + types + '.'
        );
    };

    /**
     * Throws error when trying to modify service definition after its creation
     *
     * @throws {Error}
     * @private
     */
    Service.prototype._throwServiceInitialized = function()
    {
        throw new Error('You can\'t modify service definition after it was created');
    };

    /**
     * Throws error when circular dependency injection happens.
     *
     * @param {string} serviceName
     * @throws {Error}
     * @private
     */
    Service.prototype._throwRecursionInjection = function(serviceName)
    {
        throw new Error(
            'Can\'t create instance of service "' + serviceName + '". ' +
            'Circular dependency injection was found.'
        );
    };

    return Service;

})();