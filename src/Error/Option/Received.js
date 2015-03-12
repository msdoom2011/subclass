/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify what was received when creating an error instance
 */
Subclass.Error.Option.Received = (function()
{
    function ReceivedOption()
    {
        return {
            /**
             * What you received
             *
             * @type {*}
             */
            _received: undefined
        };
    }

    /**
     * Sets received argument value and returns a part of error message included received value.
     *
     * @method received
     * @memberOf Subclass.Error.Option.Received.prototype
     *
     * @param {string} [received]
     *      What was received
     *
     * @returns {(Subclass.Error|string)}
     */
    ReceivedOption.prototype.received = function(received)
    {
        if (!arguments.length) {
            var value = this._received;
            var message = "";

            if (value && typeof value == 'object' && value.$_className) {
                message += 'The instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'The object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'Null was received instead.';

            } else {
                message += 'The value with type "' + (typeof value) + '" was received instead.';
            }
            return message;
        }

        this._received = received;

        return this;
    };

    /**
     * Checks whether received option was specified
     *
     * @method hasReceived
     * @memberOf Subclass.Error.Option.Received.prototype
     *
     * @returns {boolean}
     */
    ReceivedOption.prototype.hasReceived = function()
    {
        return this._received !== undefined;
    };

    return ReceivedOption;
})();
