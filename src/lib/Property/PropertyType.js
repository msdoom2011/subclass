/**
 * @class
 * @implements {Subclass.Property.PropertyTypeInterface}
 */
Subclass.Property.PropertyType = (function()
{
    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyType(propertyManager, propertyName, propertyDefinition)
    {
        /**
         * An instance of property manager
         *
         * @type {Subclass.Property.PropertyManager}
         * @private
         */
        this._propertyManager = propertyManager;

        /**
         * A name of current property
         *
         * @type {string}
         * @private
         */
        this._name = propertyName;

        /**
         * A definition of current property
         *
         * @type {Subclass.Property.PropertyDefinition}
         * @private
         */
        this._definition = this.createDefinition(propertyDefinition);

        /**
         * An instance of class which presents public api of current property
         *
         * @type {(PropertyAPI|null)}
         * @private
         */
        this._api = null;

        /**
         * An instance of class to which current property belongs to
         *
         * @type {(ClassType|null)}
         * @private
         */
        this._contextClass = null;

        /**
         * An instance of another property to which current one belongs to
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
     * Returns name of current property type
     *
     * @static
     * @returns {string}
     */
    PropertyType.getPropertyTypeName = function()
    {
        throw new Error('Not implemented method "PropertyType#getPropertyTypeName".');
    };

    /**
     * Checks if specified value can be allowed by current property type
     *
     * @static
     * @returns {boolean}
     */
    PropertyType.isAllowedValue = function(value)
    {
        throw new Error('Not implemented method "PropertyType#isAllowedValue".');
    };

    /**
     * Parses passed property definition and returns required classes to load
     *
     * @param {Object} propertyDefinition
     */
    PropertyType.parseRequires = function(propertyDefinition)
    {
        throw new Error('Not implemented method "PropertyType#parseRequires".');
    };

    /**
     * @inheritDoc
     */
    PropertyType.getDefinitionClass = function()
    {
        return Subclass.Property.PropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.initialize = function()
    {
        var propertyDefinition = this.getDefinition();

        if (this.getContextProperty()) {
            propertyDefinition.setAccessors(false);
        }
        propertyDefinition.validateData();
        propertyDefinition.processData();
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
    PropertyType.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getNameFull = function()
    {
        var propertyName = this.getName();
        var contextProperty = this.getContextProperty();
        var contextPropertyName = "";

        if (contextProperty) {
            contextPropertyName = contextProperty.getNameFull();
        }

        return (contextPropertyName && contextPropertyName + "." || "") + propertyName;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getNameHashed = function()
    {
        var propertyNameHash = this.getPropertyManager().getPropertyNameHash();
        var propertyName = this.getName();

        if (propertyName.indexOf(propertyNameHash) >= 0) {
            return propertyName;
        }
        return "_" + propertyName + "_" + propertyNameHash;
    };

    /**
     * Renames current property
     *
     * @param {string} newName
     * @param {Object} context
     */
    PropertyType.prototype.rename = function(newName, context)
    {
        if (!newName || typeof newName != 'string') {
            throw new Error(
                'Specified invalid new value argument while was called method rename in property ' + this + '. ' +
                'It must be a string.'
            );
        }
        if (Object.isSealed(context)) {
            throw new Error(
                'Can\'t rename property ' + this + '. ' +
                'The context object is sealed.'
            );
        }
        var definition = this.getDefinition();
        var value = this.getValue(context, true);

        if (definition.isAccessors()) {
            throw new Error('Can\'t rename property ' + this + ' because it uses accessor functions.');
        }

        this.detach(context);
        this._name = newName;
        this.attach(context);
        this.setValue(context, value);
    };

    /**
     * Creates and returns property definition instance.
     *
     * @param {Object} propertyDefinition
     * @returns {Subclass.Property.PropertyDefinition}
     */
    PropertyType.prototype.createDefinition = function(propertyDefinition)
    {
        var construct = null;
        var createInstance = true;

        if (!arguments[1]) {
            construct = this.constructor.getDefinitionClass();
        } else {
            construct = arguments[1];
        }
        if (arguments[2] === false) {
            createInstance = false;
        }

        if (construct.$parent) {
            var parentConstruct = this.createDefinition(
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
    PropertyType.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getAPI = function(context)
    {
        if (!this._api) {
            var apiClass = Subclass.Property.PropertyAPI;
            this._api = new apiClass(this, context);
        }
        return this._api;
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
        var emptyValue = this.getDefinition().getEmptyValue();
        var value = this.getValue(context);

        return Subclass.Tools.isEqual(emptyValue, value);
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.validateValue = function(value)
    {
        return this.getDefinition().validateValue(value);
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.setValue = function(context, value)
    {
        if (!this.getDefinition().isWritable()) {
            console.warn('Trying to change not writable property ' + this + ".");
            return;
        }
        if (this.getDefinition().isAccessors()) {
            var setterName = Subclass.Tools.generateSetterName(this.getName());
            return context[setterName](value);
        }
        var propName = this.getName();
        context[propName] = value;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.getValue = function(context, dataOnly)
    {
        if (this.getDefinition().isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(this.getName());
            return context[getterName]();
        }
        var propName = this.getName();
        return context[propName];
    };

    /**
     * Sets property default value
     *
     * @param {*} value
     * @param {Object} [context]
     */
    PropertyType.prototype.setDefaultValue = function(context, value)
    {
        var propertyDefinition = this.getDefinition();
            propertyDefinition.setDefault(value);

        if (this.isDefaultValue(context)) {
            this.setValue(context, value);
            this.setIsModified(false);
        }
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyType.prototype.getDefaultValue = function()
    {
        return this.getDefinition().getDefault();
    };

    /**
     * Checks whether current property equals default and was not modified
     *
     * @param context
     * @returns {boolean}
     */
    PropertyType.prototype.isDefaultValue = function(context)
    {
        var oldDefaultValue = this.getDefaultValue();

        if (context) {
            if ((
                Subclass.Tools.isEqual(oldDefaultValue, this.getValue(context))
                && !this.isModified()
                ) || (
                oldDefaultValue === null
                && this.isEmpty(context)
                && !this.isModified()
                )
            ) {
                return true;
            }
        }
        return false;
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.generateGetter = function()
    {
        var $this = this;

        if (
            this.getDefinition().isAccessors()
            || (
                !this.getDefinition().isAccessors()
                && this.getDefinition().isWritable()
            )
        ) {
            return function () {
                return this[$this.getNameHashed()];
            };

        } else {
            return function() {
                return this[$this.getName()];
            }
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.generateSetter = function()
    {
        var $this = this;

        if (!this.getDefinition().isWritable()) {
            return function(value) {
                throw new Error('Property ' + $this + ' is not writable.');
            }
        }

        return function(value) {
            value = $this.invokeWatchers(this, value, $this.getValue(this));
            $this.validateValue(value);
            $this.setIsModified(true);
            this[$this.getNameHashed()] = value;
        };
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.attach = function(context)
    {
        if (!context) {
            throw new Error('To attach property "' + this.getNameFull() + '" you must specify context.');
        }
        var propName = this.getName();

        if (this.getDefinition().isAccessors()) {
            this.attachAccessors(context);

        } else if (this.getDefinition().isWritable()) {
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
            this.attachHashed(context);
        }
    };

    /**
     * Detaches property from class instance
     *
     * @param {Object} context
     */
    PropertyType.prototype.detach = function(context)
    {
        if (!context) {
            throw new Error('To detach property ' + this + ' cause you must specify context.');
        }
        if (Object.isSealed(context)) {
            throw new Error('Can\'t detach property ' + this + ' because the context object is sealed.');
        }
        var hashedPropName = this.getNameHashed();
        var propName = this.getName();

        for (var i = 0, propNames = [hashedPropName, propName]; i < propNames.length; i++) {
            delete context[propNames[i]];
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.attachAccessors = function(context)
    {
        var propName = this.getName();
        var getterName = Subclass.Tools.generateGetterName(propName);

        context[getterName] = this.generateGetter();

        if (this.getDefinition().isWritable()) {
            var setterName = Subclass.Tools.generateSetterName(propName);

            context[setterName] = this.generateSetter();
        }
    };

    /**
     * @inheritDoc
     */
    PropertyType.prototype.attachHashed = function(context)
    {
        if (!context) {
            throw new Error('To attach hashed property "' + this.getNameFull() + '" you must specify context.');
        }
        var hashedPropName = this.getNameHashed();
        var defaultValue = this.getDefaultValue();

        if (
            this.getDefinition().isWritable()
            && !this.getDefinition().isAccessors()
        ) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                writable: true,
                value: defaultValue
            });

        } else if (this.getDefinition().isAccessors()) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                enumerable: true,
                writable: this.getDefinition().isWritable(),
                value: defaultValue
            });
        }
    };

    PropertyType.prototype.toString = function()
    {
        var propertyName = this.getNameFull();
        var contextClassName = this.getContextClass()
            ? (' in class "' + this.getContextClass().getName() + '"')
            : "";

        return '"' + propertyName + '"' + contextClassName;
    };

    return PropertyType;

})();
