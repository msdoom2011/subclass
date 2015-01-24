/**
 * @class
 * @extends {Subclass.Error.Error}
 * @final
 */
Subclass.Error.MissedArgumentError = (function()
{
    function MissedArgumentError(message)
    {
        MissedArgumentError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    MissedArgumentError.getName = function()
    {
        return "MissedArgument";
    };

    /**
     * @inheritDoc
     */
    MissedArgumentError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'argument'
        ]);
    };

    /**
     * @inheritDoc
     */
    MissedArgumentError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

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