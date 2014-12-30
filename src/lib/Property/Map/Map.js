/**
 * @namespace
 */
Subclass.Property.Map = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Map.Map = (function()
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
        this._isNull = true;

        MapType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    MapType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    MapType.getPropertyTypeName = function()
    {
        return "map";
    };

    /**
     * @inheritDoc
     */
    MapType.isAllowedValue = function(value)
    {
        return Subclass.Tools.isPlainObject(value);
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.Property.Map.MapDefinition;
    };

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    MapType.prototype.isNull = function()
    {
        return this._isNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isNull
     */
    MapType.prototype.setIsNull = function(isNull)
    {
        this._isNull = isNull;
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
            if ($this.isNull()) {
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
            $this.validateValue(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var childPropName in value) {
                    if (!value.hasOwnProperty(childPropName)) {
                        continue;
                    }
                    this[hashedPropName][childPropName] = value[childPropName];
                }
            } else {
                $this.setIsNull(true);
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

        if (propertyDefinition.isWritable()) {
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


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MapType);

    return MapType;

})();