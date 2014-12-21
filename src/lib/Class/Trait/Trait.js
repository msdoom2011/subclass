; Subclass.ClassManager.ClassTypes.Trait = (function()
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
    Trait.getClassBuilder = function()
    {
        return Subclass.ClassManager.ClassTypes.Trait.Builder;
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

    Trait.prototype.getClassProperties = function()
    {
        var properties = {};

        if (this.getClassParent()) {
            var parentClass = this.getClassParent();
            properties = Subclass.Tools.extend({}, parentClass.getClassProperties());
        }
        return Subclass.Tools.extend(properties, this._classProperties);
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.getClassConstructorEmpty = function ()
    {
        return function Trait(){};
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Trait.prototype.createInstance = function ()
    {
        throw new Error('You can\'t create instance of trait "' + this.getClassName() + '".');
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Trait.prototype.getBaseClassDefinition = function ()
    {
        return {

            /**
             * @type {string} Parent class name
             */
            $_extends: null
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Trait.prototype.validateClassDefinition = function ()
    {
        Subclass.ClassManager.ClassTypes.ClassType.prototype.validateClassDefinition.call(this);

        var classDefinition = this.getClassDefinition();

        // Parsing traits

        if (classDefinition.$_traits) {
            throw new Error('Trait "' + this.getClassName() + '" can\'t contains another traits.' +
                ' You can extend this one from another trait instead.');
        }

        // Parsing static properties and methods

        if (classDefinition.$_static) {
            throw new Error('You can\'t specify any static properties or methods in trait.');
        }

        // Parsing interfaces

        if (classDefinition.$_implements) {
            throw new Error('Trait "' + this.getClassName() + '" can\'t implements any interfaces.');
        }

        // Parsing abstract classes

        if (classDefinition.$_abstract) {
            throw new Error('Trait "' + this.getClassName() + '" can\'t define any abstract methods.');
        }
    };


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Trait);

    return Trait;

})();