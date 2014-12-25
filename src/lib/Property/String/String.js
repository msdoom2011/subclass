/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.String = (function()
{
    /*************************************************/
    /*      Describing property type "String"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function StringType(propertyManager, propertyName, propertyDefinition)
    {
        StringType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    StringType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    StringType.getPropertyTypeName = function()
    {
        return "string";
    };

    /**
     * @inheritDoc
     */
    StringType.isAllowedValue = function(value)
    {
        return typeof value == 'string';
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.StringDefinition;
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.validate = function(value)
    {
        if (StringType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        var propertyDefinition = this.getPropertyDefinition();
        var pattern = propertyDefinition.getPattern();
        var minLength = propertyDefinition.getMinLength();
        var maxLength = propertyDefinition.getMaxLength();
        var error = false;

        if (typeof value != 'string') {
            error = true;
        }
        if (!error && value !== null && pattern && !pattern.test(value)) {
            throw new Error('The value of the property ' + this + ' is not valid ' +
                'and must match regular expression "' + pattern.toString() + '".');
        }
        if (!error && value !== null && minLength !== null && value.length < minLength) {
            throw new Error('The value of the property ' + this + ' is too short ' +
                'and must consist of at least ' + minLength + ' symbols.');
        }
        if (!error && value !== null && maxLength !== null && value.length > maxLength) {
            throw new Error('The value of the property "' + this + '" is too long ' +
                'and must be not longer than ' + maxLength + ' symbols.');
        }
        if (error) {
            var message = 'The value of the property ' + this + ' must be a string. ';

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

    Subclass.PropertyManager.registerPropertyType(StringType);

    return StringType;

})();