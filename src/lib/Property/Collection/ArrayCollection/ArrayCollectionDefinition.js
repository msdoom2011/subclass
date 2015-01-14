/**
 * @class
 * @extends {Subclass.Property.Collection.CollectionDefinition}
 */
Subclass.Property.Collection.ArrayCollection.ArrayCollectionDefinition = (function()
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

    ArrayCollectionDefinition.$parent = Subclass.Property.Collection.CollectionDefinition;

    /**
     * @inheritDoc
     */
    ArrayCollectionDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : [];
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ArrayCollectionDefinition.prototype.validateValue = function(value)
    {
        if (ArrayCollectionDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            var message = 'The value of the property ' + this.getProperty() + ' must be an array or null. ';

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
    ArrayCollectionDefinition.prototype.getBaseData = function()
    {
        var baseDefinition = ArrayCollectionDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Default property value
         * @type {null}
         */
        baseDefinition.default = [];

        return baseDefinition;
    };

    return ArrayCollectionDefinition;

})();
