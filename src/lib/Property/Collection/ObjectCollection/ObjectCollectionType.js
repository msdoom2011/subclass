/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionType}
 */
Subclass.PropertyManager.PropertyTypes.ObjectCollection = (function()
{
    /*************************************************/
    /*   Describing property type "ObjectCollection" */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @extends {PropertyType}
     * @constructor
     */
    function ObjectCollectionType(propertyManager, propertyName, propertyDefinition, contextClass)
    {
        ObjectCollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition,
            contextClass
        );
    }

    ObjectCollectionType.$parent = Subclass.PropertyManager.PropertyTypes.CollectionType;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getPropertyTypeName = function()
    {
        return "objectCollection";
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.isAllowedValue = function(value)
    {
        return Subclass.Tools.isPlainObject(value);
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ObjectCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ObjectCollection.Collection;
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ObjectCollectionType.prototype.validate = function(value)
    {
        if (ObjectCollectionType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        if (!value || typeof value != 'object' || !Subclass.Tools.isPlainObject(value)) {
            var message = 'The value of the property ' + this + ' must be a plain object or null. ';

            if (typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (typeof value == 'object') {
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

    Subclass.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();