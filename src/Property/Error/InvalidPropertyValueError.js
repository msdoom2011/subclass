/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyValueError = (function()
{
    function InvalidPropertyValueError(message)
    {
        Subclass.Error.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyValueError.getName = function()
    {
        return "InvalidPropertyValue";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.getOptions = function()
    {
        var options = Subclass.Error.getOptions();

        return options.concat([
            'property',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

        return required.concat([
            'property'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.prototype.buildMessage = function()
    {
        var message = Subclass.Error.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of property ' + this.property() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyValueError.getName(),
        InvalidPropertyValueError
    );

    return InvalidPropertyValueError;

})();