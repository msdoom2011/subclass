/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.Option
 * @mixes Subclass.Error.Option.Module
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
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
    function InvalidModuleOptionError(message)
    {
        Subclass.Error.call(this, message);
    }

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     * @static
     *
     * @returns {string}
     */
    InvalidModuleOptionError.getName = function()
    {
        return "InvalidModuleOption";
    };

    /**
     * Returns all available error type options
     *
     * @method getOptions
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidModuleOptionError.getOptions = function()
    {
        var options = Subclass.Error.getOptions();

        return options.concat([
            'option',
            'module',
            'expected',
            'received'
        ]);
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidModuleOptionError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

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
        var message = Subclass.Error.prototype.buildMessage.call(this);

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