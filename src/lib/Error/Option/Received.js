/**
 * @mixin
 */
Subclass.Error.Option.Received = (function()
{
    return {

        /**
         * Sets received arguments value and returns a part of error message included received value.
         *
         * @param {*} [argValue]
         * @returns {Subclass.Error}
         */
        received: function(argValue)
        {
            if (!arguments.length) {
                var value = this._received;
                var message = "";

                if (value && typeof value == 'object' && value.$_className) {
                    message += 'The instance of class "' + value.$_className + '" was received instead.';

                } else if (value && typeof value == 'object') {
                    message += 'The object with type "' + value.constructor.name + '" was received instead.';

                } else {
                    message += 'The value with type "' + (typeof value) + '" was received instead.';
                }
                return message;
            }

            this._received = argValue;

            return this;
        },

        /**
         * Checks whether received option was specified
         *
         * @returns {boolean}
         */
        hasReceived: function()
        {
            return this._received !== undefined;
        }
    };
})();
