/**
 * @namespace
 */
Subclass.Class.Type.Interface = {};

/**
 * @namespace
 */
Subclass.Class.Type.Interface.Extension = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Interface.Interface = (function()
{
    /*************************************************/
    /*       Describing class type "Interface"       */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
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
        return Subclass.Class.Type.Interface.InterfaceBuilder;
    };

    /**
     * @inheritDoc
     */
    Interface.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Interface.InterfaceDefinition;
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
    //
    //Interface.prototype.getClassDefinitionProperties = function()
    //{
    //    var classDefinition = this.getDefinition();
    //    var classProperties = {};
    //
    //    if (this.hasParent()) {
    //        classProperties = this.getParent().getClassDefinitionProperties();
    //    }
    //    return Subclass.Tools.extend(
    //        classProperties,
    //        classDefinition.getProperties()
    //    );
    //};

    /**
     * @inheritDoc
     */
    Interface.prototype.getConstructorEmpty = function ()
    {
        return function Interface(){

            // Hook for the grunt-contrib-uglify plugin
            return Interface.name;
        };
    };
    //
    ///**
    // * @inheritDoc
    // */
    //Interface.prototype.attachProperties = function() {};

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

