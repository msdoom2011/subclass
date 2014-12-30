/**
 * @class
 * @extends {Subclass.Class.ClassTypeBuilder}
 */
Subclass.Class.Trait.TraitBuilder = (function()
{
    function TraitBuilder(classManager, classType, className)
    {
        TraitBuilder.$parent.call(this, classManager, classType, className);
    }

    TraitBuilder.$parent = Subclass.Class.ClassTypeBuilder;

    TraitBuilder.prototype.setStatic = undefined;

    TraitBuilder.prototype.getStatic = undefined;

    TraitBuilder.prototype.setStaticProperty = undefined;

    TraitBuilder.prototype.removeStaticProperty = undefined;

    return TraitBuilder;

})();