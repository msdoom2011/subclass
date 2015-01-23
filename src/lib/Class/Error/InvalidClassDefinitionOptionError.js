/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Class.Error.InvalidClassDefinitionOptionError = (function()
{
    function InvalidClassDefinitionOptionError(message)
    {
        InvalidClassDefinitionOptionError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidClassDefinitionOptionError.getName = function()
    {
        return "InvalidClassDefinitionOption";
    };

    /**
     * @inheritDoc
     */
    InvalidClassDefinitionOptionError.getOptions = function()
    {
        var options = this.$parent.getOptions();

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
    InvalidClassDefinitionOptionError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'className',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidClassDefinitionOptionError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in definition of class "' + this.className() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidClassDefinitionOptionError.getName(),
        InvalidClassDefinitionOptionError
    );

    return InvalidClassDefinitionOptionError;

})();