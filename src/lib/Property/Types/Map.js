; Subclass.PropertyManager.PropertyTypes.Map = (function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function MapType(propertyManager, propertyName, propertyDefinition)
    {
        /**
         * @type {Object.<PropertyType>}
         * @private
         */
        this._children = {};

        /**
         * @type {boolean}
         * @private
         */
        this._isValueNull = true;

        MapType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    MapType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    MapType.getPropertyTypeName = function()
    {
        return "map";
    };

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    MapType.prototype.isValueNull = function()
    {
        return this._isValueNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isValueNull
     */
    MapType.prototype.setIsValueNull = function(isValueNull)
    {
        this._isValueNull = isValueNull;
    };

    MapType.prototype.getSchema = function()
    {
        return this.getPropertyDefinition().schema;
    };

    /**
     * Returns list of children properties instances
     *
     * @returns {Object}
     */
    MapType.prototype.getChildren = function()
    {
        return this._children;
    };

    /**
     * Adds children property to current
     *
     * @param {string} childPropName
     * @param {Object} childPropDefinition
     * @returns {PropertyType}
     */
    MapType.prototype.addChild = function(childPropName, childPropDefinition)
    {
        return this._children[childPropName] = this.getPropertyManager().createProperty(
            childPropName,
            childPropDefinition,
            this.getContextClass(),
            this
        );
    };

    /**
     * Returns children property instance
     *
     * @param {string} childPropName
     * @returns {PropertyType}
     */
    MapType.prototype.getChild = function(childPropName)
    {
        return this.getChildren()[childPropName];
    };

    /**
     * Checks if child property with specified name was registered
     *
     * @param {string} childPropName
     * @returns {boolean}
     */
    MapType.prototype.hasChild = function(childPropName)
    {
        return !!this.getChild(childPropName);
    };

    /**
    * @inheritDoc
    */
    MapType.prototype.generateGetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function() {
            if ($this.isValueNull()) {
                return null;
            }
            return this[hashedPropName];
        };
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.generateSetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function(value) {
            value = $this.invokeWatchers(this, value, $this.getValue(this));
            $this.validate(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsValueNull(false);

                for (var childPropName in value) {
                    if (!value.hasOwnProperty(childPropName)) {
                        continue;
                    }
                    this[hashedPropName][childPropName] = value[childPropName];
                }
            } else {
                $this.setIsValueNull(true);
            }
        };
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.attachHashedProperty = function(context)
    {
        var hashedPropName = this.getPropertyNameHashed();

        context[hashedPropName] = {};
        this.attachChildren(context);

        Object.seal(context[hashedPropName]);
    };

    /**
     * Attaches children property to current property
     *
     * @param {Object} context
     */
    MapType.prototype.attachChildren = function(context)
    {
        var propertyDefinition = this.getPropertyDefinition();

        if (propertyDefinition.writable) {
            var propertyNameHashed = this.getPropertyNameHashed();
            var childrenContext = context[propertyNameHashed];
            var children = this.getChildren();

            for (var childPropName in children) {
                if (!children.hasOwnProperty(childPropName)) {
                    continue;
                }
                children[childPropName].attach(childrenContext);
            }
        }
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.validate = function(value)
    {
        var error = false;

        if (
            value !== null
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
                if (!this.hasChild(propName)) {
                    var childrenProps = this.getChildren();

                    throw new Error('Trying to set not registered property "' + propName + '" ' +
                        'to not extendable map property "' + this.getPropertyNameFull() + '"' +
                        (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". " +
                        'Allowed properties are: "' + Object.keys(childrenProps).join('", "') + '".');

                } else {
                    this.getChild(propName).validate(value[propName]);
                }
            }
        }

        if (error) {
            var message = 'The value of the property "' + this.getPropertyNameFull() + '" must be a plain object or null' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

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
     * @inheritDoc
     */
    MapType.prototype.getBasePropertyDefinition = function()
    {
        var baseDefinition = MapType.$parent.prototype.getBasePropertyDefinition.call(this);

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
     * @inheritDoc
     */
    MapType.prototype.processPropertyDefinition = function()
    {
        MapType.$parent.prototype.processPropertyDefinition.call(this);

        var schema = this.getSchema();

        if (
            schema
            && typeof schema == 'object'
            && Subclass.Tools.isPlainObject(schema)
            && Object.keys(schema).length
        ) {
            var defaultValue = {};

            for (var propName in schema) {
                if (!schema.hasOwnProperty(propName)) {
                    continue;
                }
                if (!this.isWritable()) {
                    schema[propName].writable = false;
                }
                this.addChild(propName, schema[propName]);
                defaultValue[propName] = this._children[propName].getDefaultValue();
            }
            this.setDefaultValues(defaultValue);
        }
    };

    /**
     * Sets default values for inner properties
     *
     * @param defaultValue
     */
    MapType.prototype.setDefaultValues = function(defaultValue)
    {
        if (defaultValue !== null && Subclass.Tools.isPlainObject(defaultValue)) {
            this.setIsValueNull(false);

            for (var propName in defaultValue) {
                if (!defaultValue.hasOwnProperty(propName)) {
                    continue;
                }
                if (
                    defaultValue[propName]
                    && Subclass.Tools.isPlainObject(defaultValue[propName])
                    && this.hasChild(propName)
                    && this.getChild(propName).constructor.getPropertyTypeName() == "map"
                ) {
                    this.getChild(propName).setDefaultValues(defaultValue[propName]);

                } else if (this.hasChild(propName)) {
                    this.getChild(propName).setDefaultValue(defaultValue[propName]);
                }
            }
        }
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.validatePropertyDefinition = function()
    {
        var defaultValue = this.getDefaultValue();
        var schema = this.getSchema();

        if (
            !schema
            || typeof schema != 'object'
            || !Subclass.Tools.isPlainObject(schema)
            || !Object.keys(schema).length
        ) {
            throw new Error('Attribute "schema" is missed or not valid ' +
                'in definition of property "' + this.getPropertyName() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }

        if (defaultValue !== null && !Subclass.Tools.isPlainObject(defaultValue)) {
            throw new Error('Invalid default value! It must be plain object or null ' +
            'in property "' + this.getPropertyNameFull() + '"' +
            (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }

        MapType.$parent.prototype.validatePropertyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(MapType);

    return MapType;

})();