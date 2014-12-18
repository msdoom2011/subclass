; Subclass.PropertyManager.PropertyTypes.Array = (function()
{
    /*************************************************/
    /*       Describing property type "Array"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function ArrayType(propertyManager, propertyName, propertyDefinition)
    {
        ArrayType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ArrayType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    ArrayType.getPropertyTypeName = function()
    {
        return "array";
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.validate = function(value)
    {
        if (value !== null && !Array.isArray(value)) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be an array' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : '') + '. ';

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(ArrayType);

    return ArrayType;

})();