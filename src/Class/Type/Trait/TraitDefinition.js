/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Trait.TraitDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function TraitDefinition(classInst, classDefinition)
    {
        TraitDefinition.$parent.call(this, classInst, classDefinition);
    }

    TraitDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateAbstract = function(value)
    {
        Subclass.Error.create(
            'You can\'t specify abstract method by the property "$_abstract". ' +
            'All methods specified in interface are abstract by default.'
        );
    };

    /**
     * Validate "$_implements" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateImplements = function(value)
    {
        Subclass.Error.create(
            'The trait "' + this.getClass().getName() + '" ' +
            'can\'t implements any interfaces.'
        );
    };

    /**
     * Validate "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateStatic = function(value)
    {
        Subclass.Error.create(
            'You can\'t specify any static properties or methods in trait.'
        );
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateTraits = function(value)
    {
        Subclass.Error.create(
            'The trait "' + this.getName() + '" can\'t contains another traits. ' +
            'You can extend this one from another trait instead.'
        );
    };

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.getBaseData = function()
    {
        return {
            /**
             * @type {string} Parent class name
             */
            $_extends: null
        };
    };

    return TraitDefinition;

})();