Subclass.PropertyManager.PropertyTypes.Boolean = (function()
{
    /*************************************************/
    /*      Describing property type "Boolean"       */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function BooleanType(propertyManager, propertyName, propertyDefinition)
    {
        BooleanType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    BooleanType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    BooleanType.getPropertyTypeName = function()
    {
        return "boolean";
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.validate = function(value)
    {
        if (typeof value != 'boolean') {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be a boolean' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : '') + '. ';

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

    /**
     * @inheritDoc
     */
    BooleanType.prototype.getBasePropertyDefinition = function()
    {
        var basePropertyDefinition = BooleanType.$parent.prototype.getBasePropertyDefinition.call(this);

        basePropertyDefinition.value = false;

        return basePropertyDefinition;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(BooleanType);

    return BooleanType;

})();