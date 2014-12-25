/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Mixed = (function()
{
    /*************************************************/
    /*       Describing property type "Mixed"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
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

    MixedType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

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
    MixedType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.MixedDefinition;
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

    /**
     * @inheritDoc
     */
    MixedType.prototype.validate = function(value)
    {
        if (MixedType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        var propertyDefinition = this.getPropertyDefinition();
        var allowedTypes = this.getAllowedTypes();
        var error = true;

        for (var i = 0; i < allowedTypes.length; i++) {
            var allowedType = allowedTypes[i];

            try {
                allowedType.validate(value);
                error = false;
                break;

            } catch (e) {
                // Do nothing
            }
        }
        if (error) {
            var allowedTypeNames = propertyDefinition.getAllowsNames();

            var message = 'The value of the property ' + this + ' is not valid ' +
                'and must belongs to one of the specified types [' + allowedTypeNames.join(", ") + ']. ';

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'null value was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(MixedType);

    return MixedType;

})();