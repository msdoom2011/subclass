/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Property.Error.InvalidPropertyDefinitionOptionError = (function()
{
    function InvalidPropertyDefinitionOptionError(message)
    {
        InvalidPropertyDefinitionOptionError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyDefinitionOptionError.getName = function()
    {
        return "InvalidPropertyDefinitionOption";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyDefinitionOptionError.getOptions = function()
    {
        var options = this.$parent.getOptions();

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
    InvalidPropertyDefinitionOptionError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'property',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyDefinitionOptionError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in definition of property "' + this.property() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyDefinitionOptionError.getName(),
        InvalidPropertyDefinitionOptionError
    );

    return InvalidPropertyDefinitionOptionError;

})();