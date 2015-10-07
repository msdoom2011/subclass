/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Trait.TraitBuilder = (function()
{
    function TraitBuilder(classManager, classType, className)
    {
        TraitBuilder.$parent.call(this, classManager, classType, className);
    }

    TraitBuilder.$parent = Subclass.Class.ClassBuilder;

    TraitBuilder.prototype = {

        setFinal: undefined,

        getFinal: undefined,

        setStatic: undefined,

        getStatic: undefined,

        setStaticProperty: undefined,

        removeStaticProperty: undefined
    };

    return TraitBuilder;

})();