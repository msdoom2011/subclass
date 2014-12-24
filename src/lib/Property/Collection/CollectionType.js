Subclass.PropertyManager.PropertyTypes.CollectionType = (function()
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
        this._isValueNull = true;

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
    }

    CollectionType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    CollectionType.prototype.isValueNull = function()
    {
        return this._isValueNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isValueNull
     */
    CollectionType.prototype.setIsValueNull = function(isValueNull)
    {
        this._isValueNull = isValueNull;
    };

    /**
     * Returns property definition which every collection element should match
     *
     * @returns {Object}
     */
    CollectionType.prototype.getProto = function()
    {
        return this.getPropertyDefinition().proto;
    };

    /**
     * Returns constructor of collection class which will operate with stored collection elements
     *
     * @returns {Function}
     */
    CollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.PropertyManager.PropertyTypes.CollectionType.Collection;
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
            collectionConstructor.prototype.constructor = collectionConstructor;
        }

        return collectionConstructor;
    };

    /**
     * Returns collection instance
     *
     * @returns {Collection}
     */
    CollectionType.prototype.getCollection = function()
    {
        if (!this._collection) {
            var collectionConstructor = this.getCollectionConstructor();

            this._collection = new collectionConstructor(this);

            Object.seal(this._collection);
        }
        return this._collection;
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.generateGetter = function()
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
    CollectionType.prototype.generateSetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        return function(value) {
            $this.validate(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsValueNull(false);

                for (var childPropName in value) {
                    if (!value.hasOwnProperty(childPropName)) {
                        continue;
                    }
                    this[hashedPropName].setItem(
                        childPropName,
                        value[childPropName]
                    );
                }
            } else {
                $this.setIsValueNull(true);
                $this._collection.removeItems();
            }
        };
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.attachHashedProperty = function(context)
    {
        var hashedPropName = this.getPropertyNameHashed();
        var defaultValue = this.getDefaultValue();

        if (defaultValue !== null) {
            this.setIsValueNull(false);
        }

        Object.defineProperty(context, hashedPropName, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: this.getCollection()
        });
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.getBasePropertyDefinition = function()
    {
        var baseDefinition = CollectionType.$parent.prototype.getBasePropertyDefinition.call(this);

        baseDefinition.proto = null;

        return baseDefinition;
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.processPropertyDefinition = function()
    {
        CollectionType.$parent.prototype.processPropertyDefinition.call(this);

        if (!this.getProto() && Subclass.PropertyManager.issetPropertyType('untyped')) {
            var propertyDefinition = this.getPropertyDefinition();
            propertyDefinition.proto = { type: "untyped" }
        }
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.validatePropertyDefinition = function()
    {
        CollectionType.$parent.prototype.validatePropertyDefinition.call(this);

        if (!this.getProto()) {
            throw new Error('Missed required parameter "proto" ' +
                'in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
    };

    return CollectionType;

})();