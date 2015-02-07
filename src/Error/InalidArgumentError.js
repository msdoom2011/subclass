/**
 * @class
 * @extends {Subclass.Error}
 * @final
 */
Subclass.Error.InvalidArgumentError = (function()
{
    function InvalidArgumentError(message)
    {
        InvalidArgumentError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidArgumentError.getName = function()
    {
        return "InvalidArgument";
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'argument',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of ' + this.argument() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidArgumentError.getName(),
        InvalidArgumentError
    );

    return InvalidArgumentError;
})();