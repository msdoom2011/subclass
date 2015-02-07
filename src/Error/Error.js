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
 * @param {string} [message=undefined]
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
     * @returns {*}
     */
    Exception.prototype.buildMessage = function()
    {
        if (this._message) {
            return this._message;
        }
        return "";
    };

    /**
     * Sets/returns an error message.<br /><br />
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
     * @type {Object.<Function>}
     * @private
     */
    Exception._types = {};

    /**
     * Creates error object instance.
     *
     * @method create
     * @memberOf Subclass.Error
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
     * Creates error type constructor.<br /><br />
     *
     * At current stage error type constructor prototype supplements by properties and methods from
     * its parent class (it is always {@link Subclass.Error}) and mixins specified in getOptions method.
     *
     * @method createConstructor
     * @memberOf Subclass.Error
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
     *
     * @param {Subclass.Error} errorInst
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
     *
     * @param {string} typeName
     * @param {Function} typeConstructor
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
     *
     * @param {string} typeName
     * @returns {Function}
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
     *
     * @param {string} typeName
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
