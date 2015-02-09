/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the option name when creating an error instance
 */
Subclass.Error.Option.Option = (function()
{
    return {

        /**
         * Sets/returns option name
         *
         * @method option
         * @memberOf Subclass.Error.Option.Option.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid option name
         *
         * @param {string} [option]
         *      The name of option
         *
         * @param {boolean} [quotes]
         *      whether it is needed wrap to quotes
         *
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
         * @method hasOption
         * @memberOf Subclass.Error.Option.Option.prototype
         *
         * @returns {boolean}
         */
        hasOption: function()
        {
            return this._option !== undefined;
        }
    };
})();