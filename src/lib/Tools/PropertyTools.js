; Subclass.Tools.Property = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Returns name of class property getter function
         *
         * @param {string} propertyName
         * @returns {string}
         */
        generateGetterName: function (propertyName)
        {
            return generateAccessorName("get", propertyName);
        },

        /**
         * Returns name of class property setter function
         *
         * @param {string} propertyName
         * @returns {string}
         */
        generateSetterName: function (propertyName)
        {
            return generateAccessorName("set", propertyName);
        }
    });

    /**
     * Generates class property accessor function name
     *
     * @param {string} accessorType Can be "get" or "set"
     * @param {string} propertyName
     * @returns {string}
     */
    function generateAccessorName(accessorType, propertyName)
    {
        if (['get', 'set'].indexOf(accessorType) < 0) {
            throw new Error('Invalid accessor type! It can be only "get" or "set".');
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
