Subclass.Tools.PropertyTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Returns name of getter function for the class property with specified name
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateGetterName: function (propertyName)
        {
            return _generateAccessorName("get", propertyName);
        },

        /**
         * Returns name of setter function for the class property with specified name
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateSetterName: function (propertyName)
        {
            return _generateAccessorName("set", propertyName);
        },

        /**
         * Returns name of checker function for the class property with specified name
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateCheckerName: function (propertyName)
        {
            return _generateAccessorName("is", propertyName);
        }
    });

    /**
     * Generates class property accessor function name
     *
     * @param {string} accessorType
     *      Can be "get", "set", "is"
     *
     * @param {string} propertyName
     *      A name of the class typed property defined in $_properties parameter
     *
     * @returns {string}
     * @private
     */
    function _generateAccessorName(accessorType, propertyName)
    {
        if (['get', 'set', 'is'].indexOf(accessorType) < 0) {
            Subclass.Error.create('Invalid accessor type! It can be only "get", "set" or "is".');
        }
        var propNameParts = propertyName.split("_");

        for (var i = 0; i < propNameParts.length; i++) {
            if (propNameParts[i] === "") {
                continue;
            }
            propNameParts[i] = propNameParts[i][0].toUpperCase() + propNameParts[i].substr(1);
        }

        return accessorType + propNameParts.join("");
    }

    return Subclass.Tools;
})();
