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

    InterfaceBuilder.prototype.setProperties = undefined;

    InterfaceBuilder.prototype.addProperties = undefined;

    InterfaceBuilder.prototype.getProperties = undefined;

    InterfaceBuilder.prototype.removeProperty = undefined;

    InterfaceBuilder.prototype.setStatic = undefined;

    InterfaceBuilder.prototype.getStatic = undefined;

    InterfaceBuilder.prototype.setStaticProperty = undefined;

    InterfaceBuilder.prototype.removeStaticProperty = undefined;

    return InterfaceBuilder;

})();