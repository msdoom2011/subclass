/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message
 * which is actual when some argument was missed.
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.MissedArgumentError = (function()
{
    function MissedArgumentError(message)
    {
        MissedArgumentError.$parent.call(this, message);
    }

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.MissedArgumentError
     * @static
     *
     * @returns {string}
     */
    MissedArgumentError.getName = function()
    {
        return "MissedArgument";
    };

    /**
     * Returns all available error type options
     *
     * @method getOptions
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {Array}
     */
    MissedArgumentError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'argument'
        ]);
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {Array}
     */
    MissedArgumentError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    MissedArgumentError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The ' + this.argument() + ' argument is required but was missed.';
        }

        return message;
    };

    Subclass.Error.registerType(
        MissedArgumentError.getName(),
        MissedArgumentError
    );

    return MissedArgumentError;
})();