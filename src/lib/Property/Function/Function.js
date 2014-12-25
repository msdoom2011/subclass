Subclass.PropertyManager.PropertyTypes.Function = (function()
{
    /*************************************************/
    /*      Describing property type "Function"      */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function FunctionType(propertyManager, propertyName, propertyDefinition)
    {
        FunctionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    FunctionType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    FunctionType.getPropertyTypeName = function()
    {
        return "function";
    };

    /**
     * @inheritDoc
     */
    FunctionType.isAllowedValue = function(value)
    {
        return typeof value == 'function';
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.FunctionDefinition;
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validate = function(value)
    {
        if (FunctionType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        if (typeof value != 'function') {
            var message = 'The value of the property ' + this + ' must be a function. ';

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

    Subclass.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();