/**
 * @mixin
 */
Subclass.Error.Option.Option = (function()
{
    return {

        /**
         * Sets/returns options name
         *
         * @param {string} [option]
         * @returns {Subclass.Error}
         */
        option: function(option)
        {
            if (!arguments.length) {
                return this._option;
            }
            if (option && typeof option != 'string') {
                throw new Error('Specified invalid option name. It must be a string.');
            }
            this._option = option;

            return this;
        },

        /**
         * Checks whether the argument option was specified
         *
         * @returns {boolean}
         */
        hasOption: function()
        {
            return this._option !== undefined;
        }
    };
})();