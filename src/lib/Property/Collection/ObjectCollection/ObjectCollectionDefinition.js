/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionDefinition}
 */
Subclass.PropertyManager.PropertyTypes.ObjectCollectionDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ObjectCollectionDefinition (property, propertyDefinition)
    {
        ObjectCollectionDefinition.$parent.call(this, property, propertyDefinition);
    }

    ObjectCollectionDefinition.$parent = Subclass.PropertyManager.PropertyTypes.CollectionDefinition;

    /**
     * @inheritDoc
     */
    ObjectCollectionDefinition.prototype.processDefinition = function()
    {
        ObjectCollectionDefinition.$parent.prototype.processDefinition.call(this);

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
                collection.addItem(
                    propName,
                    defaultValue[propName]
                );
            }
        }
    };

    return ObjectCollectionDefinition;

})();
