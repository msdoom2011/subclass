/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Interface.InterfaceDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function InterfaceDefinition(classInst, classDefinition)
    {
        InterfaceDefinition.$parent.call(this, classInst, classDefinition);
    }

    InterfaceDefinition.$parent = Subclass.Class.ClassDefinition;

    //if (InterfaceDefinition.$parent && InterfaceDefinition.$parent.addStaticMethods) {
    //    InterfaceDefinition.$parent.addStaticMethods.call(InterfaceDefinition);
    //}

    ///**
    // * Validates "$_abstract" attribute value
    // *
    // * @param {*} value
    // * @throws {Error}
    // */
    //InterfaceDefinition.prototype.validateAbstract = function(value)
    //{
    //    Subclass.Error.create(
    //        'You can\'t specify abstract method by the property "$_abstract". ' +
    //        'All methods specified in interface are abstract by default.'
    //    );
    //};
    //
    ///**
    // * Validate "$_implements" attribute value
    // *
    // * @param {*} value
    // * @throws {Error}
    // */
    //InterfaceDefinition.prototype.validateImplements = function(value)
    //{
    //    Subclass.Error.create(
    //        'Interface "' + this.getClass().getName() + '" can\'t implements any interfaces. ' +
    //        'You can extend this one from another interface instead.'
    //    );
    //};
    //
    ///**
    // * Validate "$_static" attribute value
    // *
    // * @param {*} value
    // * @throws {Error}
    // */
    //InterfaceDefinition.prototype.validateStatic = function(value)
    //{
    //    Subclass.Error.create('You can\'t specify any static properties or methods in interface.');
    //};
    //
    ///**
    // * Validates "$_traits" attribute value
    // *
    // * @param {*} value
    // * @throws {Error}
    // */
    //InterfaceDefinition.prototype.validateTraits = function(value)
    //{
    //    Subclass.Error.create(
    //        'The interface "' + this.getClass().getName() + '" can\'t contains any traits.'
    //    );
    //};

    /**
     * @inheritDoc
     */
    InterfaceDefinition.prototype.getBaseData = function()
    {
        return {
            /**
             * Parent class name
             *
             * @type {(string|null)}
             */
            $_extends: null,

            /**
             * List of constants
             *
             * @type {(Object|null)}
             */
            $_constants: null
        };
    };

    /**
     * Normalizes definition data
     */
    InterfaceDefinition.prototype.normalizeData = function()
    {
        InterfaceDefinition.$parent.prototype.normalizeData.call(this);

        var data = this.getData();
        var constants = this.getNoMethods();

        if (!data.hasOwnProperty('$_constants')) {
            data.$_constants = {};
        }

        for (var constantName in constants) {
            if (constants.hasOwnProperty(constantName)) {
                data.$_constants[constantName] = constants[constantName];
                delete data[constantName];
            }
        }
    };

    return InterfaceDefinition;
})();