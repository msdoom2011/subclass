/**
 * @class
 * @implements {Subclass.Property.PropertyTypeInterface}
 */
Subclass.Property.PropertyType = (function()
{
    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyType(propertyManager, propertyName, propertyDefinition)
    {
        /**
         * A name of current property
         *
         * @type {string}
         * @private
         */
        this._propertyName = propertyName;

        /**
         * An instance of property manager
         *
         * @type {PropertyManager}
         * @private
         */
        this._propertyManager = propertyManager;

        /**
         * A definition of current property
         *
         * @type {Subclass.Property.PropertyDefinition}
         * @private
         */
        this._propertyDefinition = this.createPropertyDefinition(propertyDefinition);

        /**
         * An instance of class which presents public api of current property
         *
         * @type {(PropertyAPI|null)}
         * @private
         */
        this._propertyAPI = null;

        /**
         * An instance of class which current property belongs to
         *
         * @type {(ClassType|null)}
         * @private
         */
        this._contextClass = null;

        /**
         * An instance of another property which current one belongs to
         *
         * @type {(PropertyType|null)}
         * @private
         */
        this._contextProperty = null;

        /**
         * A set of callbacks which will invoked when property changes its value
         *
         * @type {Function[]}
         * @private
         */
        this._watchers = [];

        /**
         * Checks if current value was ever modified (was set any value)
         *
         * @type {boolean}
         * @private
         */
        this._isModified = false;
    }

    PropertyType.$parent = Subclass.Property.PropertyTypeInterface;

    /**
     * @inheritDoc
     */
    PropertyType.prototype.initialize = function()
    {
        var propertyDefinition = this.getPropertyDefinition();

        if (this.getContextProperty()) {
            propertyDefinition.setAccessors(false);
        }
        propertyDefinition.validateDefinition();
        propertyDefinition.processDefinition();
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getContextProperty = function()
    {
        return this._contextProperty;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyName = function()
    {
        return this._propertyName;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyNameFull = function()
    {
        var propertyName = this.getPropertyName();
        var contextProperty = this.getContextProperty();
        var contextPropertyName = "";

        if (contextProperty) {
            contextPropertyName = contextProperty.getPropertyNameFull();
        }

        return (contextPropertyName && contextPropertyName + "." || "") + propertyName;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyNameHashed = function()
    {
        var propertyNameHash = this.getPropertyManager().getPropertyNameHash();
        var propertyName = this.getPropertyName();

        if (propertyName.indexOf(propertyNameHash) >= 0) {
            return propertyName;
        }
        return "_" + propertyName + "_" + propertyNameHash;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyDefinitionClass = function()
    {
        return Subclass.Property.PropertyDefinition;
    };

    /**
     * Creates and returns property definition instance.
     *
     * @param {Object} propertyDefinition
     * @returns {Subclass.Property.PropertyDefinition}
     */
    PropertyType.prototype.createPropertyDefinition = function(propertyDefinition)
    {
        var construct = null;
        var createInstance = true;

        if (!arguments[1]) {
            construct = this.getPropertyDefinitionClass();
        } else {
            construct = arguments[1];
        }
        if (arguments[2] === false) {
            createInstance = false;
        }

        if (construct.$parent) {
            var parentConstruct = this.createPropertyDefinition(
                propertyDefinition,
                construct.$parent,
                false
            );

            var constructProto = Object.create(parentConstruct.prototype);

            constructProto = Subclass.Tools.extend(
                constructProto,
                construct.prototype
            );

            construct.prototype = constructProto;
            construct.prototype.constructor = construct;
        }

        if (createInstance) {
            var inst = new construct(this, propertyDefinition);

            if (!(inst instanceof Subclass.Property.PropertyDefinition)) {
                throw new Error('Property definition class must be instance of ' +
                    '"Subclass.Property.PropertyDefinition" class.');
            }
            return inst;
        }

        return construct;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getPropertyDefinition = function()
    {
        return this._propertyDefinition;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getAPI = function(context)
    {
        if (!this._propertyAPI) {
            var apiClass = Subclass.Property.PropertyAPI;
            this._propertyAPI = new apiClass(this, context);
        }
        return this._propertyAPI;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.setIsModified = function(isModified)
    {
        if (typeof isModified != 'boolean') {
            throw new Error('Argument isModified must be a boolean value.');
        }
        if (this.getContextProperty()) {
            this.getContextProperty().setIsModified(isModified);
        }
        this._isModified = isModified;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.isModified = function()
    {
        return this._isModified;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.setContextClass = function(contextClass)
    {
        if ((
                !contextClass
                && contextClass !== null
            ) || (
                contextClass
                && !(contextClass instanceof Subclass.Class.ClassTypeInterface)
            )
        ) {
            var message = 'Trying to set not valid context class ' +
                'in property ' + this + '. It must be an instance of class "ClassType" or null. ';

            if (typeof contextClass == 'object') {
                message += 'Object with type "' + contextClass.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof contextClass) + '" was received instead.';
            }
            throw new Error(message);
        }
        this._contextClass = contextClass;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getContextClass = function()
    {
        return this._contextClass;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.setContextProperty = function(contextProperty)
    {
        if ((
                !contextProperty
                && contextProperty !== null
            ) || (
                contextProperty
                && !(contextProperty instanceof Subclass.Property.PropertyTypeInterface)
            )
        ) {
            var message = 'Trying to set not valid context property ' +
                'for property ' + this + '. It must be an instance of class "PropertyType" or null. ';

            if (typeof contextProperty == 'object' && contextProperty.$_className) {
                message += 'Instance of class "' + contextProperty.$_className + '" was received instead.';

            } else if (typeof contextProperty == 'object') {
                message += 'Object with type "' + contextProperty.constructor.name + '" was received instead.';

            } else {
                message += 'Value with type "' + (typeof contextProperty) + '" was received instead.';
            }
            throw new Error(message);
        }
        this._contextProperty = contextProperty;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getWatchers = function()
    {
        return this._watchers;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.addWatcher = function(callback)
    {
        if (typeof callback != "function") {
            throw new Error('Trying to add invalid watcher to property ' + this + '. It must be a function.');
        }
        if (!this.issetWatcher(callback)) {
            this._watchers.push(callback);
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.issetWatcher = function(callback)
    {
        return this._watchers.indexOf(callback) >= 0;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.removeWatcher = function(callback)
    {
        var watcherIndex;

        if ((watcherIndex = this._watchers.indexOf(callback)) >= 0) {
            this._watchers.splice(watcherIndex, 1);
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.removeWatchers = function()
    {
        this._watchers = [];
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.invokeWatchers = function(context, newValue, oldValue)
    {
        if (typeof context != "object" || Array.isArray(context)) {
            throw new Error('Trying to invoke watchers in invalid context in property ' + this + '. It must be an object.');
        }
        var watchers = this.getWatchers();

        for (var i = 0; i < watchers.length; i++) {
            newValue = watchers[i].call(context, newValue, oldValue);
        }

        return newValue;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.isEmpty = function(context)
    {
        var emptyValue = this.getPropertyDefinition().getEmptyValue();
        var value = this.getValue(context);

        return emptyValue === value;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.validateValue = function(value)
    {
        return this.getPropertyDefinition().validateValue(value);
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.setValue = function(context, value)
    {
        if (!this.getPropertyDefinition().isWritable()) {
            console.warn('Trying to change not writable property ' + this + ".");
            return;
        }
        if (this.getPropertyDefinition().isAccessors()) {
            var setterName = Subclass.Tools.generateSetterName(this.getPropertyName());
            return context[setterName](value);
        }
        var propName = this.getPropertyName();
        context[propName] = value;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getValue = function(context)
    {
        if (this.getPropertyDefinition().isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(this.getPropertyName());
            return context[getterName]();
        }
        var propName = this.getPropertyName();
        return context[propName];
    };

    /**
     *
     * @returns {*}
     */
    PropertyType.prototype.getDefaultValue = function()
    {
        return this.getPropertyDefinition().getValue();
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.generateGetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var propName = this.getPropertyName();

        if (
            this.getPropertyDefinition().isAccessors()
            || (
                !this.getPropertyDefinition().isAccessors()
                && this.getPropertyDefinition().isWritable()
            )
        ) {
            return function () {
                return this[hashedPropName];
            };

        } else {
            return function() {
                return this[propName];
            }
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.generateSetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        if (!this.getPropertyDefinition().isWritable()) {
            return function(value) {
                throw new Error('Property ' + $this + ' is not writable.');
            }
        }

        return function(value) {
            value = $this.invokeWatchers(this, value, $this.getValue(this));
            $this.validateValue(value);
            $this.setIsModified(true);
            this[hashedPropName] = value;
        };
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.attach = function(context)
    {
        if (!context) {
            throw new Error('To attach property "' + this.getPropertyNameFull() + '" you must specify context.');
        }
        var propName = this.getPropertyName();

        if (this.getPropertyDefinition().isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(propName);

            context[getterName] = this.generateGetter();

            if (this.getPropertyDefinition().isWritable()) {
                var setterName = Subclass.Tools.generateSetterName(propName);

                context[setterName] = this.generateSetter();
            }

        } else if (this.getPropertyDefinition().isWritable()) {
            Object.defineProperty(context, propName, {
                configurable: true,
                enumerable: true,
                get: this.generateGetter(),
                set: this.generateSetter()
            });

        } else {
            Object.defineProperty(context, propName, {
                configurable: true,
                writable: false,
                enumerable: true,
                value: this.getDefaultValue()
            });
        }
        if (Subclass.Tools.isPlainObject(context)) {
            this.attachHashedProperty(context);
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.attachHashedProperty = function(context)
    {
        if (!context) {
            throw new Error('To attach hashed property "' + this.getPropertyNameFull() + '" you must specify context.');
        }
        var hashedPropName = this.getPropertyNameHashed();
        var defaultValue = this.getDefaultValue();

        if (
            this.getPropertyDefinition().isWritable()
            && !this.getPropertyDefinition().isAccessors()
        ) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: defaultValue
            });

        } else if (this.getPropertyDefinition().isAccessors()) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                enumerable: true,
                writable: this.getPropertyDefinition().isWritable(),
                value: defaultValue
            });
        }
    };

    PropertyType.prototype.toString = function()
    {
        var propertyName = this.getPropertyNameFull();
        var contextClassName = this.getContextClass()
            ? (' in class "' + this.getContextClass().getClassName() + '"')
            : "";

        return '"' + propertyName + '"' + contextClassName;
    };

    return PropertyType;

})();
