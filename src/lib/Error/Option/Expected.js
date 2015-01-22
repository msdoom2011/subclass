/**
 * @mixin
 */
Subclass.Error.Option.Expected = (function()
{
    return {

        /**
         * Sets/returns expected arguments value
         *
         * @throws {Error}
         * @param {string} [expectedValue]
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
         * @returns {boolean}
         */
        hasExpected: function()
        {
            return this._expected !== undefined;
        }
    };
})();
