/**
 * @class
 * @extends {Subclass.Error.Error}
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
        var options = this.constructor.$parent.getOptions();

        return options.concat([
            'argument',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.getOptionsRequired = function()
    {
        var required = this.constructor.$parent.getOptionsRequired();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid argument "' + this.argument() + '" value. ';
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