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
        TraitDefinition.$parent.apply(this, arguments);
    }

    TraitDefinition.$parent = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.validateFinal = function(isFinal)
    {
        Subclass.Error.create(
            'Trait class definition cannot contain $_final option ' +
            'and consequently can\'t be final.'
        )
    };

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.createBaseData = function()
    {
        return {

            /**
             * The name of parent class
             *
             * @type {string}
             */
            $_extends: null
        };
    };

    return TraitDefinition;

})();