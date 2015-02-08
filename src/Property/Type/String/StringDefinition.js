/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.String.StringDefinition = (function()
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
        StringDefinition.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
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
        if (!error && pattern && !pattern.test(value)) {
            Subclass.Error.create(
                'The value of the property ' + property + ' is not valid ' +
                'and must match regular expression "' + pattern.toString() + '".'
            );
        }
        if (!error && minLength !== null && value.length < minLength) {
            Subclass.Error.create(
                'The value of the property ' + property + ' is too short ' +
                'and must consist of at least ' + minLength + ' symbols.'
            );
        }
        if (!error && maxLength !== null && value.length > maxLength) {
            Subclass.Error.create(
                'The value of the property "' + property + '" is too long ' +
                'and must be not longer than ' + maxLength + ' symbols.'
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('a string')
                .apply()
            ;
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('pattern')
                .received(pattern)
                .property(this.getProperty())
                .expected('a RegExp instance or null')
                .apply()
            ;
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxLength')
                .received(maxLength)
                .property(this.getProperty())
                .expected('a number or null')
                .apply()
            ;
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('minLength')
                .received(minLength)
                .property(this.getProperty())
                .expected('a number or null')
                .apply()
            ;
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
            Subclass.Error.create(
                'The "maxLength" attribute value must be more than "minLength" attribute value ' +
                'in definition of property ' + property + ' must be number or null.'
            );
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
