/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Mixed.MixedDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function MixedDefinition (property, propertyDefinition)
    {
        MixedDefinition.$parent.call(this, property, propertyDefinition);
    }

    MixedDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    MixedDefinition.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : false;
    };

    /**
     * @inheritDoc
     */
    MixedDefinition.prototype.validateValue = function(value)
    {
        MixedDefinition.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }

        var allowedTypes = this.getProperty().getAllowedTypes();
        var error = true;

        for (var i = 0; i < allowedTypes.length; i++) {
            var allowedType = allowedTypes[i];

            try {
                allowedType.validateValue(value);
                error = false;
                break;

            } catch (e) {
                // Do nothing
            }
        }
        if (error) {
            throw new Subclass.Property.Error.InvalidValue(
                this.getProperty(),
                value,
                'one of the specified types [' + this.getAllowsNames().join(", ") + ']'
            );
        }
    };

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    MixedDefinition.prototype.validateAllows = function(allows)
    {
        if (!allows) {
            throw new Error('Missed "allows" parameter in definition ' +
                'of mixed type property ' + this.getProperty() + ".");
        }
        if (!Array.isArray(allows) && !allows.length) {
            throw new Error('Specified not valid "allows" parameter in definition ' +
                'of property ' + this.getProperty() + '. ' +
                'It must be a not empty array with definitions of needed property types.');
        }
        for (var i = 0; i < allows.length; i++) {
            if (!Subclass.Tools.isPlainObject(allows[i])) {
                throw new Error('Specified not valid values in "allows" parameter in definition ' +
                    'of property ' + this.getProperty() + '. ' +
                    'It must property definitions.');
            }
        }
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    MixedDefinition.prototype.setAllows = function(allows)
    {
        this.validateAllows(allows);
        this.getData().allows = allows;
    };

    /**
     * Returns value of "allows" attribute of property definition
     *
     * @returns {Array}
     */
    MixedDefinition.prototype.getAllows = function()
    {
        return this.getData().allows;
    };

    /**
     * Returns all allowed value types according to allows parameter of property definition.
     *
     * @returns {string[]}
     */
    MixedDefinition.prototype.getAllowsNames = function()
    {
        var allows = this.getAllows();
        var typeNames = [];

        for (var i = 0; i < allows.length; i++) {
            typeNames.push(allows[i].type);
        }
        return typeNames;
    };

    /**
     * @inheritDoc
     */
    MixedDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = MixedDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['allows']);
    };

    /**
     * @inheritDoc
     */
    MixedDefinition.prototype.getBaseData = function()
    {
        var basePropertyDefinition = MixedDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Allows to specify allowed types of property value.
         * Every value in array must be property definition of needed type
         *
         * @type {Object[]}
         */
        basePropertyDefinition.allows = [];

        return basePropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    MixedDefinition.prototype.processData = function()
    {
        var allows = this.getAllows();

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                if (!Subclass.Tools.isPlainObject(allows[i])) {
                    continue;
                }
                this.getProperty().addAllowedType(allows[i]);
            }
        }
        MixedDefinition.$parent.prototype.processData.call(this);
    };

    return MixedDefinition;

})();
