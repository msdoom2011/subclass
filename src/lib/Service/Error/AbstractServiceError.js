/**
 * @final
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Service.Error.AbstractServiceError = (function()
{
    function AbstractServiceError(message)
    {
        AbstractServiceError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    AbstractServiceError.getName = function()
    {
        return "AbstractService";
    };

    /**
     * @inheritDoc
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
     */
    AbstractServiceError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'service'
        ]);
    };

    /**
     * @inheritDoc
     */
    AbstractServiceError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'You can\'t get/create instance of abstract service "' + this.service() + '".';
        }

        return message;
    };

    Subclass.Error.registerType(
        AbstractServiceError.getName(),
        AbstractServiceError
    );

    return AbstractServiceError;

})();