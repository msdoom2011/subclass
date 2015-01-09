/**
 * @class
 * @extends {Subclass.Class.Class.ClassDefinition}
 */
Subclass.Class.AbstractClass.AbstractClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function AbstractClassDefinition(classInst, classDefinition)
    {
        AbstractClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    AbstractClassDefinition.$parent = Subclass.Class.Class.ClassDefinition;

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    AbstractClassDefinition.prototype.validateAbstract = function(value)
    {
        try {
            if (value !== null && !Subclass.Tools.isPlainObject(value)) {
                throw 'error';
            }
            if (value) {
                for (var methodName in value) {
                    if (!value.hasOwnProperty(methodName)) {
                        continue;
                    }
                    if (typeof value[methodName] != 'function') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            this._throwInvalidAttribute('$_abstract', 'an object with methods or null.');
        }
        return true;
    };

    /**
     * Sets "$_abstract" attribute value
     *
     * @param {Object} value Plain object with different properties and methods
     */
    AbstractClassDefinition.prototype.setAbstract = function(value)
    {
        this.validateAbstract(value);
        this.getData().$_abstract = value || {};

        if (value) {
            this.getClass().addAbstractMethods(value);
        }
    };

    /**
     * Returns "$_abstract" attribute value
     *
     * @returns {Object}
     */
    AbstractClassDefinition.prototype.getAbstract = function()
    {
        return this.getData().$_abstract;
    };

    /**
     * @inheritDoc
     */
    AbstractClassDefinition.prototype.getBaseData = function ()
    {
        var classDefinition = AbstractClassDefinition.$parent.prototype.getBaseData();

        /**
         * Object that contains abstract methods
         * @type {{}}
         */
        classDefinition.$_abstract = {};

        delete classDefinition.getClassManager;
        delete classDefinition.hasTrait;
        delete classDefinition.isImplements;
        delete classDefinition.getClassName;
        delete classDefinition.getCopy;
        delete classDefinition.issetProperty;
        delete classDefinition.getProperty;

        return classDefinition;
    };

    return AbstractClassDefinition;

})();