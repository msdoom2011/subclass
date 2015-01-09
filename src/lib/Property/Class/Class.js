/**
 * @namespace
 */
Subclass.Property.Class = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Class.Class = (function()
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
     */
    ClassType.isAllowedValue = function(value)
    {
        return typeof value == 'string';
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.parseRelatives = function(propertyDefinition)
    {
        if (!propertyDefinition.className) {
            return;
        }
        return [propertyDefinition.className];
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getDefinitionClass = function()
    {
        return Subclass.Property.Class.ClassDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();