/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassType}
 */
Subclass.ClassManager.ClassTypes.Interface = (function()
{
    /*************************************************/
    /*       Describing class type "Interface"       */
    /*************************************************/

    /**
     * @param {ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Interface(classManager, className, classDefinition)
    {
        Interface.$parent.call(this, classManager, className, classDefinition);
    }

    Interface.$parent = Subclass.ClassManager.ClassTypes.ClassType;

    /**
     * @inheritDoc
     */
    Interface.getClassTypeName = function ()
    {
        return "Interface";
    };

    /**
     * @inheritDoc
     */
    Interface.getClassBuilderClass = function()
    {
        return Subclass.ClassManager.ClassTypes.Interface.Builder;
    };

    /**
     * @inheritDoc
     */
    Interface.getClassDefinitionClass = function()
    {
        return Subclass.ClassManager.ClassTypes.Interface.InterfaceDefinition;
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.setClassParent = function (parentClassName)
    {
        Interface.$parent.prototype.setClassParent.call(this, parentClassName);

        if (
            this._classParent
            && this._classParent.constructor != Interface
            && !(this._classParent instanceof Interface)
        ) {
            throw new Error(
                'Interface "' + this.getClassName() + '" can be inherited ' +
                'only from the another interface.'
            );
        }
    };

    Interface.prototype.getClassDefinitionProperties = function()
    {
        var classDefinition = this.getClassDefinition();
        var classProperties = {};

        if (this.getClassParent()) {
            classProperties = this.getClassParent().getClassDefinitionProperties();
        }
        return Subclass.Tools.extend(
            classProperties,
            classDefinition.getProperties()
        );
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.getClassConstructorEmpty = function ()
    {
        return function Interface(){};
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.attachClassProperties = function() {};

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Interface.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Interface);

    return Interface;

})();

