/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyOptionError = (function()
{
    function InvalidPropertyOptionError(message)
    {
        Subclass.Error.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyOptionError.getName = function()
    {
        return "InvalidPropertyOption";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.getOptions = function()
    {
        var options = Subclass.Error.getOptions();

        return options.concat([
            'property',
            'expected',
            'received',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

        return required.concat([
            'property',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.prototype.buildMessage = function()
    {
        var message = Subclass.Error.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option ' + this.option() + ' ';
            message += 'in definition of property "' + this.property() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyOptionError.getName(),
        InvalidPropertyOptionError
    );

    return InvalidPropertyOptionError;

})();