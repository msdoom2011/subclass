/**
 * @namespace
 */
Subclass.Property.Type.Collection = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Collection.CollectionType = (function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function CollectionType(propertyManager, propertyName, propertyDefinition)
    {
        CollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );

        /**
         * @type {boolean}
         * @private
         */
        this._isNull = true;

        /**
         * @type {(Function|null)}
         * @private
         */
        this._collectionConstructor = null;

        /**
         * @type {(Collection|null)}
         * @private
         */
        this._collection = null;

        /**
         * @type {PropertyType}
         * @private
         */
        this._proto = null;
    }

    CollectionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    CollectionType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    CollectionType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.proto = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    CollectionType.prototype.isNull = function()
    {
        return this._isNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isNull
     */
    CollectionType.prototype.setIsNull = function(isNull)
    {
        this._isNull = isNull;
    };

    /**
    * Sets prototype of collection items
    *
    * @param {Subclass.Property.PropertyType} proto
    */
    CollectionType.prototype.setProto = function(proto)
    {
        this._proto = proto;
    };

    /**
     * Returns property definition which every collection element should match
     *
     * @returns {Object}
     */
    CollectionType.prototype.getProto = function()
    {
        return this._proto;
    };

    /**
     * Returns constructor of collection class which will operate with stored collection elements
     *
     * @returns {Function}
     */
    CollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.Collection;
    };

    /**
     * Returns prepared collection constructor
     *
     * @returns {Function}
     */
    CollectionType.prototype.getCollectionConstructor = function()
    {
        if (!this._collectionConstructor) {
            this._collectionConstructor = this.createCollectionConstructor();
        }
        return this._collectionConstructor;
    };

    /**
     * Builds collection class constructor
     *
     * @returns {Function}
     */
    CollectionType.prototype.createCollectionConstructor = function()
    {
        var collectionConstructor = arguments[0];

        if (!arguments[0]) {
            collectionConstructor = this.getCollectionClass();
        }

        if (collectionConstructor.$parent) {
            var parentCollectionConstructor = this.createCollectionConstructor(
                collectionConstructor.$parent,
                false
            );

            var collectionConstructorProto = Object.create(parentCollectionConstructor.prototype);

            collectionConstructorProto = Subclass.Tools.extend(
                collectionConstructorProto,
                collectionConstructor.prototype
            );

            collectionConstructor.prototype = collectionConstructorProto;

            Object.defineProperty(collectionConstructor.prototype, 'constructor', {
                enumerable: false,
                value: collectionConstructor
            });
        }

        return collectionConstructor;
    };

    /**
     * Returns collection instance
     *
     * @returns {Collection}
     */
    CollectionType.prototype.getCollection = function(context)
    {
        if (!this._collection) {
            var collectionConstructor = this.getCollectionConstructor();
            var propertyDefinition = this.getDefinition();
            var defaultValue = this.getDefaultValue();
            var proto = this.getProto();

            this._collection = new collectionConstructor(this, context);
            this.alterCollection();

            if (defaultValue !== null) {
                this.setIsNull(false);

                for (var propName in defaultValue) {
                    if (!defaultValue.hasOwnProperty(propName)) {
                        continue;
                    }
                    if (!propertyDefinition.isWritable()) {
                        proto.getDefinition().setWritable(false);
                    }
                    this.addCollectionItem(
                        propName,
                        defaultValue[propName]
                    );
                }
                this._collection.normalizeItems();
            }

            Object.seal(this._collection);
        }
        return this._collection;
    };

    /**
     * Alters collection instance
     */
    CollectionType.prototype.alterCollection = function()
    {
        // Do something
    };

    /**
     * Adds new item to collection
     *
     * @param key
     * @param value
     */
    CollectionType.prototype.addCollectionItem = function(key, value)
    {
        Subclass.Error.create('NotImplementedMethod')
            .method('addCollectionItem')
            .apply()
        ;
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.generateGetter = function()
    {
        var $this = this;

        return function() {
            if ($this.isNull()) {
                return null;
            }
            return this[$this.getNameHashed()];
        };
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.generateSetter = function()
    {
        var $this = this;

        return function(value) {
            $this.validateValue(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var childPropName in value) {
                    if (!value.hasOwnProperty(childPropName)) {
                        continue;
                    }
                    this[$this.getNameHashed()].setItem(
                        childPropName,
                        value[childPropName]
                    );
                }
            } else {
                $this.setIsNull(true);
                $this.getCollection(this).removeItems();
            }
        };
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.attachHashed = function(context)
    {
        var hashedPropName = this.getNameHashed();
        var defaultValue = this.getDefaultValue();

        if (defaultValue !== null) {
            this.setIsNull(false);
        }

        Object.defineProperty(context, hashedPropName, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: this.getCollection(context)
        });
    };

    return CollectionType;

})();