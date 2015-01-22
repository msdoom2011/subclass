/**
 * @mixin
 */
Subclass.Error.Option.ClassName = (function()
{
    return {

        /**
         * Sets/returns method option
         *
         * @param {string} [method]
         * @returns {Subclass.Error}
         */
        method: function(method)
        {
            if (!arguments.length) {
                return this._method;
            }
            if (method && typeof method != 'string') {
                throw new Error('Specified invalid method. It must be a string.');
            }
            this._method = method;

            return this;
        },

        /**
         * Checks whether the method option was specified
         *
         * @returns {boolean}
         */
        hasMethod: function()
        {
            return this._method !== undefined;
        }
    };
})();