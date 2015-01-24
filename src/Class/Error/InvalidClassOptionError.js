/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Class.Error.InvalidClassOptionError = (function()
{
    function InvalidClassOptionError(message)
    {
        InvalidClassOptionError.$parent.call(this, message);
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
    InvalidClassOptionError.getOptionsRequired = function()
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
    InvalidClassOptionError.prototype.buildMessage = function()
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
        InvalidClassOptionError.getName(),
        InvalidClassOptionError
    );

    return InvalidClassOptionError;

})();