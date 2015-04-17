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

    InterfaceBuilder.prototype.setConstructor = undefined;

    InterfaceBuilder.prototype.getConstructor = undefined;

    InterfaceBuilder.prototype.removeConstructor = undefined;

    /******************************************************************/
    /********************** SUBCLASS PROPERTY *************************/
    /******************************************************************/
    //
    //InterfaceBuilder.prototype.setProperties = undefined;
    //
    //InterfaceBuilder.prototype.addProperties = undefined;
    //
    //InterfaceBuilder.prototype.getProperties = undefined;
    //
    //InterfaceBuilder.prototype.removeProperty = undefined;
    //
    /******************************************************************/
    /********************** SUBCLASS PROPERTY *************************/
    /******************************************************************/

    return InterfaceBuilder;

})();