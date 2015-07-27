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
Subclass.Error.InvalidClassOptionError = (function()
{
    function InvalidClassOptionError(message)
    {
        InvalidClassOptionError.$parent.call(this, message);
    }

    InvalidClassOptionError.$parent = Subclass.Error.ErrorBase;

    InvalidClassOptionError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received,
        Subclass.Error.Option.Option
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.InvalidClassOptionError
     * @static
     *
     * @returns {string}
     */
    InvalidClassOptionError.getName = function()
    {
        return "InvalidClassOption";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidClassOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidClassOptionError.getRequiredOptions = function()
    {
        var required = InvalidClassOptionError.$parent.getRequiredOptions();

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
        var message = InvalidClassOptionError.$parent.prototype.buildMessage.call(this);

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