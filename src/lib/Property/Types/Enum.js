Subclass.PropertyManager.PropertyTypes.Enum = (function()
{
    /*************************************************/
    /*       Describing property type "Enum"         */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function EnumType(propertyManager, propertyName, propertyDefinition)
    {
        EnumType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    EnumType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    EnumType.getPropertyTypeName = function()
    {
        return "enum";
    };

    /**
     * Returns allowed property values
     *
     * @returns {*[]}
     */
    EnumType.prototype.getAllows = function()
    {
        return this.getPropertyDefinition().allows;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.validate = function(value)
    {
        var allows = this.getAllows();

        if (allows.indexOf(value) < 0) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" is not valid ' +
                'and must be one of the specified values [' + allows.join(", ") + ']' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'null value was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.getBasePropertyDefinition = function()
    {
        var basePropertyDefinition = EnumType.$parent.prototype.getBasePropertyDefinition.call(this);

        /**
         * Allows to specify allowed property values.
         * Every value in array must be one of the types: "number", "string", "boolean"
         *
         * @type {string[]}
         */
        basePropertyDefinition.allows = null;

        return basePropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.processPropertyDefinition = function()
    {
        EnumType.$parent.prototype.processPropertyDefinition.call(this);

        var propertyDefinition = this.getPropertyDefinition();
        var defaultValue = this.getDefaultValue();
        var allows = this.getAllows();

        if (
            !defaultValue === null
            && allows
            && Array.isArray(allows)
        ) {
            propertyDefinition.value = allows[0];
        }
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.validatePropertyDefinition = function()
    {
        var allows = this.getAllows();

        if (!allows) {
            throw new Error('Missed "allows" parameter in definition ' +
                'of enum property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
        if (!Array.isArray(allows) || !allows.length) {
            throw new Error('Specified not valid "allows" parameter in definition ' +
                'of property "' + this.getPropertyNameFull() + '" ' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". " +
                'It must be a not empty array with items of a certain types: "string", "number", "boolean".');
        }
        for (var i = 0; i < allows.length; i++) {
            if (['string', 'number', 'boolean'].indexOf(typeof allows[i]) < 0) {
                throw new Error('Specified not valid values in "allows" parameter in definition ' +
                    'of property "' + this.getPropertyNameFull() + '" ' +
                    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". " +
                    'Allowed types are: "string", "number", "boolean".');
            }
        }

        EnumType.$parent.prototype.validatePropertyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

})();