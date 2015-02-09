/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the argument name when creating an error instance.
 */
Subclass.Error.Option.Argument = (function()
{
    return {

        /**
         * Sets/returns the arguments name
         *
         * @method argument
         * @memberOf Subclass.Error.Option.Argument.prototype
         *
         * @throws {Error}
         *      Throws error specified invalid name of argument
         *
         * @param {string} [argName]
         *      The name of argument
         *
         * @param {boolean} [quotes]
         *      Should the argument name be wrapped in quotes
         *
         * @returns {(Subclass.Error|string)}
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
         * @method hasArgument
         * @memberOf Subclass.Error.Option.Argument.prototype
         *
         * @returns {boolean}
         */
        hasArgument: function()
        {
            return this._argument !== undefined;
        }
    };
})();