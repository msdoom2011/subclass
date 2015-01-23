/**
 * @mixin
 */
Subclass.Error.Option.Property = (function()
{
    return {

        /**
         * Sets/returns options name
         *
         * @param {string} [property]
         * @returns {Subclass.Error}
         */
        property: function(property)
        {
            if (!arguments.length) {
                return this._property;
            }
            if (property && !(property instanceof Subclass.Property.PropertyType)) {
                throw new Error(
                    'Specified invalid property object. ' +
                    'It must be an instance of Subclass.Property.PropertyType.'
                );
            }
            this._property = property;

            return this;
        },

        /**
         * Checks whether the argument option was specified
         *
         * @returns {boolean}
         */
        hasProperty: function()
        {
            return this._property !== undefined;
        }
    };
})();