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
     * @param {Subclass.Class.ClassManager} classManager
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
    AbstractClass.getBuilderClass = function()
    {
        return Subclass.Class.AbstractClass.AbstractClassBuilder;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getDefinitionClass = function()
    {
        return Subclass.Class.AbstractClass.AbstractClassDefinition;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.setParent = function (parentClassName)
    {
        Subclass.Class.ClassType.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != AbstractClass
            && !(this._parent instanceof AbstractClass)
        ) {
            throw new Error('The abstract class "' + this.getName() + '" can be inherited only from the another abstract class.');
        }
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.getConstructorEmpty = function ()
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