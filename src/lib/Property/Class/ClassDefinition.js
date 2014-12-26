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
     * @inheritDoc
     */
    ClassDefinition.prototype.validateValue = function(value)
    {
        if (ClassDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }

        var neededClassName = this.getClassName();

        if (
            !value
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
            var message = 'The value of the property ' + this.getProperty() + ' must be ' +
                'an instance of class "' + neededClassName + '" or null. ';

            if (typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
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

    return ClassDefinition;

})();
