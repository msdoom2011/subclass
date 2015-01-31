/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 * @constructor
 * @description
 *
 * The error class which indicates that trying to change the definition of service
 * after it was initialized, i.e. was created an instance of class which was
 * specified in the "className" option.
 */
Subclass.Service.Error.ServiceInitializedError = (function()
{
    /**
     * @alias Subclass.Service.Error.ServiceInitializedError
     */
    function ServiceInitializedError(message)
    {
        ServiceInitializedError.$parent.call(this, message);
    }

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.ServiceInitializedError
     */
    ServiceInitializedError.getName = function()
    {
        return "ServiceInitialized";
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.ServiceInitializedError
     */
    ServiceInitializedError.getOptions = function()
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
     * @memberOf Subclass.Service.Error.ServiceInitializedError
     */
    ServiceInitializedError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'service'
        ]);
    };

    /**
     * @inheritDoc
     *
     * @method getName
     * @memberOf Subclass.Service.Error.ServiceInitializedError.prototype
     */
    ServiceInitializedError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'You can\'t modify definition of the service "' + this.service() + '" after it was created.';
        }

        return message;
    };

    // Registering the error type class

    Subclass.Error.registerType(
        ServiceInitializedError.getName(),
        ServiceInitializedError
    );

    return ServiceInitializedError;

})();