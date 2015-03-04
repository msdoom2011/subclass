/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.ClassName
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
 * @mixes Subclass.Error.Option.Option
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with specific message
 * when some class definition option is invalid
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Class.Error.InvalidClassOptionError = (function()
{
    function InvalidClassOptionError(message)
    {
        Subclass.Error.call(this, message);
    }

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Class.Error.InvalidClassOptionError
     * @static
     *
     * @returns {string}
     */
    InvalidClassOptionError.getName = function()
    {
        return "InvalidClassOption";
    };

    /**
     * Returns all available error type options
     *
     * @method getOptions
     * @memberOf Subclass.Class.Error.InvalidClassOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidClassOptionError.getOptions = function()
    {
        var options = Subclass.Error.getOptions();

        return options.concat([
            'className',
            'expected',
            'received',
            'option'
        ]);
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Class.Error.InvalidClassOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidClassOptionError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

        return required.concat([
            'className',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidClassOptionError.prototype.buildMessage = function()
    {
        var message = Subclass.Error.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option ' + this.option() + ' ';
            message += 'in definition of class "' + this.className() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidClassOptionError.getName(),
        InvalidClassOptionError
    );

    return InvalidClassOptionError;

})();