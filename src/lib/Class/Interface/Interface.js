; Subclass.ClassManager.ClassTypes.Interface = (function()
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
    Interface.getClassBuilder = function()
    {
        return Subclass.ClassManager.ClassTypes.Interface.Builder;
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
            throw new Error('Interface "' + this.getClassName() + '" can be inherited ' +
                'only from the another interface.');
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
            classDefinition.$_properties
        );
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.setStaticProperties = function(staticProperties)
    {
        console.warn('Interface hasn\'t implementation of method "setStaticProperties".');
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
     * @throws {Error}
     */
    Interface.prototype.createInstance = function ()
    {
        throw new Error('You can\'t create instance of interface "' + this.getClassName() + '".');
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.getBaseClassDefinition = function ()
    {
        return {
            /**
             * @type {string} Parent class name
             */
            $_extends: null,

            /**
             * @type {Object.<Object>} Typed property definitions
             */
            $_properties: {}
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Interface.prototype.validateClassDefinition = function ()
    {
        Subclass.ClassManager.ClassTypes.ClassType.prototype.validateClassDefinition.call(this);

        var classDefinition = this.getClassDefinition();

        // Parsing class properties

        if (classDefinition.$_properties) {
            for (var propName in classDefinition.$_properties) {
                if (!classDefinition.$_properties.hasOwnProperty(propName)) {
                    continue;
                }
                var propertyDefinition = classDefinition.$_properties[propName];

                if (!propertyDefinition.hasOwnProperty('writable') || propertyDefinition.writable) {
                    throw new Error('Every typed property in interface must be marked as not writable.');
                }
            }
        }

        // Parsing interfaces

        if (classDefinition.$_implements) {
            throw new Error('Interface "' + this.getClassName() + '" can\'t implements any interfaces.' +
            ' You can extend this one from another interface instead.');
        }

        // Parsing abstract classes

        if (classDefinition.$_abstract) {
            throw new Error('You can\'t specify abstract method by the property "$_abstract".' +
            ' All methods specified in interface are abstract by default.');
        }

        // Parsing static properties and methods

        if (classDefinition.$_static) {
            throw new Error('You can\'t specify any static properties or methods in interface.');
        }

        // Parsing traits

        if (Subclass.ClassManager.issetClassType('Trait')) {
            if (classDefinition.$_traits) {
                throw new Error('Interface "' + this.getClassName() + '" can\'t contains any traits.');
            }
        }
    };

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Interface);

    return Interface;

})();

