/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.AbstractClass.AbstractClassBuilder = (function()
{
    function AbstractClassBuilder(classManager, classType, className)
    {
        AbstractClassBuilder.$parent.call(this, classManager, classType, className);
    }

    AbstractClassBuilder.$parent = Subclass.Class.Class.ClassBuilder;

    /**
     * Validates abstract methods argument
     * @param {Object.<Function>} abstractMethods
     * @private
     */
    AbstractClassBuilder.prototype._validateAbstractMethods = function(abstractMethods)
    {
        if (!Subclass.Tools.isPlainObject(abstractMethods)) {
            throw new Error('Invalid value of argument "abstractMethods" in method "setAbstractMethods" in "AbstractClassBuilder" class.');
        }
    };

    /**
     * Sets abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {Subclass.Class.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.setAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);
        this._getDefinition().$_abstract = abstractMethods;

        return this;
    };

    /**
     * Adds new abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {Subclass.Class.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.addAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);

        if (!this._getDefinition().$_abstract) {
            this._getDefinition().$_abstract = {};
        }
        Subclass.Tools.extend(
            this._getDefinition().$_abstract,
            abstractMethods
        );

        return this;
    };

    /**
     * Returns abstract methods
     *
     * @returns {Object.<Function>}
     */
    AbstractClassBuilder.prototype.getAbstractMethods = function()
    {
        return this._getDefinition().$_abstract || {};
    };

    /**
     * Removes abstract method with specified method name
     *
     * @param {string} abstractMethodName
     * @returns {Subclass.Class.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.removeAbstractMethod = function(abstractMethodName)
    {
        var abstractMethods = this.getAbstractMethods();

        delete abstractMethods[abstractMethodName];

        return this;
    };

    return AbstractClassBuilder;

})();