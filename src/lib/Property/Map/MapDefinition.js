/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.PropertyDefinition}
 */
Subclass.PropertyManager.PropertyTypes.MapDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function MapDefinition (property, propertyDefinition)
    {
        MapDefinition.$parent.call(this, property, propertyDefinition);
    }

    MapDefinition.$parent = Subclass.PropertyManager.PropertyTypes.PropertyDefinition;

    /**
     * @inheritDoc
     */
    MapDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    /**
     * Validates "schema" attribute value
     *
     * @param {*} schema
     */
    MapDefinition.prototype.validateSchema = function(schema)
    {
        if (
            !schema
            || typeof schema != 'object'
            || !Subclass.Tools.isPlainObject(schema)
            || !Object.keys(schema).length
        ) {
            throw new Error('Attribute "schema" is not valid ' +
                'in definition of property ' + this.getProperty() + ".");
        }
    };

    /**
     * Sets property schema
     *
     * @param {(Function|null)} schema
     */
    MapDefinition.prototype.setSchema = function(schema)
    {
        this.validateSchema(schema);
        this.getDefinition().schema = schema;

        var property = this.getProperty();
        var defaultValue = {};

        for (var propName in schema) {
            if (!schema.hasOwnProperty(propName)) {
                continue;
            }
            if (!this.isWritable()) {
                schema[propName].writable = false;
            }
            property.addChild(propName, schema[propName]);

            defaultValue[propName] = property
                .getChild(propName)
                .getPropertyDefinition()
                .getValue()
            ;
        }
        this._setDefaultValues(defaultValue);
    };

    /**
     * Returns schema function or null
     *
     * @returns {(Function|null)}
     */
    MapDefinition.prototype.getSchema = function()
    {
        return this.getDefinition().schema;
    };

    /**
     * @inheritDoc
     */
    MapDefinition.prototype.getRequiredAttributes = function()
    {
        var attrs = MapDefinition.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['schema']);
    };

    /**
     * @inheritDoc
     */
    MapDefinition.prototype.getBaseDefinition = function()
    {
        var baseDefinition = MapDefinition.$parent.prototype.getBaseDefinition.call(this);

        /**
        * @inheritDoc
        * @type {{}}
        */
        baseDefinition.value = {};

        /**
         * Defines available properties in value
         * @type {null}
         */
        baseDefinition.schema = null;

        return baseDefinition;
    };

    /**
     * Sets default values for inner properties
     *
     * @param {*|Object} defaultValue
     * @private
     */
    MapDefinition.prototype._setDefaultValues = function(defaultValue)
    {
        if (defaultValue !== null && Subclass.Tools.isPlainObject(defaultValue)) {
            var property = this.getProperty();
            property.setIsNull(false);

            for (var propName in defaultValue) {
                if (!defaultValue.hasOwnProperty(propName)) {
                    continue;
                }
                if (
                    defaultValue[propName]
                    && Subclass.Tools.isPlainObject(defaultValue[propName])
                    && property.hasChild(propName)
                    && property.getChild(propName).constructor.getPropertyTypeName() == "map"
                ) {
                    property.getChild(propName)
                        .getPropertyDefinition()
                        ._setDefaultValues(defaultValue[propName])
                    ;
                } else if (property.hasChild(propName)) {
                    property.getChild(propName)
                        .getPropertyDefinition()
                        .setValue(defaultValue[propName])
                    ;
                }
            }
        }
    };

    return MapDefinition;

})();
