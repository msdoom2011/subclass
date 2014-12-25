/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Number = (function()
{
    /*************************************************/
    /*      Describing property type "Number"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function NumberType(propertyManager, propertyName, propertyDefinition)
    {
        NumberType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    NumberType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    NumberType.getPropertyTypeName = function()
    {
        return "number";
    };

    /**
     * @inheritDoc
     */
    NumberType.isAllowedValue = function(value)
    {
        return typeof value == 'number';
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.NumberDefinition;
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validate = function(value)
    {
        if (NumberType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        var propertyDefinition = this.getPropertyDefinition();
        var minValue = propertyDefinition.getMinValue();
        var maxValue = propertyDefinition.getMaxValue();
        var error = false;

        if (typeof value != 'number') {
            error = true;
        }
        if (!error && value !== null && minValue !== null && value < minValue) {
            throw new Error('The value of the property ' + this + ' is too small ' +
                'and must be more or equals number ' + minValue + ".");
        }
        if (!error && value !== null && maxValue !== null && value > maxValue) {
            throw new Error('The value of the property ' + this + ' is too big ' +
                'and must be less or equals number ' + maxValue + ".");
        }

        if (error) {
            var message = 'The value of the property ' + this + ' must be a number. ';

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

    Subclass.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();