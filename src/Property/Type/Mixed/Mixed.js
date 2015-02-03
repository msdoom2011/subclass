/**
 * @namespace
 */
Subclass.Property.Mixed = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Mixed.Mixed = (function()
{
    /*************************************************/
    /*       Describing property type "Mixed"        */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function MixedType(propertyManager, propertyName, propertyDefinition)
    {
        MixedType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
        this._allowedTypes = [];
    }

    MixedType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    MixedType.getPropertyTypeName = function()
    {
        return "mixed";
    };

    /**
     * @inheritDoc
     */
    MixedType.isAllowedValue = function(value)
    {
        return typeof value == 'boolean';
    };

    /**
     * @inheritDoc
     */
    MixedType.getDefinitionClass = function()
    {
        return Subclass.Property.Mixed.MixedDefinition;
    };

    /**
     * @inheritDoc
     */
    MixedType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * Returns property instances according to allows parameter of property definition.
     *
     * @returns {PropertyType[]}
     */
    MixedType.prototype.getAllowedTypes = function()
    {
        return this._allowedTypes;
    };

    /**
     * Adds new allowed type that property can holds
     *
     * @param typeDefinition
     */
    MixedType.prototype.addAllowedType = function(typeDefinition)
    {
        this._allowedTypes.push(this.getPropertyManager().createProperty(
            "mixedProperty",
            typeDefinition,
            this.getContextClass(),
            this.getContextProperty()
        ));
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MixedType);

    return MixedType;

})();