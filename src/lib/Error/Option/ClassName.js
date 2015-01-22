/**
 * @mixin
 */
Subclass.Error.Option.ClassName = (function()
{
    return {

        /**
         * Sets/returns class name
         *
         * @param {string} [className]
         * @returns {Subclass.Error}
         */
        className: function(className)
        {
            if (!arguments.length) {
                return this._className;
            }
            if (className && typeof className != 'string') {
                throw new Error('Specified invalid class name. It must be a string.');
            }
            this._className = className;

            return this;
        },

        /**
         * Checks whether the className option was specified
         *
         * @returns {boolean}
         */
        hasClassName: function()
        {
            return this._className !== undefined;
        }
    };
})();