/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Service.Error.InvalidServiceOptionError = (function()
{
    function InvalidServiceOptionError(message)
    {
        InvalidServiceOptionError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidServiceOptionError.getName = function()
    {
        return "InvalidServiceOption";
    };

    /**
     * @inheritDoc
     */
    InvalidServiceOptionError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'option',
            'service',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidServiceOptionError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'service',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidServiceOptionError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in definition of service "' + this.service() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidServiceOptionError.getName(),
        InvalidServiceOptionError
    );

    return InvalidServiceOptionError;

})();