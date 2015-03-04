/**
 * @class
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

    PropertyType.$parent = null;

    /**
     * Returns name of current property type
     *
     * @static
     * @returns {string}
     */
    PropertyType.getPropertyTypeName = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .method("getPropertyTypeName")
            .apply()
        ;
    };

    /**
     * Parses passed property definition and returns required classes to load
     *
     * @param {Object} propertyDefinition
     */
    PropertyType.parseRelatedClasses = function(propertyDefinition)
    {
        Subclass.Error.create('NotImplementedMethod')
            .method("parseRelatedClasses")
            .apply()
        ;
    };

    /**
     * Returns property definition constructor
     *
     * @returns {Function}
     */
    PropertyType.getDefinitionClass = function()
    {
        return Subclass.Property.PropertyDefinition;
    };

    /**
     * Returns the empty definition of property
     *
     * @returns {(Object|boolean)}
     */
    PropertyType.getEmptyDefinition = function()
    {
        return {
            type: this.getPropertyTypeName()
        };
    };

    PropertyType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.default = definition[1];

                if (definition[1] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 3) {
                fullDefinition.writable = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.nullable = definition[3];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Initializing property instance
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
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    PropertyType.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Returns property clear name
     *
     * @returns {string}
     */
    PropertyType.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
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
     * Returns property hashed name
     *
     * @returns {*}
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
            Subclass.Error.create(
                'Specified invalid new value argument while was called method rename in property ' + this + '. ' +
                'It must be a string.'
            );
        }
        if (Object.isSealed(context)) {
            Subclass.Error.create(
                'Can\'t rename property ' + this + '. ' +
                'The context object is sealed.'
            );
        }
        var definition = this.getDefinition();
        var value = this.getValue(context, true);

        if (definition.isAccessors()) {
            Subclass.Error.create('Can\'t rename property ' + this + ' because it uses accessor functions.');
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
                Subclass.Error.create(
                    'Property definition class must be instance of ' +
                    '"Subclass.Property.PropertyDefinition" class.'
                );
            }
            return inst;
        }

        return construct;
    };

    /**
     * Returns property definition instance
     *
     * @returns {Subclass.Property.PropertyDefinition}
     */
    PropertyType.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Returns property api
     *
     * @param {Object} context
     * @returns {Subclass.Property.PropertyAPI}
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
     * Setup marker if current property value was ever modified
     *
     * @param {boolean} isModified
     */
    PropertyType.prototype.setIsModified = function(isModified)
    {
        if (typeof isModified != 'boolean') {
            Subclass.Error.create('InvalidArgument')
                .argument("the property modified marker value", false)
                .received(isModified)
                .expected("a boolean")
                .apply()
            ;
        }
        if (this.getContextProperty()) {
            this.getContextProperty().setIsModified(isModified);
        }
        this._isModified = isModified;
    };

    /**
     * Checks if current property value was ever modified
     *
     * @returns {boolean}
     */
    PropertyType.prototype.isModified = function()
    {
        return this._isModified;
    };

    /**
     * Sets property context class
     *
     * @param {(ClassType|null)} contextClass
     */
    PropertyType.prototype.setContextClass = function(contextClass)
    {
        if ((
                !contextClass
                && contextClass !== null
            ) || (
                contextClass
                && !(contextClass instanceof Subclass.Class.ClassType)
            )
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument("the context class instance", false)
                .received(contextClass)
                .expected('an instance of class "Subclass.Class.ClassType"')
                .apply()
            ;
        }
        this._contextClass = contextClass;
    };

    /**
     * Returns context class instance to which current property belongs to
     *
     * @returns {(ClassType|null)}
     */
    PropertyType.prototype.getContextClass = function()
    {
        return this._contextClass;
    };

    /**
     * Sets name of the chain of properties to which current property belongs to.
     *
     * @param {(PropertyType|null)} contextProperty
     */
    PropertyType.prototype.setContextProperty = function(contextProperty)
    {
        if ((
                !contextProperty
                && contextProperty !== null
            ) || (
                contextProperty
                && !(contextProperty instanceof Subclass.Property.PropertyType)
            )
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument("the context property instance", false)
                .received(contextProperty)
                .expected('an instance of "Subclass.Property.PropertyType" class')
                .apply()
            ;
        }
        this._contextProperty = contextProperty;
    };

    /**
     * Returns name of the chain of properties to which current property belongs to.
     *
     * @returns {string}
     */
    PropertyType.prototype.getContextProperty = function()
    {
        return this._contextProperty;
    };

    /**
     * Returns all registered watchers
     *
     * @returns {Function[]}
     */
    PropertyType.prototype.getWatchers = function()
    {
        return this._watchers;
    };

    /**
     * Adds new watcher
     *
     * @param {Function} callback Function, that takes two arguments:
     *      - newValue {*} New property value
     *      - oldValue {*} Old property value
     *
     *      "this" variable inside callback function will link to the class instance to which property belongs to
     *      This callback function MUST return newValue value.
     *      So you can modify it if you need.
     */
    PropertyType.prototype.addWatcher = function(callback)
    {
        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (!this.issetWatcher(callback)) {
            this._watchers.push(callback);
        }
    };

    /**
     * Checks if specified watcher callback is registered
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    PropertyType.prototype.issetWatcher = function(callback)
    {
        return this._watchers.indexOf(callback) >= 0;
    };

    /**
     * Removes specified watcher callback
     *
     * @param {Function} callback
     */
    PropertyType.prototype.removeWatcher = function(callback)
    {
        var watcherIndex;

        if ((watcherIndex = this._watchers.indexOf(callback)) >= 0) {
            this._watchers.splice(watcherIndex, 1);
        }
    };

    /**
     * Unbind all watchers from current property
     */
    PropertyType.prototype.removeWatchers = function()
    {
        this._watchers = [];
    };

    /**
     * Invokes all registered watcher functions
     *
     * @param {Object} context
     * @param {*} newValue
     * @param {*} oldValue
     */
    PropertyType.prototype.invokeWatchers = function(context, newValue, oldValue)
    {
        if (typeof context != "object" || Array.isArray(context)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
        }
        var watchers = this.getWatchers();

        for (var i = 0; i < watchers.length; i++) {
            newValue = watchers[i].call(context, newValue, oldValue);
        }

        return newValue;
    };

    /**
     * Checks if property contains empty value
     *
     * @returns {boolean}
     */
    PropertyType.prototype.isEmpty = function(context)
    {
        var emptyValue = this.getDefinition().getEmptyValue();
        var value = this.getValue(context);

        return Subclass.Tools.isEqual(emptyValue, value);
    };

    /**
     * Validates property value. Throws error if value is invalid
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    PropertyType.prototype.validateValue = function(value)
    {
        return this.getDefinition().validateValue(value);
    };

    /**
     * Sets property value
     *
     * @param {Object} context
     * @param {*} value
     * @returns {*}
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
     * Returns value of current property
     *
     * @param {Object} context An object to which current property belongs to.
     * @param {boolean} [dataOnly] Returns only data without hashed fields and accessor functions
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
     * Generates property getter function
     *
     * @returns {Function}
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
     * Generates setter for specified property
     *
     * @returns {function}
     */
    PropertyType.prototype.generateSetter = function()
    {
        var $this = this;

        if (!this.getDefinition().isWritable()) {
            return function(value) {
                Subclass.Error.create('Property ' + $this + ' is not writable.');
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
     * Attaches property to specified context
     *
     * @param {Object} context
     */
    PropertyType.prototype.attach = function(context)
    {
        if (!context || typeof context != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
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
        if (!context || typeof context != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
        }
        if (Object.isSealed(context)) {
            Subclass.Error.create('Can\'t detach property ' + this + ' because the context object is sealed.');
        }
        var hashedPropName = this.getNameHashed();
        var propName = this.getName();

        for (var i = 0, propNames = [hashedPropName, propName]; i < propNames.length; i++) {
            delete context[propNames[i]];
        }
    };

    /**
     * Attaches property accessor functions
     *
     * @param {Object} context
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
     * Attaches property that will hold property value in class instance
     *
     * @param {Object} context
     */
    PropertyType.prototype.attachHashed = function(context)
    {
        if (!context || typeof context != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
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

    /**
     * Return string implementation of property
     *
     * @returns {string}
     */
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
