/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Number.NumberDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function NumberDefinition (property, propertyDefinition)
    {
        NumberDefinition.$parent.call(this, property, propertyDefinition);
    }

    NumberDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : 0;
    };

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.validateValue = function(value)
    {
        if (NumberDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        var property = this.getProperty();
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var error = false;

        if (typeof value != 'number') {
            error = true;
        }
        if (!error && value !== null && minValue !== null && value < minValue) {
            throw new Error('The value of the property ' + property + ' is too small ' +
                'and must be more or equals number ' + minValue + ".");
        }
        if (!error && value !== null && maxValue !== null && value > maxValue) {
            throw new Error('The value of the property ' + property + ' is too big ' +
                'and must be less or equals number ' + maxValue + ".");
        }
        if (error) {
            var message = 'The value of the property ' + property + ' must be a number. ';

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
     * Validates "maxValue" attribute value
     *
     * @param {*} maxValue
     */
    NumberDefinition.prototype.validateMaxValue = function(maxValue)
    {
        if (maxValue !== null && typeof maxValue != 'number') {
            this._throwInvalidAttribute('maxValue', 'a number or null');
        }
    };

    /**
     * Sets "maxValue" attribute value
     *
     * @param {(number|null)} maxValue
     */
    NumberDefinition.prototype.setMaxValue = function(maxValue)
    {
        this.validateMaxValue(maxValue);
        this.getData().maxValue = maxValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "maxValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberDefinition.prototype.getMaxValue = function()
    {
        return this.getData().maxValue;
    };

    /**
     * Validates "minValue" attribute value
     *
     * @param {*} minValue
     */
    NumberDefinition.prototype.validateMinValue = function(minValue)
    {
        if (minValue !== null && typeof minValue != 'number') {
            this._throwInvalidAttribute('minValue', 'a number or null');
        }
    };

    /**
     * Sets "minValue" attribute value
     *
     * @param {(number|null)} minValue
     */
    NumberDefinition.prototype.setMinValue = function(minValue)
    {
        this.validateMinValue(minValue);
        this.getData().minValue = minValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "minValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberDefinition.prototype.getMinValue = function()
    {
        return this.getData().minValue;
    };

    /**
     * Validates how minValue and maxValue are compatable
     */
    NumberDefinition.prototype.validateMinMaxValues = function()
    {
        var property = this.getProperty();
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();

        if (minValue !== null && maxValue !== null && minValue > maxValue) {
            throw new Error('The "maxLength" attribute value must be more than "minLength" attribute value' +
                ' in definition of property ' + property + ' must be number or null.');
        }
    };

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.getBaseData = function()
    {
        var baseDefinition = NumberDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Specified max number value if it isn't null
         * @type {(number|null)}
         */
        baseDefinition.maxValue = null;

        /**
         * Specifies min number value if it isn't null
         * @type {(number|null)}
         */
        baseDefinition.minValue = null;

        return baseDefinition;
    };

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.validateData = function()
    {
        NumberDefinition.$parent.prototype.processData.call(this);

        this.validateMinMaxValues();
    };

    return NumberDefinition;

})();
