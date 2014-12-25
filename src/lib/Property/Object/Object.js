Subclass.PropertyManager.PropertyTypes.Object = (function()
{
    /*************************************************/
    /*      Describing property type "Object"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function ObjectType(propertyManager, propertyName, propertyDefinition)
    {
        ObjectType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ObjectType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    ObjectType.getPropertyTypeName = function()
    {
        return "object";
    };

    /**
     * @inheritDoc
     */
    ObjectType.isAllowedValue = function(value)
    {
        return Subclass.Tools.isPlainObject(value);
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ObjectDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.validate = function(value)
    {
        if (value !== null && (typeof value != 'object' || !Subclass.Tools.isPlainObject(value))) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be a plain object' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(ObjectType);

    return ObjectType;

})();