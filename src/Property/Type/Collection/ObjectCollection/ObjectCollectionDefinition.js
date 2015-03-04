/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionDefinition}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionDefinition = (function()
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

    ObjectCollectionDefinition.$parent = Subclass.Property.Type.Collection.CollectionDefinition;

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ObjectCollectionDefinition.prototype.validateValue = function(value)
    {
        ObjectCollectionDefinition.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }

        if (!value || typeof value != 'object' || !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionDefinition.prototype.processData = function()
    {
        var propertyManager = this.getProperty().getPropertyManager();
        var proto = propertyManager.normalizePropertyDefinition(this.getProto());

        // Adding "extends" parameter to property "schema"
        // parameter if proto type is "map"

        if (proto.type == 'map') {
            if (!proto.schema) {
                proto.schema = {};
            }
            if (!proto.schema.extends) {
                proto.schema.extends = {
                    type: "string",
                    nullable: true
                };
            }
        }
        ObjectCollectionDefinition.$parent.prototype.processData.call(this);
    };

    return ObjectCollectionDefinition;

})();
