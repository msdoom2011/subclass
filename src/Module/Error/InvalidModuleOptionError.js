/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @constructor
 * @description
 *
 * The error class which indicates that was specified not valid value of
 * option in module configuration. To see details about constructor
 * parameters look at {@link Subclass.Error} class constructor
 *
 * @param {string} [message]
 *      The error message
 */
Subclass.Module.Error.InvalidModuleOptionError = (function()
{
    /**
     * @alias Subclass.Module.Error.InvalidModuleOptionError
     */
    function InvalidModuleOptionError(message)
    {
        InvalidModuleOptionError.$parent.call(this, message);
    }

    /**
     * @inheirtDoc
     *
     * @method getName
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     */
    InvalidModuleOptionError.getName = function()
    {
        return "InvalidModuleOption";
    };

    /**
     * @inheritDoc
     *
     * @method getOptions
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
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
     *
     * @method getOptionsRequired
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     */
    InvalidModuleOptionError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat([
            'module',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     *
     * @method buildMessage
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError.prototype
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