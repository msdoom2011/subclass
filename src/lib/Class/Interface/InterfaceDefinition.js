/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassDefinition}
 */
Subclass.ClassManager.ClassTypes.Interface.InterfaceDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function InterfaceDefinition(classInst, classDefinition)
    {
        InterfaceDefinition.$parent.call(this, classInst, classDefinition);
    }

    InterfaceDefinition.$parent = Subclass.ClassManager.ClassTypes.ClassDefinition;

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateAbstract = function(value)
    {
        throw new Error(
            'You can\'t specify abstract method by the property "$_abstract". ' +
            'All methods specified in interface are abstract by default.'
        );
    };

    /**
     * Validate "$_implements" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateImplements = function(value)
    {
        throw new Error(
            'Interface "' + this.getClass().getClassName() + '" can\'t implements any interfaces. ' +
            'You can extend this one from another interface instead.'
        );
    };

    /**
     * Validate "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateStatic = function(value)
    {
        throw new Error('You can\'t specify any static properties or methods in interface.');
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateTraits = function(value)
    {
        throw new Error('Interface "' + this.getClass().getClassName() + '" can\'t contains any traits.');
    };

    /**
     * @inheritDoc
     */
    InterfaceDefinition.prototype.getBaseDefinition = function()
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

    ///**
    // * @inheritDoc
    // * @throws {Error}
    // */
    //InterfaceDefinition.prototype.validateDefinition = function ()
    //{
    //    Subclass.ClassManager.ClassTypes.ClassType.prototype.validateDefinition.call(this);
    //
    //    var classDefinition = this.getClassDefinition();
    //
    //    // Parsing class properties
    //
    //    if (classDefinition.$_properties) {
    //        for (var propName in classDefinition.$_properties) {
    //            if (!classDefinition.$_properties.hasOwnProperty(propName)) {
    //                continue;
    //            }
    //            var propertyDefinition = classDefinition.$_properties[propName];
    //
    //            if (!propertyDefinition.hasOwnProperty('writable') || propertyDefinition.writable) {
    //                throw new Error('Every typed property in interface must be marked as not writable.');
    //            }
    //        }
    //    }
    //
    //    // Parsing interfaces
    //
    //    if (classDefinition.$_implements) {
    //        throw new Error('Interface "' + this.getClassName() + '" can\'t implements any interfaces.' +
    //        ' You can extend this one from another interface instead.');
    //    }
    //
    //    // Parsing abstract classes
    //
    //    if (classDefinition.$_abstract) {
    //        throw new Error('You can\'t specify abstract method by the property "$_abstract".' +
    //        ' All methods specified in interface are abstract by default.');
    //    }
    //
    //    // Parsing static properties and methods
    //
    //    if (classDefinition.$_static) {
    //        throw new Error('You can\'t specify any static properties or methods in interface.');
    //    }
    //
    //    // Parsing traits
    //
    //    if (Subclass.ClassManager.issetClassType('Trait')) {
    //        if (classDefinition.$_traits) {
    //            throw new Error('Interface "' + this.getClassName() + '" can\'t contains any traits.');
    //        }
    //    }
    //};

    return InterfaceDefinition;

})();