/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify what was expected instead what was received
 */
Subclass.Error.Option.Expected = (function()
{
    return {

        /**
         * Sets/returns expected arguments value
         *
         * @method expected
         * @memberOf Subclass.Error.Option.Expected.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid string of what expected
         *
         * @param {string} [expectedValue]
         *      The string of what expected
         *
         * @returns {Subclass.Error}
         */
        expected: function(expectedValue)
        {
            if (!arguments.length) {
                return this._expected;
            }
            if (expectedValue && typeof expectedValue != 'string') {
                throw new Error('Invalid expected argument value. It must be a string');
            }
            this._expected = expectedValue;

            return this;
        },

        /**
         * Checks whether the expected option was specified
         *
         * @method hasExpected
         * @memberOf Subclass.Error.Option.Expected.prototype
         *
         * @returns {boolean}
         */
        hasExpected: function()
        {
            return this._expected !== undefined;
        }
    };
})();
