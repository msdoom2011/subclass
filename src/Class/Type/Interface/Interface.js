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

    Interface.prototype = {

        /**
         * @inheritDoc
         */
        setParent: function (parentClassName)
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
        },

        /**
         * @inheritDoc
         */
        getConstructorEmpty: function ()
        {
            return function Interface(){

                // Hook for the grunt-contrib-uglify plugin
                return Interface.name;
            };
        },

        createInstance: undefined
    };


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerType(Interface);

    return Interface;

})();

