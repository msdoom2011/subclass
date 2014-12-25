/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.NumberDefinition = (function()
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

    NumberDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : 0;
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
        this.getDefinition().maxValue = maxValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "maxValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberDefinition.prototype.getMaxValue = function()
    {
        return this.getDefinition().maxValue;
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
        this.getDefinition().minValue = minValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "minValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberDefinition.prototype.getMinValue = function()
    {
        return this.getDefinition().minValue;
    };

    /**
     * Validates how minValue and maxValue are compatable
     */
    NumberDefinition.prototype.validateMinMaxValues = function()
    {
        var property = this.getProperty();
        var propertyName = property.getPropertyNameFull();
        var contextClass = property.getContextClass();

        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();

        if (minValue !== null && maxValue !== null && minValue > maxValue) {
            throw new Error('The "maxLength" attribute value must be more than "minLength" attribute value' +
                ' in definition of property "' + propertyName + '" must be number or null' +
                (contextClass ? (' in class "' + contextClass.getClassName() + '"') : "") + ".");
        }
    };

    /**
     * @inheritDoc
     */
    NumberDefinition.prototype.getBaseDefinition = function()
    {
        var baseDefinition = NumberDefinition.$parent.prototype.getBaseDefinition.call(this);

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
    NumberDefinition.prototype.validateDefinition = function()
    {
        NumberDefinition.$parent.prototype.validateDefinition.call(this);

        this.validateMinMaxValues();

        //var minValue = this.getMinValue();
        //var maxValue = this.getMaxValue();
        //var message = "";

        //if (minValue !== null && typeof minValue != 'number') {
        //    message = 'The "minValue" attribute in definition of property ' +
        //        '"' + this.getPropertyNameFull() + '" must be number or null' +
        //        (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //
        //} else if (maxValue !== null && typeof maxValue != 'number') {
        //    message = 'The "maxLength" attribute in definition of property ' +
        //        '"' + this.getPropertyNameFull() + '" must be number or null' +
        //        (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        //}
        //
        //if (minValue !== null && maxValue !== null && minValue > maxValue) {
        //    throw new Error('The "maxLength" attribute value must be more than "minLength" attribute value' +
        //        ' in definition of property "' + this.getPropertyNameFull() + '" must be number or null' +
        //        (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ");
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

    };

    return NumberDefinition;

})();
