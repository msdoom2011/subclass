/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Interface.InterfaceBuilder = (function()
{
    function InterfaceBuilder(classManager, classType, className)
    {
        InterfaceBuilder.$parent.call(this, classManager, classType, className);
    }

    InterfaceBuilder.$parent = Subclass.Class.ClassBuilder;

    //if (InterfaceBuilder.$parent && InterfaceBuilder.$parent.addStaticMethods) {
    //    InterfaceBuilder.$parent.addStaticMethods.call(InterfaceBuilder);
    //}

    InterfaceBuilder.prototype.setConstructor = undefined;

    InterfaceBuilder.prototype.getConstructor = undefined;

    InterfaceBuilder.prototype.removeConstructor = undefined;

    //InterfaceBuilder.prototype.setProperties = undefined;
    //
    //InterfaceBuilder.prototype.addProperties = undefined;
    //
    //InterfaceBuilder.prototype.getProperties = undefined;
    //
    //InterfaceBuilder.prototype.removeProperty = undefined;
    //
    //InterfaceBuilder.prototype.setStatic = undefined;
    //
    //InterfaceBuilder.prototype.getStatic = undefined;
    //
    //InterfaceBuilder.prototype.setStaticProperty = undefined;
    //
    //InterfaceBuilder.prototype.removeStaticProperty = undefined;

    return InterfaceBuilder;

})();