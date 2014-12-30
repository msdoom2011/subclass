/**
 * @namespace
 */
Subclass.Class.AbstractClass = {};

/**
 * @class
 * @extends {Subclass.Class.Class.Class}
 */
Subclass.Class.AbstractClass.AbstractClass = (function() {

    /*************************************************/
    /*     Describing class type "AbstractClass"     */
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
     * @type {Subclass.Class.Class.Class}
     */
    AbstractClass.$parent = Subclass.Class.Class.Class;

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
        return Subclass.Class.AbstractClass.AbstractClassBuilder;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getClassDefinitionClass = function()
    {
        return Subclass.Class.AbstractClass.AbstractClassDefinition;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.setClassParent = function (parentClassName)
    {
        Subclass.Class.ClassType.prototype.setClassParent.call(this, parentClassName);

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

    Subclass.Class.ClassManager.registerClassType(AbstractClass);

    return AbstractClass;

})();