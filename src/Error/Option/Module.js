/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify module name when creating an error instance.
 */
Subclass.Error.Option.Module = (function()
{
    return {

        /**
         * Sets/returns the module name
         *
         * @method module
         * @memberOf Subclass.Error.Option.Module.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid name of module
         *
         * @param {string} [module]
         *      The name of module
         *
         * @returns {(Subclass.Error|string)}
         */
        module: function(module)
        {
            if (!arguments.length) {
                return this._module;
            }
            if (module && typeof module != 'string') {
                throw new Error('Specified invalid module name. It must be a string.');
            }
            this._module = module;

            return this;
        },

        /**
         * Checks whether the module option was specified
         *
         * @method hasModule
         * @memberOf Subclass.Error.Option.Module.prototype
         *
         * @returns {boolean}
         */
        hasModule: function()
        {
            return this._module !== undefined;
        }
    };
})();