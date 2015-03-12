/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the method name when creating an error instance
 */
Subclass.Error.Option.Method = (function()
{
    function MethodOption()
    {
        return {
            /**
             * The name of method
             *
             * @type {(string|undefined)}
             */
            _method: undefined
        };
    }

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
    MethodOption.prototype.method = function(method)
    {
        if (!arguments.length) {
            return this._method;
        }
        if (method && typeof method != 'string') {
            throw new Error('Specified invalid method. It must be a string.');
        }
        this._method = method;

        return this;
    };

    /**
     * Checks whether the method option was specified
     *
     * @method hasMethod
     * @memberOf Subclass.Error.Option.Method.prototype
     *
     * @returns {boolean}
     */
    MethodOption.prototype.hasMethod = function()
    {
        return this._method !== undefined;
    };

    return MethodOption;
})();