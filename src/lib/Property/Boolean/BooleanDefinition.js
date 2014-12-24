/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.BooleanDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function BooleanDefinition (property, propertyDefinition)
    {
        BooleanDefinition.$parent.call(this, property, propertyDefinition);
    }

    BooleanDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    BooleanDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : false;
    };

    return BooleanDefinition;

})();
