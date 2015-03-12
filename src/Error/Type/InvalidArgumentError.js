/**
 * @final
 * @class
 * @extends {Subclass.Error.ErrorBase}
 * @mixes Subclass.Error.Option.Argument
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message which
 * is actual when was specified some invalid argument
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.Type.InvalidArgumentError = (function()
{
    function InvalidArgumentError(message)
    {
        Subclass.Error.call(this, message);
    }

    InvalidArgumentError.$mixins = [
        Subclass.Error.Option.Argument,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {string}
     */
    InvalidArgumentError.getName = function()
    {
        return "InvalidArgument";
    };
    //
    ///**
    // * Returns all available error type options
    // *
    // * @method getOptions
    // * @memberOf Subclass.Error.InvalidArgumentError
    // * @static
    // *
    // * @returns {Array}
    // */
    //InvalidArgumentError.getOptions = function()
    //{
    //    var options = Subclass.Error.getOptions();
    //
    //    return options.concat([
    //        'argument',
    //        'expected',
    //        'received'
    //    ]);
    //};

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {Array}
     */
    InvalidArgumentError.getRequiredOptions = function()
    {
        var required = Subclass.Error.getRequiredOptions();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.prototype.buildMessage = function()
    {
        var message = Subclass.Error.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of ' + this.argument() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidArgumentError.getName(),
        InvalidArgumentError
    );

    return InvalidArgumentError;

})();