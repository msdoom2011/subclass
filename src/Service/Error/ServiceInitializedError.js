/**
 * @final
 * @class
 * @extends {Subclass.Error}
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
        Subclass.Error.call(this, message);
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
        var options = Subclass.Error.getOptions();

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
    ServiceInitializedError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

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
        var message = Subclass.Error.prototype.buildMessage.call(this);

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