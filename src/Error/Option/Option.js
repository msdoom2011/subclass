/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the option name when creating an error instance
 */
Subclass.Error.Option.Option = (function()
{
    function OptionOption()
    {
        return {
            /**
             * The name of option
             *
             * @type {(string|undefined)}
             */
            _option: undefined
        }
    }

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
    OptionOption.prototype.option = function(option, quotes)
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
    };

    /**
     * Checks whether the argument option was specified
     *
     * @method hasOption
     * @memberOf Subclass.Error.Option.Option.prototype
     *
     * @returns {boolean}
     */
    OptionOption.prototype.hasOption = function()
    {
        return this._option !== undefined;
    };

    return OptionOption;
})();