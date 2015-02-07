/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @constructor
 * @description
 *
 * The error class which indicates that was specified invalid option value
 * in the definition of the service
 */
Subclass.Service.Error.InvalidServiceOptionError = (function()
{
    /**
     * @alias Subclass.Service.Error.InvalidServiceOptionError
     */
    function InvalidServiceOptionError(message)
    {
        InvalidServiceOptionError.$parent.call(this, message);
    }

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.InvalidServiceOptionError
     */
    InvalidServiceOptionError.getName = function()
    {
        return "InvalidServiceOption";
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.InvalidServiceOptionError
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
     *
     * @method getName
     * @memberOf Subclass.Service.Error.InvalidServiceOptionError
     */
    InvalidServiceOptionError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat([
            'service',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.InvalidServiceOptionError.prototype
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

    // Registering the error type class

    Subclass.Error.registerType(
        InvalidServiceOptionError.getName(),
        InvalidServiceOptionError
    );

    return InvalidServiceOptionError;

})();