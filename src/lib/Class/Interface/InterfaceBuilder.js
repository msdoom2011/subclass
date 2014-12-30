/**
 * @class
 * @extends {Subclass.Class.ClassTypeBuilder}
 */
Subclass.Class.Interface.InterfaceBuilder = (function()
{
    function InterfaceBuilder(classManager, classType, className)
    {
        InterfaceBuilder.$parent.call(this, classManager, classType, className);
    }

    InterfaceBuilder.$parent = Subclass.Class.ClassTypeBuilder;

    InterfaceBuilder.prototype.setClassProperties = undefined;

    InterfaceBuilder.prototype.addClassProperties = undefined;

    InterfaceBuilder.prototype.getClassProperties = undefined;

    InterfaceBuilder.prototype.removeClassProperty = undefined;

    InterfaceBuilder.prototype.setStatic = undefined;

    InterfaceBuilder.prototype.getStatic = undefined;

    InterfaceBuilder.prototype.setStaticProperty = undefined;

    InterfaceBuilder.prototype.removeStaticProperty = undefined;

    return InterfaceBuilder;

})();