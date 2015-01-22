/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Trait.TraitBuilder = (function()
{
    function TraitBuilder(classManager, classType, className)
    {
        TraitBuilder.$parent.call(this, classManager, classType, className);
    }

    TraitBuilder.$parent = Subclass.Class.ClassBuilder;

    TraitBuilder.prototype.setStatic = undefined;

    TraitBuilder.prototype.getStatic = undefined;

    TraitBuilder.prototype.setStaticProperty = undefined;

    TraitBuilder.prototype.removeStaticProperty = undefined;

    return TraitBuilder;

})();