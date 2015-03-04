/**
 * @namespace
 */
Subclass.Property.Type.Enum = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Enum.Enum = (function()
{
    /*************************************************/
    /*       Describing property type "Enum"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function EnumType(propertyManager, propertyName, propertyDefinition)
    {
        EnumType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    EnumType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    EnumType.getPropertyTypeName = function()
    {
        return "enum";
    };

    /**
     * @inheritDoc
     */
    EnumType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Enum.EnumDefinition;
    };

    /**
     * @inheritDoc
     */
    EnumType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    EnumType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.allows = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.writable = definition[3];
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.isEmpty = function(context)
    {
        return false;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

})();