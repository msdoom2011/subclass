/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Collection.CollectionDefinition = (function()
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('proto')
                .received(proto)
                .property(this.getProperty())
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * Sets property proto
     *
     * @param {(Function|null)} proto
     */
    CollectionDefinition.prototype.setProto = function(proto)
    {
        var property = this.getProperty();
        var propertyManager = property.getPropertyManager();
        proto = propertyManager.normalizePropertyDefinition(proto);

        this.validateProto(proto);
        this.getData().proto = proto;
        proto.accessors = false;

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
         * Default property value
         * @type {null}
         */
        baseDefinition.default = {};

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
