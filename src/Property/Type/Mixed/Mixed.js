/**
 * @namespace
 */
Subclass.Property.Type.Mixed = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Mixed.Mixed = (function()
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
    MixedType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Mixed.MixedDefinition;
    };

    /**
     * @inheritDoc
     */
    MixedType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    MixedType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.allows = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
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