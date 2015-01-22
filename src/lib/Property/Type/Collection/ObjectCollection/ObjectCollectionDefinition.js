/**
 * @class
 * @extends {Subclass.Property.Collection.CollectionDefinition}
 */
Subclass.Property.Collection.ObjectCollection.ObjectCollectionDefinition = (function()
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

    ObjectCollectionDefinition.$parent = Subclass.Property.Collection.CollectionDefinition;

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
            Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                'a plain object'
            );
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionDefinition.prototype.processData = function()
    {
        var defaultValue = this.getDefault();
        var proto = this.getProto();

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
