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
 * which is actual when some trying call to non existent method
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.NotExistentMethodError = (function()
{
    function NotExistentMethodError(message)
    {
        Subclass.Error.ErrorBase.call(this, message);
    }

    NotExistentMethodError.$parent = Subclass.Error.ErrorBase;

    NotExistentMethodError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Method
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.NotExistentMethodError
     * @static
     *
     * @returns {string}
     */
    NotExistentMethodError.getName = function()
    {
        return "NotExistentMethod";
    };
    //
    ///**
    // * Returns all available error type options
    // *
    // * @method getOptions
    // * @memberOf Subclass.Error.NotExistentMethodError
    // * @static
    // *
    // * @returns {Array}
    // */
    //NotExistentMethodError.getOptions = function()
    //{
    //    var options = Subclass.Error.getOptions();
    //
    //    return options.concat([
    //        'className',
    //        'method'
    //    ]);
    //};

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.NotExistentMethodError
     * @static
     *
     * @returns {Array}
     */
    NotExistentMethodError.getRequiredOptions = function()
    {
        var required = NotExistentMethodError.$parent.getRequiredOptions();

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
        var message = NotExistentMethodError.$parent.prototype.buildMessage.call(this);

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