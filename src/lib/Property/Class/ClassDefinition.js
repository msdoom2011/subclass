/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.ClassDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function ClassDefinition (property, propertyDefinition)
    {
        ClassDefinition.$parent.call(this, property, propertyDefinition);
    }

    ClassDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * Validates "className" attribute value
     *
     * @param {*} className
     */
    ClassDefinition.prototype.validateClassName = function(className)
    {
        if (typeof className != 'string') {
            this._throwInvalidAttribute('className', 'a string');
        }
        var property = this.getProperty();
        var classManager = property.getPropertyManager().getClassManager();

        if (!classManager.issetClass(className)) {
            throw new Error('Specified non existent class in "className" attribute ' +
                'in definition of property ' + property + '.');
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {string} className
     */
    ClassDefinition.prototype.setClassName = function(className)
    {
        this.validateClassName(className);
        this.getDefinition().className = className;
    };

    /**
     * Returns "className" attribute value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getClassName = function()
    {
        return this.getDefinition().className;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = ClassDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['className']);
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getBaseDefinition = function()
    {
        var basePropertyDefinition = ClassDefinition.$parent.prototype.getBaseDefinition.call(this);

        /**
         * Allows to specify name of class which value must implement.
         *
         * @type {String}
         */
        basePropertyDefinition.className = null;

        return basePropertyDefinition;
    };

    ///**
    // * @inheritDoc
    // */
    //ClassDefinition.prototype.validateDefinition = function()
    //{
    //    var property = this.getProperty();
    //    var propertyName = property.getPropertyNameFull();
    //    var contextClass = property.getContextClass();
    //    //var classManager = property.getPropertyManager().getClassManager();
    //
    //    if (!this.getClassName()) {
    //        throw new Error('Missed "className" parameter in definition of class property "' + propertyName + '"' +
    //            (contextClass ? (' in class "' + contextClass.getClassName() + '"') : "") + ".");
    //    }
    //
    //    //if (!classManager.issetClass(this.getClassName())) {
    //    //    throw new Error('Specified non existent class in "className" attribute ' +
    //    //        'in definition of property "' + propertyName + '" ' +
    //    //        (contextClass ? (' in class "' + contextClass.getClassName() + '"') : "") + ".");
    //    //}
    //
    //    ClassDefinition.$parent.prototype.validateDefinition.call(this);
    //};

    return ClassDefinition;

})();
