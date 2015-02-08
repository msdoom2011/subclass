/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Class.Error.InvalidClassOptionError = (function()
{
    function InvalidClassOptionError(message)
    {
        Subclass.Error.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidClassOptionError.getName = function()
    {
        return "InvalidClassOption";
    };

    /**
     * @inheritDoc
     */
    InvalidClassOptionError.getOptions = function()
    {
        var options = Subclass.Error.getOptions();

        return options.concat([
            'className',
            'expected',
            'received',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidClassOptionError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

        return required.concat([
            'className',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidClassOptionError.prototype.buildMessage = function()
    {
        var message = Subclass.Error.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in definition of class "' + this.className() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidClassOptionError.getName(),
        InvalidClassOptionError
    );

    return InvalidClassOptionError;

})();