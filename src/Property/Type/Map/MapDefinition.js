/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Type.Map.MapDefinition = (function()
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

    MapDefinition.$parent = Subclass.Property.PropertyDefinition;

    /**
     * @inheritDoc
     */
    MapDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    /**
     * @inheritDoc
     */
    MapDefinition.prototype.validateValue = function(value)
    {
        MapDefinition.$parent.prototype.validateValue.call(this, value);

        var property = this.getProperty();
        var error = false;

        if (
            value
            && (
                typeof value != 'object'
                || !Subclass.Tools.isPlainObject(value)
            )
        ) {
            error = true;
        }

        if (!error) {
            for (var propName in value) {
                if (!value.hasOwnProperty(propName)) {
                    continue;
                }
                if (!property.hasChild(propName)) {
                    var childrenProps = property.getChildren();

                    Subclass.Error.create(
                        'Trying to set not registered property "' + propName + '" ' +
                        'to not extendable map property ' + property + '. ' +
                        'Allowed properties are: "' + Object.keys(childrenProps).join('", "') + '".'
                    );

                } else {
                    property
                        .getChild(propName)
                        .validateValue(value[propName])
                    ;
                }
            }
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected("a plain object")
                .apply()
            ;
        }
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
        ) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('schema')
                .property(this.getProperty())
                .received(schema)
                .expected('a plain object with definitions of properties')
                .apply()
            ;
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
        this.getData().schema = schema;

        var propertyManager = this.getProperty().getPropertyManager();
        var property = this.getProperty();
        var defaultValue = {};

        for (var propName in schema) {
            if (!schema.hasOwnProperty(propName)) {
                continue;
            }
            schema[propName] = propertyManager.normalizePropertyDefinition(
                schema[propName]
            );
            if (!this.isWritable()) {
                schema[propName].writable = false;
            }
            property.addChild(propName, schema[propName]);

            defaultValue[propName] = property
                .getChild(propName)
                .getDefinition()
                .getDefault()
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
        return this.getData().schema;
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
    MapDefinition.prototype.getBaseData = function()
    {
        var baseDefinition = MapDefinition.$parent.prototype.getBaseData.call(this);

        /**
        * @inheritDoc
        * @type {{}}
        */
        baseDefinition.default = {};

        /**
         * Defines available properties in value
         * @type {null}
         */
        baseDefinition.schema = null;

        return baseDefinition;
    };

    /**
     * Validating property definition
     */
    MapDefinition.prototype.validateData = function()
    {
        MapDefinition.$parent.prototype.validateData.call(this);

        var schema = this.getSchema();

        if (schema && Subclass.Tools.isPlainObject(schema)) {
            for (var propName in schema) {
                if (
                    !schema.hasOwnProperty(propName)
                    || !schema[propName].hasOwnProperty('value')
                ) {
                    continue;
                }
                console.warn(
                    'Specified "value" attribute for definition of ' +
                    'property ' + this.getProperty() + ' was ignored.\n ' +
                    'The value from "default" attribute was applied instead.'
                );
            }
        }
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
                        .getDefinition()
                        ._setDefaultValues(defaultValue[propName])
                    ;
                } else if (property.hasChild(propName)) {
                    property.getChild(propName)
                        .getDefinition()
                        .setDefault(defaultValue[propName])
                    ;
                }
            }
        }
    };

    return MapDefinition;

})();
