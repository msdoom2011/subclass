/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Module.Error.InvalidModuleOptionError = (function()
{
    function InvalidModuleOptionError(message)
    {
        InvalidModuleOptionError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidModuleOptionError.getName = function()
    {
        return "InvalidModuleOption";
    };

    /**
     * @inheritDoc
     */
    InvalidModuleOptionError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'option',
            'module',
            'expected',
            'received'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidModuleOptionError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'module',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidModuleOptionError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in configuration of module "' + this.module() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidModuleOptionError.getName(),
        InvalidModuleOptionError
    );

    return InvalidModuleOptionError;

})();