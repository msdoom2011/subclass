/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Mixed.MixedDefinition = (function()
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
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('one of the specified types [' + this.getAllowsNames().join(", ") + ']')
                .apply()
            ;
        }
    };

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    MixedDefinition.prototype.validateAllows = function(allows)
    {
        if (!allows || !Array.isArray(allows) || !allows.length) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('allows')
                .property(this.getProperty())
                .received(allows)
                .expected('a not empty array with definitions of needed property types')
                .apply()
            ;
        }
        for (var i = 0; i < allows.length; i++) {
            if (!Subclass.Tools.isPlainObject(allows[i])) {
                Subclass.Error.create(
                    'Specified not valid values in "allows" option in definition ' +
                    'of property ' + this.getProperty() + '. ' +
                    'It must be property definitions.'
                );
            }
        }
    };

    MixedDefinition.prototype.normalizeAllows = function(allows)
    {
        var propertyManager = this.getProperty().getPropertyManager();

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                allows[i] = propertyManager.normalizePropertyDefinition(allows[i]);
            }
        }
        return allows;
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    MixedDefinition.prototype.setAllows = function(allows)
    {
        allows = this.normalizeAllows(allows);

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
        var allows = this.normalizeAllows(this.getAllows());

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                if (Subclass.Tools.isPlainObject(allows[i])) {
                    this.getProperty().addAllowedType(allows[i]);
                }
            }
        }
        MixedDefinition.$parent.prototype.processData.call(this);
    };

    return MixedDefinition;

})();
