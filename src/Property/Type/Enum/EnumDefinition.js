/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Enum.EnumDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function EnumDefinition (property, propertyDefinition)
    {
        EnumDefinition.$parent.call(this, property, propertyDefinition);
    }

    EnumDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getEmptyValue = function()
    {
        return this.getAllows()[0];
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    EnumDefinition.prototype.setNullable = function(nullable)
    {
        this.validateNullable(nullable);

        if (typeof nullable == 'boolean' && nullable) {
            Subclass.Error.create(
                'The "enum" type property ' + this.getProperty() + ' can\'t be nullable.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.validateValue = function(value)
    {
        var allows = this.getAllows();

        if (allows.indexOf(value) < 0) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('one of the specified values [' + allows.join(", ") + ']')
                .apply()
            ;
        }
    };

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    EnumDefinition.prototype.validateAllows = function(allows)
    {
        if (!allows || !Array.isArray(allows) || !allows.length) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('allows')
                .property(this.getProperty())
                .received(allows)
                .expected('a not empty array with items of a certain types: "string", "number", "boolean" or null.')
                .apply()
            ;
        }

        var allowedTypes = ['string', 'number', 'boolean'];

        for (var i = 0; i < allows.length; i++) {
            if (allowedTypes.indexOf(typeof allows[i]) < 0 && allows[i] !== null) {
                Subclass.Error.create(
                    'Specified not valid values in "allows" parameter in definition ' +
                    'of property ' + this.getProperty() + '. ' +
                    'Allowed types are: ' + allowedTypes.join(", ") + '" or null.'
                );
            }
        }
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    EnumDefinition.prototype.setAllows = function(allows)
    {
        this.validateAllows(allows);
        this.getData().allows = allows;
    };

    /**
     * Returns value of "allows" attribute of property definition
     *
     * @returns {Array}
     */
    EnumDefinition.prototype.getAllows = function()
    {
        return this.getData().allows;
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = EnumDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['allows']);
    };

    /**
     * @inheritDoc
     */
    EnumDefinition.prototype.getBaseData = function()
    {
        var basePropertyDefinition = EnumDefinition.$parent.prototype.getBaseData.call(this);

        /**
         * Allows to specify allowed property values.
         * Every value in array must belongs to one of the types: "number", "string", "boolean"
         *
         * @type {Array}
         */
        basePropertyDefinition.allows = null;
        basePropertyDefinition.nullable = false;

        return basePropertyDefinition;
    };

    return EnumDefinition;

})();
