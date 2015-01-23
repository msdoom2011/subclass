/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Service.Error.ServiceInitializedError = (function()
{
    function ServiceInitializedError(message)
    {
        ServiceInitializedError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    ServiceInitializedError.getName = function()
    {
        return "ServiceInitialized";
    };

    /**
     * @inheritDoc
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
     */
    ServiceInitializedError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'You can\'t modify definition of the service "' + this.service() + '" after it was created.';
        }

        return message;
    };

    Subclass.Error.registerType(
        ServiceInitializedError.getName(),
        ServiceInitializedError
    );

    return ServiceInitializedError;

})();