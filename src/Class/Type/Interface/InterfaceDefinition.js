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
     * @inheritDoc
     */
    InterfaceDefinition.prototype.createBaseData = function()
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