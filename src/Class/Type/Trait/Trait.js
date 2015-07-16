/**
 * @namespace
 */
Subclass.Class.Type.Trait = {};

/**
 * @namespace
 */
Subclass.Class.Type.Trait.Extension = {};

/**
 * @class
 * @extends {Subclass.Class.Type.Class.Class}
 */
Subclass.Class.Type.Trait.Trait = (function()
{
    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Trait(classManager, className, classDefinition)
    {
        Trait.$parent.call(this, classManager, className, classDefinition);

        delete this._abstractMethods;
        //delete this._constants;
        delete this._created;
        delete this._traits;

        if (Subclass.ClassManager.issetClassType('Interface')) {
            //delete this._interfaces;
            this.addInterfaces = undefined;
            this.getInterfaces = undefined;
            this.addInterface = undefined;
            this.isImplements = undefined;
        }
    }

    Trait.$parent = Subclass.Class.Type.Class.Class;

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
    Trait.getBuilderClass = function()
    {
        return Subclass.Class.Type.Trait.TraitBuilder;
    };

    /**
     * @inheritDoc
     */
    Trait.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Trait.TraitDefinition;
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.getConstructorEmpty = function ()
    {
        return function Trait() {

            // Hook for the grunt-contrib-uglify plugin
            return Trait.name;
        };
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.setParent = function (parentClassName)
    {
        Subclass.Class.ClassType.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Trait
            && !(this._parent instanceof Trait)
        ) {
            Subclass.Error.create(
                'The trait "' + this.getName() + '" can be ' +
                'inherited only from the another trait.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.createConstructor = function()
    {
        return Subclass.Class.ClassType.prototype.createConstructor.apply(this, arguments);
    };

    Trait.prototype.getAbstractMethods = undefined;

    Trait.prototype.addAbstractMethods = undefined;

    //Trait.prototype.addTraits = undefined;
    //
    //Trait.prototype.getTraits = undefined;
    //
    //Trait.prototype.addTrait = undefined;
    //
    //Trait.prototype.hasTrait = undefined;
    //
    //Trait.prototype.addInterfaces = undefined;
    //
    //Trait.prototype.getInterfaces = undefined;
    //
    //Trait.prototype.addInterface = undefined;
    //
    //Trait.prototype.isImplements = undefined;
    //
    //Trait.prototype.setConstants = undefined;
    //
    //Trait.prototype.setConstant = undefined;
    //
    //Trait.prototype.getConstants = undefined;

    /******************************************************************/
    /********************** SUBCLASS PROPERTY *************************/
    /******************************************************************/
    //
    ///**
    // * @inheritDoc
    // */
    //Trait.prototype.getProperties = function()
    //{
    //    var properties = {};
    //
    //    if (this.hasParent()) {
    //        var parentClass = this.getParent();
    //        var parentProperties = parentClass.getProperties();
    //        properties = Subclass.Tools.extend({}, parentProperties);
    //    }
    //    return Subclass.Tools.extend(
    //        properties,
    //        this._properties
    //    );
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //Trait.prototype.attachProperties = function() {};
    //
    /******************************************************************/
    /********************** SUBCLASS PROPERTY *************************/
    /******************************************************************/

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