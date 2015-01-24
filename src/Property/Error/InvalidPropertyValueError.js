/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Property.Error.InvalidPropertyValueError = (function()
{
    function InvalidPropertyValueError(message)
    {
        InvalidPropertyValueError.$parent.call(this, message);
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
        var options = this.$parent.getOptions();

        return options.concat([
            'property',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'property'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

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