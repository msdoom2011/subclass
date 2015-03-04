/**
 * @namespace
 */
Subclass.Property.Type.Boolean = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Boolean.Boolean = (function()
{
    /*************************************************/
    /*      Describing property type "Boolean"       */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
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

    BooleanType.$parent = Subclass.Property.PropertyType;

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
    BooleanType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Boolean.BooleanDefinition;
    };

    /**
     * @inheritDoc
     */
    BooleanType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition.call(this);
    };

    /**
     * @inheritDoc
     */
    BooleanType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition.call(this, definition);
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.attachAccessors = function(context)
    {
        BooleanType.$parent.prototype.attachAccessors.call(this, context);

        var propertyName = this.getName();
        var getterName = Subclass.Tools.generateGetterName(propertyName);
        var checkerName = Subclass.Tools.generateCheckerName(propertyName);

        context[checkerName] = context[getterName];
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(BooleanType);

    return BooleanType;

})();