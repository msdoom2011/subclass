/**
 * @namespace
 */
Subclass.Class.Interface = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Interface.Interface = (function()
{
    /*************************************************/
    /*       Describing class type "Interface"       */
    /*************************************************/

    /**
     * @param {Subclass.Class.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Interface(classManager, className, classDefinition)
    {
        Interface.$parent.call(this, classManager, className, classDefinition);
    }

    Interface.$parent = Subclass.Class.ClassType;

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
    Interface.getBuilderClass = function()
    {
        return Subclass.Class.Interface.InterfaceBuilder;
    };

    /**
     * @inheritDoc
     */
    Interface.getDefinitionClass = function()
    {
        return Subclass.Class.Interface.InterfaceDefinition;
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.setParent = function (parentClassName)
    {
        Interface.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Interface
            && !(this._parent instanceof Interface)
        ) {
            Subclass.Error.create(
                'Interface "' + this.getName() + '" can be inherited ' +
                'only from the another interface.'
            );
        }
    };

    Interface.prototype.getClassDefinitionProperties = function()
    {
        var classDefinition = this.getDefinition();
        var classProperties = {};

        if (this.hasParent()) {
            classProperties = this.getParent().getClassDefinitionProperties();
        }
        return Subclass.Tools.extend(
            classProperties,
            classDefinition.getProperties()
        );
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.getConstructorEmpty = function ()
    {
        return function Interface(){};
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.attachProperties = function() {};

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Interface.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.Class.ClassManager.registerClassType(Interface);

    return Interface;

})();

