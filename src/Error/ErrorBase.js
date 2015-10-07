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
Subclass.Error.ErrorBase = function()
{
    function ErrorBase(message)
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

    ErrorBase.prototype = {

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
        buildMessage: function()
        {
            if (this._message) {
                return this._message;
            }
            return "";
        },

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
        message: function(message)
        {
            if (!arguments.length) {
                return this.buildMessage();
            }
            if (message && typeof message != 'string') {
                throw new Error('Specified invalid error message. It must be a string.');
            }
            this._message = message;

            return this;
        },

        /**
         * Checks whether the message option was specified
         *
         * @method hasMessage
         * @memberOf Subclass.Error.prototype
         *
         * @returns {boolean}
         */
        hasMessage: function()
        {
            return this._message !== undefined;
        },

        /**
         * Throws error
         *
         * @method apply
         * @memberOf Subclass.Error.prototype
         * @throws {Error}
         */
        apply: function()
        {
            Subclass.Error.ErrorBase.validateRequiredOptions(this);
            throw new Error(this.message());
        }
    };


    /******************************************************************/
    /************************** Static Methods ************************/
    /******************************************************************/

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {string}
     */
    ErrorBase.getName = function()
    {
        throw new Error('Not implemented method "getName".');
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
    ErrorBase.getRequiredOptions = function()
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
    ErrorBase.validateRequiredOptions = function(errorInst)
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

    return ErrorBase;

}();

/**
 * @namespace
 */
Subclass.Error.Option = {};
