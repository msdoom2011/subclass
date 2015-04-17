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

    TraitDefinition.$parent = Subclass.Class.Type.Class.ClassDefinition;

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