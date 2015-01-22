/**
 * @namespace
 */
Subclass.Error = {};

/**
 * @namespace
 */
Subclass.Error.Option = {};

/**
 * @class
 */
Subclass.Error.Error = (function()
{
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
     * Builds message
     *
     * @returns {*}
     */
    Exception.prototype.buildMessage = function()
    {
        if (this._message) {
            return this._message;
        }
        this.constructor.validateRequiredOptions(this);
    };

    /**
     * Sets/returns an error message
     *
     * @param {string} [message]
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
     * @returns {boolean}
     */
    Exception.prototype.hasMessage = function()
    {
        return this._message !== undefined;
    };

    /**
     * Throws error
     */
    Exception.prototype.apply = function()
    {
        var message = this.message();

        throw new Error(message);
    };


    /******************************************************************/
    /************************** Static Methods ************************/
    /******************************************************************/

    Exception._types = {};

    /**
     * Creates error.
     * @param {string} type
     *      The error type. If type was not registered it will be
     *      interpreted as a message text
     */
    Exception.create = function(type)
    {
        if (!this.issetType(type)) {
            var message = type;

            return new Exception(message);
        }
        var typeFunc = this.getType(type);
        var constructor = this.createConstructor(typeFunc);

        var errorInst = new constructor();

        this.attachOptionProperties(errorInst);

        return errorInst;
    };

    /**
     * Creates error type constructor
     *
     * @param {Function} construct
     * @returns {Function}
     */
    Exception.createConstructor = function(construct)
    {
        var constructProto = Object.create(Exception.prototype);

        constructProto = Subclass.Tools.extend(
            constructProto,
            construct.prototype
        );

        this.attachOptionMethods(construct);

        construct.prototype = constructProto;
        construct.prototype.constructor = construct;

        return construct;
    };

    /**
     * Returns all available error type options
     *
     * @returns {Array}
     * @private
     */
    Exception.getOptions = function()
    {
        return [];
    };

    /**
     * Returns required error fields
     *
     * @returns {Array}
     */
    Exception.getOptionsRequired = function()
    {
        return [];
    };

    /**
     * Validates required error fields
     *
     * @private
     */
    Exception.validateRequiredOptions = function(errorInst)
    {
        var required = this.getOptionsRequired();
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
     * @param {Function} errorTypeConstructor
     */
    Exception.attachOptionMethods = function(errorTypeConstructor)
    {
        var options = this.getOptions();

        for (var i = 0; i < options.length; i++) {
            var optionName = options[i][0].toUpperCase() + options[i].substr(1);
            var optionMethods = Subclass.Error.Option[optionName];

            Subclass.Tools.extendDeep(
                errorTypeConstructor.prototype,
                optionMethods
            );
        }
    };

    /**
     * Attaches the option properties
     *
     * @param {Subclass.Error.Error} errorInst
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
     * @param {string} typeName
     * @returns {boolean}
     */
    Exception.issetType = function(typeName)
    {
        return !!this._types[typeName];
    };

    return Exception;

})();

Subclass.Error = Subclass.Error.Error;