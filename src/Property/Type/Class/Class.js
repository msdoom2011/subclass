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


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();