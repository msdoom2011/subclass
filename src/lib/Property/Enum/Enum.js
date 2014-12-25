/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Enum = (function()
{
    /*************************************************/
    /*       Describing property type "Enum"         */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function EnumType(propertyManager, propertyName, propertyDefinition)
    {
        EnumType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    EnumType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    EnumType.getPropertyTypeName = function()
    {
        return "enum";
    };

    /**
     * @inheritDoc
     */
    EnumType.isAllowedValue = function(value)
    {
        return ['boolean', 'string', 'number'].indexOf(typeof value) >= 0;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.EnumDefinition;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.isEmpty = function(context)
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.validate = function(value)
    {
        if (EnumType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        var allows = this.getPropertyDefinition().getAllows();

        if (allows.indexOf(value) < 0) {
            var message = 'The value of the property ' + this + ' is not valid ' +
                'and must be one of the specified values [' + allows.join(", ") + ']. ';

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

    Subclass.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

})();