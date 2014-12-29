/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassType}
 */
Subclass.ClassManager.ClassTypes.Trait = (function()
{
    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Trait(classManager, className, classDefinition)
    {
        Trait.$parent.call(this, classManager, className, classDefinition);
    }

    Trait.$parent = Subclass.ClassManager.ClassTypes.ClassType;

    /**
     * @inheritDoc
     */
    Trait.getClassTypeName = function ()
    {
        return "Trait";
    };

    /**
     * @inheritDoc
     */
    Trait.getClassBuilderClass = function()
    {
        return Subclass.ClassManager.ClassTypes.Trait.Builder;
    };

    /**
     * @inheritDoc
     */
    Trait.getClassDefinitionClass = function()
    {
        return Subclass.ClassManager.ClassTypes.Interface.InterfaceDefinition;
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.setClassParent = function (parentClassName)
    {
        Trait.$parent.prototype.setClassParent.call(this, parentClassName);

        if (
            this._classParent
            && this._classParent.constructor != Trait
            && !(this._classParent instanceof Trait)
        ) {
            throw new Error('Trait "' + this.getClassName() + '" can be inherited only from the another trait.');
        }
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.getClassProperties = function()
    {
        var properties = {};

        if (this.getClassParent()) {
            var parentClass = this.getClassParent();
            var parentProperties = parentClass.getClassProperties();
            properties = Subclass.Tools.extend({}, parentProperties);
        }
        return Subclass.Tools.extend(properties, this._classProperties);
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.attachClassProperties = function() {};

    /**
     * @inheritDoc
     */
    Trait.prototype.getClassConstructorEmpty = function ()
    {
        return function Trait(){};
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Trait);

    return Trait;

})();