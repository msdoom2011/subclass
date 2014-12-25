/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyType}
 */
Subclass.PropertyManager.PropertyTypes.String = (function()
{
    /*************************************************/
    /*      Describing property type "String"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function StringType(propertyManager, propertyName, propertyDefinition)
    {
        StringType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    StringType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    StringType.getPropertyTypeName = function()
    {
        return "string";
    };

    /**
     * @inheritDoc
     */
    StringType.isAllowedValue = function(value)
    {
        return typeof value == 'string';
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.StringDefinition;
    };
    //
    ///**
    // * Returns RegExp pattern which string value should match
    // *
    // * @returns {RegExp}
    // */
    //StringType.prototype.getPattern = function()
    //{
    //    return this.getPropertyDefinition().pattern;
    //};
    //
    ///**
    // * Returns minimum length of string value
    // *
    // * @returns {(number|null)}
    // */
    //StringType.prototype.getMinLength = function()
    //{
    //    return this.getPropertyDefinition().minLength;
    //};
    //
    ///**
    // * Returns maximum length of string value
    // *
    // * @returns {(number|null)}
    // */
    //StringType.prototype.getMaxLength = function()
    //{
    //    return this.getPropertyDefinition().maxLength;
    //};

    /**
     * @inheritDoc
     */
    StringType.prototype.validate = function(value)
    {
        if (StringType.$parent.prototype.validate.call(this, value)) {
            return;
        }
        var propertyDefinition = this.getPropertyDefinition();
        var pattern = propertyDefinition.getPattern();
        var minLength = propertyDefinition.getMinLength();
        var maxLength = propertyDefinition.getMaxLength();
        var error = false;

        if (typeof value != 'string') {
            error = true;
        }
        if (!error && value !== null && pattern && !pattern.test(value)) {
            throw new Error('The value of the property ' + this + ' is not valid ' +
                'and must match regular expression "' + pattern.toString() + '".');
        }
        if (!error && value !== null && minLength !== null && value.length < minLength) {
            throw new Error('The value of the property ' + this + ' is too short ' +
                'and must consist of at least ' + minLength + ' symbols.');
        }
        if (!error && value !== null && maxLength !== null && value.length > maxLength) {
            throw new Error('The value of the property "' + this + '" is too long ' +
                'and must be not longer than ' + maxLength + ' symbols.');
        }
        if (error) {
            var message = 'The value of the property ' + this + ' must be a string. ';

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
    //
    ///**
    // * @inheritDoc
    // */
    //StringType.prototype.getBasePropertyDefinition = function()
    //{
    //    var baseDefinition = StringType.$parent.prototype.getBasePropertyDefinition.call(this);
    //
    //    /**
    //     * Regular expression that property value will match
    //     * @type {(RegExp|null)}
    //     */
    //    baseDefinition.pattern = null;
    //
    //    /**
    //     * Specified max string length if it isn't null
    //     * @type {(number|null)}
    //     */
    //    baseDefinition.maxLength = null;
    //
    //    /**
    //     * Specifies min string length if it isn't null
    //     * @type {(number|null)}
    //     */
    //    baseDefinition.minLength = null;
    //
    //    return baseDefinition;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //StringType.prototype.validatePropertyDefinition = function()
    //{
    //    var minLength = this.getMinLength();
    //    var maxLength = this.getMaxLength();
    //    var pattern = this.getPattern();
    //    var message = "";
    //
    //    if (pattern && pattern.constructor != RegExp) {
    //        message = 'The "pattern" attribute in definition of property ' +
    //            '"' + this.getPropertyNameFull() + '" must be instance of RegExp class or null' +
    //            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
    //
    //    } else if (minLength !== null && typeof minLength != 'number') {
    //        message = 'The "minLength" attribute in definition of property ' +
    //            '"' + this.getPropertyNameFull() + '" must be number or null' +
    //            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
    //
    //    } else if (maxLength !== null && typeof maxLength != 'number') {
    //        message = 'The "maxLength" attribute in definition of property ' +
    //            '"' + this.getPropertyNameFull() + '" must be number or null' +
    //            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
    //    }
    //    if (minLength !== null && maxLength !== null && minLength > maxLength) {
    //        message = 'The "maxLength" attribute value must be more than "minLength" attribute value' +
    //            ' in definition of property "' + this.getPropertyNameFull() + '" must be number or null' +
    //            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";
    //    }
    //
    //    if (message) {
    //        if (typeof value == 'object' && pattern.$_className) {
    //            message += 'Instance of class "' + pattern.$_className + '" was received instead.';
    //
    //        } else if (typeof value == 'object') {
    //            message += 'Object with type "' + pattern.constructor.name + '" was received instead.';
    //
    //        } else {
    //            message += 'Value with type "' + (typeof pattern) + '" was received instead.';
    //        }
    //
    //        throw new Error(message);
    //    }
    //
    //    StringType.$parent.prototype.validatePropertyDefinition.call(this);
    //};


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(StringType);

    return StringType;

})();