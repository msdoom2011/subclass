; Subclass.PropertyManager.PropertyTypes.Number = (function()
{
    /*************************************************/
    /*      Describing property type "Number"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function NumberType(propertyManager, propertyName, propertyDefinition)
    {
        NumberType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    NumberType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    NumberType.getPropertyTypeName = function()
    {
        return "number";
    };

    /**
     * Returns minimum number value
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMinValue = function()
    {
        return this.getPropertyDefinition().minValue;
    };

    /**
     * Returns maximum number value
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMaxValue = function()
    {
        return this.getPropertyDefinition().maxValue;
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validate = function(value)
    {
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var error = false;

        if (value !== null && typeof value != 'number') {
            error = true;
        }
        if (!error && minValue !== null && value < minValue) {
            throw new Error('The value of the property "' + this.getPropertyNameFull() + '" is too small ' +
                'and must be more or equals number ' + minValue +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
        if (!error && maxValue !== null && value > maxValue) {
            throw new Error('The value of the property "' + this.getPropertyNameFull() + '" is too big ' +
                'and must be less or equals number ' + maxValue +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }

        if (error) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be a number' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

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
     * @inheritDoc
     */
    NumberType.prototype.getBasePropertyDefinition = function()
    {
        var baseDefinition = NumberType.$parent.prototype.getBasePropertyDefinition.call(this);

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
    NumberType.prototype.validatePropertyDefinition = function()
    {
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var message = "";

        if (minValue !== null && typeof minValue != 'number') {
            message = 'The "minValue" attribute in definition of property ' +
                '"' + this.getPropertyNameFull() + '" must be number or null' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

        } else if (maxValue !== null && typeof maxValue != 'number') {
            message = 'The "maxLength" attribute in definition of property ' +
                '"' + this.getPropertyNameFull() + '" must be number or null' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        }
        if (minValue !== null && maxValue !== null && minValue > maxValue) {
            message = 'The "maxLength" attribute value must be more than "minLength" attribute value' +
                ' in definition of property "' + this.getPropertyNameFull() + '" must be number or null' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
        }

        if (message) {
            if (typeof value == 'object' && pattern.$_className) {
                message += 'Instance of class "' + pattern.$_className + '" was received instead.';

            } else if (typeof value == 'object') {
                message += 'Object with type "' + pattern.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof pattern) + '" was received instead.';
            }

            throw new Error(message);
        }

        NumberType.$parent.prototype.validatePropertyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();