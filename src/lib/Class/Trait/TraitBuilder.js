; Subclass.ClassManager.ClassTypes.Trait.Builder = (function()
{
    function TraitBuilder(classManager, classType, className)
    {
        TraitBuilder.$parent.call(this, classManager, classType, className);
    }

    TraitBuilder.$parent = Subclass.ClassManager.ClassTypes.ClassType.Builder;

    TraitBuilder.prototype.setStatic = undefined;

    TraitBuilder.prototype.getStatic = undefined;

    TraitBuilder.prototype.setStaticProperty = undefined;

    TraitBuilder.prototype.removeStaticProperty = undefined;

    return TraitBuilder;

})();