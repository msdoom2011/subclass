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
        if (
            value !== null
            && (
                typeof value != 'object'
                || !Subclass.Tools.isPlainObject(value)
            )
        ) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be a plain object or null' +
            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

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

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.processPropertyDefinition = function()
    {
        ObjectCollectionType.$parent.prototype.processPropertyDefinition.call(this);

        var defaultValue = this.getDefaultValue();
        var proto = this.getProto();

        if (!proto) {
            return false;
        }

        if (
            defaultValue
            && typeof defaultValue == 'object'
            && Subclass.Tools.isPlainObject(defaultValue)
        ) {
            var collection = this.getCollection();

            for (var propName in defaultValue) {
                if (!defaultValue.hasOwnProperty(propName)) {
                    continue;
                }
                if (!this.isWritable()) {
                    proto.writable = false;
                }
                collection.addItem(propName, defaultValue[propName]);
            }
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.validatePropertyDefinition = function()
    {
        ObjectCollectionType.$parent.prototype.validatePropertyDefinition.call(this);

        var defaultValue = this.getDefaultValue();

        if (
            defaultValue !== null
            && (
                typeof defaultValue != 'object'
                || !Subclass.Tools.isPlainObject(defaultValue)
            )
        ) {
            throw new Error('Specified not valid default value for property "' + this.getPropertyName() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();