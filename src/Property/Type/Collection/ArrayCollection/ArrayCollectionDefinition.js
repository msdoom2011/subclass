/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionDefinition}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionDefinition = (function()
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

    ArrayCollectionDefinition.$parent = Subclass.Property.Type.Collection.CollectionDefinition;

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
        ArrayCollectionDefinition.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }

        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('an array')
                .apply()
            ;
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
