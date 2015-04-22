/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.ClassName
 * @mixes Subclass.Error.Option.Method
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message
 * which is actual when the some method was not implemented.
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.NotImplementedMethodError = (function()
{
    function NotImplementedMethodError(message)
    {
        NotImplementedMethodError.$parent.call(this, message);
    }

    NotImplementedMethodError.$parent = Subclass.Error.ErrorBase;

    NotImplementedMethodError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Method
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.NotImplementedMethodError
     * @static
     *
     * @returns {string}
     */
    NotImplementedMethodError.getName = function()
    {
        return "NotImplementedMethod";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.NotImplementedMethodError
     * @static
     *
     * @returns {Array}
     */
    NotImplementedMethodError.getRequiredOptions = function()
    {
        var required = NotImplementedMethodError.$parent.getRequiredOptions();

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