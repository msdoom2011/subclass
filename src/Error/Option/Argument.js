/**
 * @mixin
 */
Subclass.Error.Option.Argument = (function()
{
    return {

        /**
         * Sets/returns arguments name
         *
         * @param {string} [argName]
         * @param {boolean} [quotes]
         * @returns {Subclass.Error}
         */
        argument: function(argName, quotes)
        {
            if (!arguments.length) {
                return this._argument;
            }
            if (argName && typeof argName != 'string') {
                throw new Error('Specified invalid argument name. It must be a string.');
            }
            if (quotes !== false) {
                quotes = true;
            }
            var arg = [argName];

            if (quotes) {
                arg.unshift('"');
                arg.push('"');
            }
            this._argument = arg.join("");

            return this;
        },

        /**
         * Checks whether the argument option was specified
         *
         * @returns {boolean}
         */
        hasArgument: function()
        {
            return this._argument !== undefined;
        }
    };
})();