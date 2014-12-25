/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.StringDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function StringDefinition (property, propertyDefinition)
    {
        StringDefinition.$parent.call(this, property, propertyDefinition);
    }

    StringDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : "";
    };

    /**
     * Validates "pattern" attribute value
     *
     * @param {*} pattern
     */
    StringDefinition.prototype.validatePattern = function(pattern)
    {
        if (pattern !== null || typeof pattern != 'object' || !(pattern instanceof RegExp)) {
            this._throwInvalidAttribute('pattern', 'a RegExp object instance or null');
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(RegExp|null)} pattern
     */
    StringDefinition.prototype.setPattern = function(pattern)
    {
        this.validatePattern(pattern);
        this.getDefinition().pattern = pattern;
    };

    /**
     * Returns value of "pattern" attribute
     *
     * @returns {(RegExp|null)}
     */
    StringDefinition.prototype.getPattern = function()
    {
        return this.getDefinition().pattern;
    };

    /**
     * Validates "maxLength" attribute value
     *
     * @param {*} maxLength
     */
    StringDefinition.prototype.validateMaxLength = function(maxLength)
    {
        if (maxLength !== null || typeof maxLength != 'number') {
            this._throwInvalidAttribute('maxLength', 'a number or null');
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(number|null)} maxLength
     */
    StringDefinition.prototype.setMaxLength = function(maxLength)
    {
        this.validateMaxLength(maxLength);
        this.getDefinition().maxLength = maxLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "maxLength" attribute
     *
     * @returns {(number|null)}
     */
    StringDefinition.prototype.getMaxLength = function()
    {
        return this.getDefinition().maxLength;
    };

    /**
     * Validates "minLength" attribute value
     *
     * @param {*} minLength
     */
    StringDefinition.prototype.validateMinLength = function(minLength)
    {
        if (minLength !== null || typeof minLength != 'number') {
            this._throwInvalidAttribute('minLength', 'a number or null');
        }
    };

    /**
     * Sets "minLength" attribute value
     *
     * @param {(number|null)} minLength
     */
    StringDefinition.prototype.setMinLength = function(minLength)
    {
        this.validateMinLength(minLength);
        this.getDefinition().minLength = minLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "minLength" attribute
     *
     * @returns {(number|null)}
     */
    StringDefinition.prototype.getMinLength = function()
    {
        return this.getDefinition().minLength;
    };

    /**
     * Validates how minLength and maxLength are compatable
     */
    StringDefinition.prototype.validateMinMaxLengths = function()
    {
        var property = this.getProperty();
        var propertyName = property.getPropertyNameFull();
        var contextClass = property.getContextClass();

        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();

        if (minLength !== null && maxLength !== null && minLength > maxLength) {
            throw new Error('The "maxLength" attribute value must be more than "minLength" attribute value' +
            ' in definition of property "' + propertyName + '" must be number or null' +
            (contextClass ? (' in class "' + contextClass.getClassName() + '"') : "") + ".");
        }
    };

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.getBaseDefinition = function()
    {
        var baseDefinition = StringDefinition.$parent.prototype.getBaseDefinition.call(this);

        /**
         * Regular expression that property value will match
         * @type {(RegExp|null)}
         */
        baseDefinition.pattern = null;

        /**
         * Specified max string length if it isn't null
         * @type {(number|null)}
         */
        baseDefinition.maxLength = null;

        /**
         * Specifies min string length if it isn't null
         * @type {(number|null)}
         */
        baseDefinition.minLength = null;

        return baseDefinition;
    };

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.validateDefinition = function()
    {
        //var minLength = this.getMinLength();
        //var maxLength = this.getMaxLength();
        //var pattern = this.getPattern();
        //var message = "";
        //
        //if (pattern && pattern.constructor != RegExp) {
        //    message = 'The "pattern" attribute in definition of property ' +
        //    '"' + this.getPropertyNameFull() + '" must be instance of RegExp class or null' +
        //    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //
        //} else if (minLength !== null && typeof minLength != 'number') {
        //    message = 'The "minLength" attribute in definition of property ' +
        //    '"' + this.getPropertyNameFull() + '" must be number or null' +
        //    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //
        //} else if (maxLength !== null && typeof maxLength != 'number') {
        //    message = 'The "maxLength" attribute in definition of property ' +
        //    '"' + this.getPropertyNameFull() + '" must be number or null' +
        //    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //}
        //if (minLength !== null && maxLength !== null && minLength > maxLength) {
        //    message = 'The "maxLength" attribute value must be more than "minLength" attribute value' +
        //    ' in definition of property "' + this.getPropertyNameFull() + '" must be number or null' +
        //    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //}
        //
        //if (message) {
        //    if (typeof value == 'object' && pattern.$_className) {
        //        message += 'Instance of class "' + pattern.$_className + '" was received instead.';
        //
        //    } else if (typeof value == 'object') {
        //        message += 'Object with type "' + pattern.constructor.name + '" was received instead.';
        //
        //    } else {
        //        message += 'Value with type "' + (typeof pattern) + '" was received instead.';
        //    }
        //
        //    throw new Error(message);
        //}
        //

        StringDefinition.$parent.prototype.validatePropertyDefinition.call(this);

        this.validateMinMaxLengths();
    };

    return StringDefinition;

})();
