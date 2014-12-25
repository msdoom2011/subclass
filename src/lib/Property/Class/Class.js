/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.Class = (function()
{
    /*************************************************/
    /*      Describing property type "Class"         */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function ClassType(propertyManager, propertyName, propertyDefinition)
    {
        ClassType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    ClassType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    ClassType.getPropertyTypeName = function()
    {
        return "class";
    };

    /**
     * @inheritDoc
     */
    ClassType.isAllowedValue = function(value)
    {
        return typeof value == 'string';
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.validate = function(value)
    {
        if (ClassType.$parent.prototype.validate.call(this, value)) {
            return;
        }

        var neededClassName = this.getPropertyDefinition().getClassName();

        if (
            !value
            || typeof value != 'object'
            || (
                value
                && typeof value == 'object'
                && (
                    !value.$_className
                    || !value.isInstanceOf(neededClassName)
                )
            )
        ) {
            var message = 'The value of the property ' + this + ' must be ' +
                'an instance of class "' + neededClassName + '" or null. ';

            if (typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (typeof value == 'object') {
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

    Subclass.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();