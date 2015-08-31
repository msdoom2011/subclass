/**
 * @class
 * @constructor
 */
Subclass.Class.Type.AbstractClass.Extension.ClassExtension = function()
{
    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var interfaceClassExtension = Subclass.Class.Type.Interface.Extension.ClassExtension;
            interfaceClassExtension = Subclass.Tools.buildClassConstructor(interfaceClassExtension);
            interfaceClassExtension.getConfig().classes.push('AbstractClass');
        }
        if (Subclass.ClassManager.issetType('Trait')) {
            var traitClassExtension = Subclass.Class.Type.Trait.Extension.ClassExtension;
            traitClassExtension = Subclass.Tools.buildClassConstructor(traitClassExtension);
            traitClassExtension.getConfig().classes.push('AbstractClass');
        }
    });

    return ClassExtension;
}();
