/**
 * @class
 * @extends {Subclass.Error.Error}
 */
Subclass.Error.NotExistentMethodError = (function()
{
    function NotExistentMethodError(message)
    {
        NotExistentMethodError.$parent.call(this, message);
    }

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    NotExistentMethodError.getName = function()
    {
        return "NotExistentMethod";
    };

    /**
     * @inheritDoc
     */
    NotExistentMethodError.getOptions = function()
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
    NotExistentMethodError.getOptionsRequired = function()
    {
        var required = this.$parent.getOptionsRequired();

        return required.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotExistentMethodError.prototype.buildMessage = function()
    {
        var message = this.constructor.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The method "' + this.className() + '#' + this.method() + '" does not exist.';
        }

        return message;
    };

    Subclass.Error.registerType(
        NotExistentMethodError.getName(),
        NotExistentMethodError
    );

    return NotExistentMethodError;

})();