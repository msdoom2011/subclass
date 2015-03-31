/**
 * @namespace
 */
Subclass.Class.Type.AbstractClass = {};

/**
 * @class
 * @extends {Subclass.Class.Type.Class.Class}
 */
Subclass.Class.Type.AbstractClass.AbstractClass = (function() {

    /*************************************************/
    /*     Describing class type "AbstractClass"     */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
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
     * @type {Subclass.Class.Type.Class.Class}
     */
    AbstractClass.$parent = Subclass.Class.Type.Class.Class;

    //if (AbstractClass.$parent && AbstractClass.$parent.addStaticMethods) {
    //    AbstractClass.$parent.addStaticMethods.call(AbstractClass);
    //}

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
        return Subclass.Class.Type.AbstractClass.AbstractClassBuilder;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getDefinitionClass = function()
    {
        return Subclass.Class.Type.AbstractClass.AbstractClassDefinition;
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
            Subclass.Error.create(
                'The abstract class "' + this.getName() + '" can be ' +
                'inherited only from the another abstract class.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.getConstructorEmpty = function ()
    {
        return function AbstractClass(){

            // Hook for the grunt-contrib-uglify plugin
            return AbstractClass.name;
        };
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