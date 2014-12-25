/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionDefinition}
 */
Subclass.PropertyManager.PropertyTypes.ArrayCollectionDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ArrayCollectionDefinition (property, propertyDefinition)
    {
        ArrayCollectionDefinition.$parent.call(this, property, propertyDefinition);
    }

    ArrayCollectionDefinition.$parent = Subclass.PropertyManager.PropertyTypes.CollectionDefinition;

    /**
     * @inheritDoc
     */
    ArrayCollectionDefinition.prototype.processDefinition = function()
    {
        ArrayCollectionDefinition.$parent.prototype.processDefinition.call(this);

        var defaultValue = this.getValue();

        if (defaultValue !== null) {
            var collection = this.getProperty().getCollection();
            var proto = this.getProto();

            this.getProperty().setIsNull(false);

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

    return ArrayCollectionDefinition;

})();
