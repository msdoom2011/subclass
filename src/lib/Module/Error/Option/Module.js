/**
 * @mixin
 */
Subclass.Error.Option.Module = (function()
{
    return {

        /**
         * Sets/returns module name
         *
         * @param {string} [module]
         * @returns {Subclass.Error}
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
         * @returns {boolean}
         */
        hasModule: function()
        {
            return this._module !== undefined;
        }
    };
})();