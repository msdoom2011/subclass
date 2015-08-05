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
            _method: undefined,

            /**
             * Indicates that current method is static
             */
            _methodStatic: false
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
     * @param {boolean} [isStatic]
     *      Whether method is static
     *
     * @returns {Subclass.Error}
     */
    MethodOption.prototype.method = function(method, isStatic)
    {
        if (!arguments.length) {
            return this._method;
        }
        if (method && typeof method != 'string') {
            throw new Error('Specified invalid method option. It must be a string.');
        }
        this._method = method;

        if (arguments.length >= 2 && typeof isStatic != 'boolean') {
            throw new Error('Specified invalid isStatic option. It must be a boolean.')
        }
        this._methodStatic = isStatic;

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

    /**
     * Reports whether method is static
     *
     * @method isMethodStatic
     * @memberOf Subclass.Error.Option.Method.prototype
     *
     * @return {boolean}
     */
    MethodOption.prototype.isMethodStatic = function()
    {
        return this._methodStatic;
    };

    return MethodOption;
})();