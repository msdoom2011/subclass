/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.String.StringDefinition = (function()
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

    StringDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : "";
    };

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.validateValue = function(value)
    {
        if (StringDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        var pattern = this.getPattern();
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();
        var property = this.getProperty();
        var error = false;

        if (typeof value != 'string') {
            error = true;
        }
        if (!error && value !== null && pattern && !pattern.test(value)) {
            throw new Error('The value of the property ' + property + ' is not valid ' +
            'and must match regular expression "' + pattern.toString() + '".');
        }
        if (!error && value !== null && minLength !== null && value.length < minLength) {
            throw new Error('The value of the property ' + property + ' is too short ' +
            'and must consist of at least ' + minLength + ' symbols.');
        }
        if (!error && value !== null && maxLength !== null && value.length > maxLength) {
            throw new Error('The value of the property "' + property + '" is too long ' +
            'and must be not longer than ' + maxLength + ' symbols.');
        }
        if (error) {
            var message = 'The value of the property ' + property + ' must be a string. ';

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    /**
     * Validates "pattern" attribute value
     *
     * @param {*} pattern
     */
    StringDefinition.prototype.validatePattern = function(pattern)
    {
        if (pattern !== null && typeof pattern != 'object' && !(pattern instanceof RegExp)) {
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
        this.getData().pattern = pattern;
    };

    /**
     * Returns value of "pattern" attribute
     *
     * @returns {(RegExp|null)}
     */
    StringDefinition.prototype.getPattern = function()
    {
        return this.getData().pattern;
    };

    /**
     * Validates "maxLength" attribute value
     *
     * @param {*} maxLength
     */
    StringDefinition.prototype.validateMaxLength = function(maxLength)
    {
        if (maxLength !== null && typeof maxLength != 'number') {
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
        this.getData().maxLength = maxLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "maxLength" attribute
     *
     * @returns {(number|null)}
     */
    StringDefinition.prototype.getMaxLength = function()
    {
        return this.getData().maxLength;
    };

    /**
     * Validates "minLength" attribute value
     *
     * @param {*} minLength
     */
    StringDefinition.prototype.validateMinLength = function(minLength)
    {
        if (minLength !== null && typeof minLength != 'number') {
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
        this.getData().minLength = minLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "minLength" attribute
     *
     * @returns {(number|null)}
     */
    StringDefinition.prototype.getMinLength = function()
    {
        return this.getData().minLength;
    };

    /**
     * Validates how minLength and maxLength are compatable
     */
    StringDefinition.prototype.validateMinMaxLengths = function()
    {
        var property = this.getProperty();
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();

        if (minLength !== null && maxLength !== null && minLength > maxLength) {
            throw new Error('The "maxLength" attribute value must be more than "minLength" attribute value' +
                ' in definition of property ' + property + ' must be number or null.');
        }
    };

    /**
     * @inheritDoc
     */
    StringDefinition.prototype.getBaseData = function()
    {
        var baseDefinition = StringDefinition.$parent.prototype.getBaseData.call(this);

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

    return StringDefinition;

})();
