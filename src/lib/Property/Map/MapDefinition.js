/**
 * @class
 * @extends {Subclass.Property.PropertyDefinition}
 */
Subclass.Property.Map.MapDefinition = (function()
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
        if (MapDefinition.$parent.prototype.validateValue.call(this, value)) {
            return;
        }
        var property = this.getProperty();
        var error = false;

        if (
            typeof value != 'object'
            || !Subclass.Tools.isPlainObject(value)
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

                    throw new Error('Trying to set not registered property "' + propName + '" ' +
                        'to not extendable map property ' + property + '. ' +
                        'Allowed properties are: "' + Object.keys(childrenProps).join('", "') + '".');

                } else {
                    property
                        .getChild(propName)
                        .validateValue(value[propName])
                    ;
                }
            }
        }

        if (error) {
            var message = 'The value of the property ' + property + ' must be a plain object or null. ';

            if (typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
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
