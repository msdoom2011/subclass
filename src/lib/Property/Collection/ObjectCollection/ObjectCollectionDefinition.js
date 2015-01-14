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
        if (ObjectCollectionDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        if (!value || typeof value != 'object' || !Subclass.Tools.isPlainObject(value)) {
            var message = 'The value of the property ' + this.getProperty() + ' must be a plain object or null. ';

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
