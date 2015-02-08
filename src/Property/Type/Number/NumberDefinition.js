/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Number.NumberDefinition = (function()
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
        NumberDefinition.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }
        var property = this.getProperty();
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var error = false;

        if (typeof value != 'number') {
            error = true;
        }
        if (!error && minValue !== null && value < minValue) {
            Subclass.Error.create(
                'The value of the property ' + property + ' is too small ' +
                'and must be more or equals the number ' + minValue + "."
            );
        }
        if (!error && maxValue !== null && value > maxValue) {
            Subclass.Error.create(
                'The value of the property ' + property + ' is too high ' +
                'and must be less or equals the number ' + maxValue + "."
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('a number')
                .apply()
            ;
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxValue')
                .received(maxValue)
                .property(this.getProperty())
                .expected('a number or null')
                .apply()
            ;
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
            Subclass.Error.create('InvalidPropertyOption')
                .option('minValue')
                .received(minValue)
                .property(this.getProperty())
                .expected('a number or null')
                .apply()
            ;
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
            Subclass.Error.create(
                'The "maxLength" attribute value must be higher than "minLength" attribute value ' +
                'in definition of property ' + property + ' must be number or null.'
            );
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
