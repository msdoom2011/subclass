/**
 * @namespace
 */
Subclass.Property.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Class.Class = (function()
{
    /*************************************************/
    /*      Describing property type "Class"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function ClassType(propertyManager, propertyName, propertyDefinition)
    {
        ClassType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ClassType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ClassType.getPropertyTypeName = function()
    {
        return "class";
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.parseRelatedClasses = function(propertyDefinition)
    {
        if (!propertyDefinition.className) {
            return;
        }
        return [propertyDefinition.className];
    };

    /**
     * @inheritDoc
     */
    ClassType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    ClassType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.className = definition[1];
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


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();