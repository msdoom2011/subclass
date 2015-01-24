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
         * @param {boolean} [quotes]
         * @returns {Subclass.Error}
         */
        option: function(option, quotes)
        {
            if (!arguments.length) {
                return this._option;
            }
            if (option && typeof option != 'string') {
                throw new Error('Specified invalid option name. It must be a string.');
            }
            if (quotes !== false) {
                quotes = true;
            }
            var opt = [option];

            if (quotes) {
                opt.unshift('"');
                opt.push('"');
            }
            this._option = opt.join("");

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