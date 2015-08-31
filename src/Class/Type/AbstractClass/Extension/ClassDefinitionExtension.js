/**
 * @class
 * @constructor
 */
Subclass.Class.Type.AbstractClass.Extension.ClassDefinitionExtension = function()
{
    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var interfaceClassDefinitionExtension = Subclass.Class.Type.Interface.Extension.ClassDefinitionExtension;
            interfaceClassDefinitionExtension = Subclass.Tools.buildClassConstructor(interfaceClassDefinitionExtension);
            interfaceClassDefinitionExtension.getConfig().classes.push('AbstractClass');
        }
        if (Subclass.ClassManager.issetType('Trait')) {
            var traitClassDefinitionExtension = Subclass.Class.Type.Trait.Extension.ClassDefinitionExtension;
            traitClassDefinitionExtension = Subclass.Tools.buildClassConstructor(traitClassDefinitionExtension);
            traitClassDefinitionExtension.getConfig().classes.push('AbstractClass');
        }
    });

    return ClassDefinitionExtension;
}();
