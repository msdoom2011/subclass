/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @constructor
 * @description
 *
 * The error class which indicates that was attempt to create instance
 * of abstract service
 *
 * @param {string} [message]
 *      The error message
 */
Subclass.Service.Error.AbstractServiceError = (function()
{
    /**
     * @alias Subclass.Service.Error.AbstractServiceError
     */
    function AbstractServiceError(message)
    {
        AbstractServiceError.$parent.call(this, message);
    }

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.AbstractServiceError
     */
    AbstractServiceError.getName = function()
    {
        return "AbstractService";
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.AbstractServiceError
     */
    AbstractServiceError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'service'
        ]);
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.AbstractServiceError
     */
    AbstractServiceError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat([
            'service'
        ]);
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.AbstractServiceError.prototype
     */
    AbstractServiceError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'You can\'t get/create instance of abstract service "' + this.service() + '".';
        }

        return message;
    };

    // Registering the error type class

    Subclass.Error.registerType(
        AbstractServiceError.getName(),
        AbstractServiceError
    );

    return AbstractServiceError;

})();