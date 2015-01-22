/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Class.ClassDefinition = (function()
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

    ClassDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.validateValue = function(value)
    {
        ClassDefinition.$parent.prototype.validateValue.call(this, value);

        var neededClassName = this.getClassName();

        if (
            (!value && value !== null)
            || typeof value != 'object'
            || (
                value
                && typeof value == 'object'
                && (
                    !value.$_className
                    || !value.isInstanceOf(neededClassName)
                )
            )
        ) {
            Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                'an instance of class "' + neededClassName + '" or null'
            );
        }
    };

    /**
     * Validates "className" attribute value
     *
     * @param {*} className
     */
    ClassDefinition.prototype.validateClassName = function(className)
    {
        if (typeof className != 'string') {
            Subclass.Property.Error.InvalidOption('className', className, this.getProperty(), 'a string');
        }
        var property = this.getProperty();
        var classManager = property.getPropertyManager().getModule().getClassManager();

        if (!classManager.issetClass(className)) {
            throw new Error(
                'Specified non existent class in "' + className + '" attribute ' +
                'in definition of property ' + property + '.'
            );
        }
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassDefinition.prototype.setNullable = function(nullable)
    {
        this.validateNullable(nullable);

        if (typeof nullable == 'boolean' && !nullable) {
            throw new Error('The "class" property ' + this.getProperty() + ' can\'t be not nullable.');
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
        this.getData().className = className;
    };

    /**
     * Returns "className" attribute value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getClassName = function()
    {
        return this.getData().className;
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
    ClassDefinition.prototype.getBaseData = function()
    {
        var basePropertyDefinition = ClassDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Allows to specify name of class which value must implement.
         *
         * @type {String}
         */
        basePropertyDefinition.className = null;

        return basePropertyDefinition;
    };

    return ClassDefinition;

})();
