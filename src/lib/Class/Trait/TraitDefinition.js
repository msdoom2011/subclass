/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassDefinition}
 */
Subclass.ClassManager.ClassTypes.Interface.TraitDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function TraitDefinition(classInst, classDefinition)
    {
        TraitDefinition.$parent.call(this, classInst, classDefinition);
    }

    TraitDefinition.$parent = Subclass.ClassManager.ClassTypes.ClassDefinition;

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateAbstract = function(value)
    {
        throw new Error(
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
        throw new Error('Trait "' + this.getClass().getClassName() + '" can\'t implements any interfaces.');
    };

    /**
     * Validate "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateStatic = function(value)
    {
        throw new Error('You can\'t specify any static properties or methods in trait.');
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    TraitDefinition.prototype.validateTraits = function(value)
    {
        throw new Error(
            'Trait "' + this.getClassName() + '" can\'t contains another traits. ' +
            'You can extend this one from another trait instead.'
        );
    };

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.getBaseDefinition = function()
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