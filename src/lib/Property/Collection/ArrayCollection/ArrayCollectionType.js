/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionType}
 */
Subclass.PropertyManager.PropertyTypes.ArrayCollection = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @extends {PropertyType}
     * @constructor
     */
    function ArrayCollectionType(propertyManager, propertyName, propertyDefinition, contextClass)
    {
        ArrayCollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition,
            contextClass
        );
    }

    ArrayCollectionType.$parent = Subclass.PropertyManager.PropertyTypes.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getPropertyTypeName = function()
    {
        return "arrayCollection";
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.isAllowedValue = function(value)
    {
        return Array.isArray(value);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ArrayCollectionDefinition;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ArrayCollection.Collection;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.generateSetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function(value) {
            $this.validate(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var i = 0; i < value.length; i++) {
                    this[hashedPropName].addItem(value[i]);
                }

            } else {
                $this.setIsNull(true);
                $this._collection.removeItems();
            }
        };
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ArrayCollectionType.prototype.validate = function(value)
    {
        if (ArrayCollectionType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            var message = 'The value of the property ' + this + ' must be an array or null. ';

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

    Subclass.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();