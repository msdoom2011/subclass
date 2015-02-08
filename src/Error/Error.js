/**
 * @namespace
 */
Subclass.Error = {};

/**
 * @class
 * @constructor
 * @description
 *
 * The base error class
 *
 * @param {string} [message]
 *      The error message
 */
Subclass.Error = (function()
{
    /**
     * @alias Subclass.Error
     */
    function Exception(message)
    {
        if (!message) {
            message = undefined;
        }

        /**
         * The message of error
         *
         * @type {(string|null)}
         */
        this._message = message;
    }

    /**
     * Builds error message.
     * If error message was set it returns it.
     * Otherwise the message will be built.
     *
     * @method buildMessage
     * @memberOf Subclass.Error.prototype
     *
     * @returns {string}
     */
    Exception.prototype.buildMessage = function()
    {
        if (this._message) {
            return this._message;
        }
        return "";
    };

    /**
     * Sets/returns an error message.
     *
     * If the message argument was specified it will be set the error message.
     * Otherwise it builds message by the {@link Subclass.Error#buildMessage} method and returns it.
     *
     * @method message
     * @memberOf Subclass.Error.prototype
     *
     * @param {string} [message]
     *      The error message.
     *
     * @returns {Subclass.Error}
     */
    Exception.prototype.message = function(message)
    {
        if (!arguments.length) {
            return this.buildMessage();
        }
        if (message && typeof message != 'string') {
            throw new Error('Specified invalid error message. It must be a string.');
        }
        this._message = message;

        return this;
    };

    /**
     * Checks whether the message option was specified
     *
     * @method hasMessage
     * @memberOf Subclass.Error.prototype
     *
     * @returns {boolean}
     */
    Exception.prototype.hasMessage = function()
    {
        return this._message !== undefined;
    };

    /**
     * Throws error
     *
     * @method apply
     * @memberOf Subclass.Error.prototype
     * @throws {Error}
     */
    Exception.prototype.apply = function()
    {
        if (this.constructor.$parent) {
            this.constructor.$parent.validateRequiredOptions(this);
        }
        var message = this.message();

        throw new Error(message);
    };


    /******************************************************************/
    /************************** Static Methods ************************/
    /******************************************************************/

    /**
     * Collection with constructor functions of registered error types
     *
     * @memberOf Subclass.Error
     * @type {Object}
     */
    Exception._types = {};

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {string}
     */
    Exception.getName = function()
    {
        throw new Error('Not implemented method "getName".');
    };

    /**
     * Creates error object instance.
     *
     * @method create
     * @memberOf Subclass.Error
     * @static
     *
     * @param {string} type
     *      The error type. If type was not registered it will be
     *      interpreted as a message text
     */
    Exception.create = function(type)
    {
        if (!this.issetType(type)) {
            var message = type;

            return (new Exception(message)).apply();
        }
        var typeFunc = this.getType(type);
        var constructor = this.createConstructor(typeFunc);
        var errorInst = new constructor();

        this.attachOptionProperties.call(constructor, errorInst);

        return errorInst;
    };

    /**
     * Creates error type constructor.
     *
     * At current stage error type constructor prototype supplements by properties and methods from
     * its parent class (it is always {@link Subclass.Error}) and mixins specified in getOptions method.
     *
     * @method createConstructor
     * @private
     * @ignore
     *
     * @param {Function} construct
     *      THe error type constructor function
     *
     * @returns {Function}
     */
    Exception.createConstructor = function(construct)
    {
        var constructProto = Object.create(this.prototype);

        constructProto = Subclass.Tools.extend(
            constructProto,
            construct.prototype
        );

        construct.prototype = constructProto;
        construct.prototype.constructor = construct;
        construct.prototype.constructor.$parent = Exception;

        this.attachOptionMethods.call(construct);

        return construct;
    };

    /**
     * Returns all available error type options
     *
     * @method getOptions
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {Array}
     */
    Exception.getOptions = function()
    {
        return [];
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {Array}
     */
    Exception.getRequiredOptions = function()
    {
        return [];
    };

    /**
     * Validates required error fields
     *
     * @method validateRequiredOptions
     * @private
     * @ignore
     */
    Exception.validateRequiredOptions = function(errorInst)
    {
        var required = this.getRequiredOptions();
        var missed = [];

        if (required.indexOf('message') >= 0) {
            required.splice(required.indexOf('message'), 1);
        }
        for (var i = 0; i < required.length; i++) {
            var checkerName = 'has' + required[i][0].toUpperCase() + required[i].substr(1);

            if (!errorInst[checkerName]()) {
                missed.push(required[i]);
            }
        }
        if (missed.length) {
            throw new Error(
                'Can\'t build error message. ' +
                'There are not specified error options: "' + missed.join('", "') + '".'
            );
        }
    };

    /**
     * Attaches the option methods
     *
     * @method attachOptionMethods
     * @private
     * @ignore
     */
    Exception.attachOptionMethods = function()
    {
        var options = this.getOptions();

        for (var i = 0; i < options.length; i++) {
            var optionName = options[i][0].toUpperCase() + options[i].substr(1);
            var optionMethods = Subclass.Error.Option[optionName];

            Subclass.Tools.extendDeep(
                this.prototype,
                optionMethods
            );
        }
    };

    /**
     * Attaches the option properties
     *
     * @method attachOptionProperties
     * @private
     * @ignore
     *
     * @param {Subclass.Error} errorInst
     *      The instance of Subclass.Error class
     */
    Exception.attachOptionProperties = function(errorInst)
    {
        var options = this.getOptions();

        for (var i = 0; i < options.length; i++) {
            errorInst['_' + options[i]] = undefined;
        }
    };

    /**
     * Registers new error type
     *
     * @method registerType
     * @memberOf Subclass.Error
     * @static
     *
     * @param {string} typeName
     *      The name of error type
     *
     * @param {Function} typeConstructor
     *      The constructor function of error type
     */
    Exception.registerType = function(typeName, typeConstructor)
    {
        if (!typeName || typeof typeName != 'string') {
            throw new Error(
                'Specified invalid name of registering error type. ' +
                'It must be a string'
            );
        }
        if (!typeConstructor || typeof typeConstructor != 'function') {
            throw new Error(
                'Specified invalid constructor of registering error type. ' +
                'It must be a function.'
            );
        }
        if (this.issetType(typeName)) {
            throw new Error(
                'Can\'t register error type "' + typeName + '". ' +
                'It\'s already exists'
            );
        }

        this._types[typeName] = typeConstructor;
    };

    /**
     * Returns constructor of early registered error type
     *
     * @method getType
     * @memberOf Subclass.Error
     * @static
     *
     * @param {string} typeName
     *      The name of error type
     *
     * @returns {Function}
     *      The error type constructor function
     */
    Exception.getType = function(typeName)
    {
        if (!this.issetType(typeName)) {
            throw new Error('Trying to get not registered error type constructor.');
        }
        return this._types[typeName];
    };

    /**
     * Checks whether the error type with specified name was registered
     *
     * @method issetType
     * @memberOf Subclass.Error
     * @static
     *
     * @param {string} typeName
     *      The name of error type
     *
     * @returns {boolean}
     */
    Exception.issetType = function(typeName)
    {
        return !!this._types[typeName];
    };

    return Exception;

})();

/**
 * @namespace
 */
Subclass.Error.Option = {};
