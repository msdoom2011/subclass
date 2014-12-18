; ClassManager.ClassTypes.AbstractClass.Builder = (function()
{
    function AbstractClassBuilder(classManager, classType, className)
    {
        AbstractClassBuilder.$parent.call(this, classManager, classType, className);
    }

    AbstractClassBuilder.$parent = ClassManager.ClassTypes.Class.Builder;

    /**
     * Validates abstract methods argument
     * @param {Object.<Function>} abstractMethods
     * @private
     */
    AbstractClassBuilder.prototype._validateAbstractMethods = function(abstractMethods)
    {
        if (!ClassManager.Tools.isPlainObject(abstractMethods)) {
            throw new Error('Invalid value of argument "abstractMethods" in method "setAbstractMethods" in "AbstractClassBuilder" class.');
        }
    };

    /**
     * Sets abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {ClassManager.ClassTypes.AbstractClass.Builder}
     */
    AbstractClassBuilder.prototype.setAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);
        this._getClassDefinition().$_abstract = abstractMethods;

        return this;
    };

    /**
     * Adds new abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {ClassManager.ClassTypes.AbstractClass.Builder}
     */
    AbstractClassBuilder.prototype.addAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);

        if (!this._getClassDefinition().$_abstract) {
            this._getClassDefinition().$_abstract = {};
        }
        ClassManager.Tools.extend(
            this._getClassDefinition().$_abstract,
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
        return this._getClassDefinition().$_abstract || {};
    };

    /**
     * Removes abstract method with specified method name
     *
     * @param {string} abstractMethodName
     * @returns {ClassManager.ClassTypes.AbstractClass.Builder}
     */
    AbstractClassBuilder.prototype.removeAbstractMethod = function(abstractMethodName)
    {
        var abstractMethods = this.getAbstractMethods();

        delete abstractMethods[abstractMethodName];

        return this;
    };


    return AbstractClassBuilder;

})();