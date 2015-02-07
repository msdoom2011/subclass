/**
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Error.NotImplementedMethodError = (function()
{
    function NotImplementedMethodError(message)
    {
        NotImplementedMethodError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    NotImplementedMethodError.getName = function()
    {
        return "NotImplementedMethod";
    };

    /**
     * @inheritDoc
     */
    NotImplementedMethodError.getOptions = function()
    {
        var options = this.$parent.getOptions();

        return options.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotImplementedMethodError.getRequiredOptions = function()
    {
        var required = this.$parent.getRequiredOptions();

        return required.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotImplementedMethodError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The method "' + this.className() + '#' + this.method() + '" ';
            message += 'is abstract and should be implemented.';
        }

        return message;
    };

    Subclass.Error.registerType(
        NotImplementedMethodError.getName(),
        NotImplementedMethodError
    );

    return NotImplementedMethodError;

})();