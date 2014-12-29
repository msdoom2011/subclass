/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.Class}
 */
Subclass.ClassManager.ClassTypes.AbstractClass = (function() {

    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {Class}
     * @constructor
     */
    function AbstractClass(classManager, className, classDefinition)
    {
        AbstractClass.$parent.call(this, classManager, className, classDefinition);
    }

    /**
     * @type {Class}
     */
    AbstractClass.$parent = Subclass.ClassManager.ClassTypes.Class;

    /**
     * @inheritDoc
     */
    AbstractClass.getClassTypeName = function ()
    {
        return "AbstractClass";
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getClassBuilderClass = function()
    {
        return Subclass.ClassManager.ClassTypes.AbstractClass.Builder;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getClassDefinitionClass = function()
    {
        return Subclass.ClassManager.ClassTypes.AbstractClass.AbstractClassDefinition;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.setClassParent = function (parentClassName)
    {
        Subclass.ClassManager.ClassTypes.ClassType.prototype.setClassParent.call(this, parentClassName);

        if (
            this._classParent
            && this._classParent.constructor != AbstractClass
            && !(this._classParent instanceof AbstractClass)
        ) {
            throw new Error('Abstract class "' + this.getClassName() + '" can be inherited only from the another abstract class.');
        }
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.getClassConstructorEmpty = function ()
    {
        return function AbstractClass(){};
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    AbstractClass.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(AbstractClass);

    return AbstractClass;

})();