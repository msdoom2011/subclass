/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify class name when creating an error instance.
 */
Subclass.Error.Option.ClassName = (function()
{
    return {

        /**
         * Sets/returns class name
         *
         * @method className
         * @memberOf Subclass.Error.Option.ClassName.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid class name argument
         *
         * @param {string} [className]
         *      The name of class
         *
         * @returns {(Subclass.Error|string)}
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
         * @method hasClassName
         * @memberOf Subclass.Error.Option.ClassName.prototype
         *
         * @returns {boolean}
         */
        hasClassName: function()
        {
            return this._className !== undefined;
        }
    };
})();