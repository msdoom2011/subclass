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

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateAbstract = function(value)
    {
        Subclass.Error.create(
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
        Subclass.Error.create(
            'Interface "' + this.getClass().getName() + '" can\'t implements any interfaces. ' +
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
        Subclass.Error.create('You can\'t specify any static properties or methods in interface.');
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    InterfaceDefinition.prototype.validateTraits = function(value)
    {
        Subclass.Error.create(
            'The interface "' + this.getClass().getName() + '" can\'t contains any traits.'
        );
    };

    /**
     * @inheritDoc
     */
    InterfaceDefinition.prototype.getBaseData = function()
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

    return InterfaceDefinition;

})();