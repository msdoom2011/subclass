/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Collection.CollectionDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function CollectionDefinition (property, propertyDefinition)
    {
        CollectionDefinition.$parent.call(this, property, propertyDefinition);
    }

    CollectionDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    CollectionDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };

    /**
     * Validates "proto" attribute value
     *
     * @param {*} proto
     */
    CollectionDefinition.prototype.validateProto = function(proto)
    {
        if (!proto || typeof proto != 'object') {
            this._throwInvalidAttribute('proto', 'an object');
        }
    };

    /**
     * Sets property proto
     *
     * @param {(Function|null)} proto
     */
    CollectionDefinition.prototype.setProto = function(proto)
    {
        this.validateProto(proto);
        this.getData().proto = proto;

        var property = this.getProperty();
        var propertyManager = property.getPropertyManager();

        property.setProto(propertyManager.createProperty(
            'collectionItem',
            proto,
            property.getContextClass(),
            property
        ));
    };

    /**
     * Returns proto function or null
     *
     * @returns {(Function|null)}
     */
    CollectionDefinition.prototype.getProto = function()
    {
        return this.getData().proto;
    };

    /**
     * @inheritDoc
     */
    CollectionDefinition.prototype.getBaseData = function()
    {
        var baseDefinition = CollectionDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Property definition which every collection element must match.
         * @type {null}
         */
        baseDefinition.proto = null;

        return baseDefinition;
    };

    /**
     * @inheritDoc
     */
    CollectionDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = CollectionDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['proto']);
    };

    return CollectionDefinition;

})();
