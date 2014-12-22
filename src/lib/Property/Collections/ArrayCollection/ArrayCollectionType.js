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
                $this.setIsValueNull(false);

                for (var i = 0; i < value.length; i++) {
                    this[hashedPropName].addItem(value[i]);
                }

            } else {
                $this.setIsValueNull(true);
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
        if (
            value !== null
            && (
                typeof value != 'object'
                || !Array.isArray(value)
            )
        ) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be an array or null' +
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
    ArrayCollectionType.prototype.processPropertyDefinition = function()
    {
        ArrayCollectionType.$parent.prototype.processPropertyDefinition.call(this);

        var defaultValue = this.getDefaultValue();
        var proto = this.getProto();

        if (!proto) {
            return false;
        }

        if (defaultValue && Array.isArray(defaultValue)) {
            var collection = this.getCollection();

            for (var propName in defaultValue) {
                if (!defaultValue.hasOwnProperty(propName)) {
                    continue;
                }
                if (!this.isWritable()) {
                    proto.writable = false;
                }
                collection.addItem(defaultValue[propName]);
            }
        }
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.validatePropertyDefinition = function()
    {
        ArrayCollectionType.$parent.prototype.validatePropertyDefinition.call(this);

        var defaultValue = this.getDefaultValue();

        if (
            defaultValue !== null
            && !Array.isArray(defaultValue)
        ) {
            throw new Error('Specified not valid default value for property "' + this.getPropertyName() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();