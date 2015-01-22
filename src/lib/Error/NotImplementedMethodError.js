/**
 * @class
 * @extends {Subclass.Error.Error}
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
        var options = this.constructor.$parent.getOptions();

        return options.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotImplementedMethodError.getOptionsRequired = function()
    {
        var required = this.constructor.$parent.getOptionsRequired();

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
        var message = NotImplementedMethodError.$parent.prototype.buildMessage.call(this);

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