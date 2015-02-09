/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the method name when creating an error instance
 */
Subclass.Error.Option.Method = (function()
{
    return {

        /**
         * Sets/returns method name option
         *
         * @method method
         * @memberOf Subclass.Error.Option.Method.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid name of method
         *
         * @param {string} [method]
         *      The name of method
         *
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
         * @method hasMethod
         * @memberOf Subclass.Error.Option.Method.prototype
         *
         * @returns {boolean}
         */
        hasMethod: function()
        {
            return this._method !== undefined;
        }
    };
})();