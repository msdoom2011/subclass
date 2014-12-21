; Subclass.PropertyManager.PropertyTypes.PropertyType = (function()
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
         * @type {PropertyManager}
         * @private
         */
        this._propertyManager = propertyManager;

        /**
         * @type {(PropertyAPI|null)}
         * @private
         */
        this._propertyAPI = null;

        /**
         * @type {string}
         * @private
         */
        this._propertyName = propertyName;

        /**
         * @type {Object}
         * @private
         */
        this._propertyDefinition = propertyDefinition;

        /**
         * @type {(ClassType|null)}
         * @private
         */
        this._contextClass = null;

        /**
         * @type {(PropertyType|null)}
         * @private
         */
        this._contextProperty = null;

        /**
         * Defines if current property might accessed by the getters/setters
         * or by the Object.defineProperty property attributes
         *
         * @type {boolean}
         * @private
         */
        this._useAccessors = true;

        /**
         * Checks if current value was ever modified (was set any value)
         *
         * @type {boolean}
         * @private
         */
        this._isModified = false;

        /**
         * A set of callbacks which will invoked when property changes its value
         *
         * @type {Function[]}
         * @private
         */
        this._watchers = [];
    }

    PropertyType.$parent = null;

    /**
     * Returns name of current property type
     *
     * @returns {string}
     */
    PropertyType.getPropertyTypeName = function()
    {
        throw new Error('Static method "getPropertyTypeName" must be implemented.');
    };

    /**
     * Initializing property instance
     */
    PropertyType.prototype.initialize = function()
    {
        if (this.getContextProperty()) {
            this.setUseAccessors(false);
        }
        this.processPropertyDefinition();
        this.validatePropertyDefinition();
    };

    /**
     * Returns property manager instance
     *
     * @returns {PropertyManager}
     */
    PropertyType.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Returns property api
     *
     * @param {Object} context
     * @returns {Subclass.PropertyManager.PropertyTypes.PropertyAPI}
     */
    PropertyType.prototype.getAPI = function(context)
    {
        if (!this._propertyAPI) {
            var apiClass = Subclass.PropertyManager.PropertyTypes.PropertyAPI;
            this._propertyAPI = new apiClass(this, context);
        }
        return this._propertyAPI;
    };

    /**
     * Set option will accessor methods be generated or not
     *
     * @param {boolean} isUseAccessors
     */
    PropertyType.prototype.setUseAccessors = function(isUseAccessors)
    {
        if (typeof isUseAccessors != 'boolean') {
            throw new Error('Argument isUseAccessors must be a boolean value.');
        }
        this.getPropertyDefinition().accessors = isUseAccessors;
        this._useAccessors = isUseAccessors;
    };

    /**
     * Checks is will accessor methods be generated or not
     *
     * @returns {boolean}
     */
    PropertyType.prototype.isUseAccessors = function()
    {
        var propertyUseAccessors = this.getPropertyDefinition().accessors;

        return propertyUseAccessors === null
            ? this._useAccessors
            : propertyUseAccessors
        ;
    };

    /**
     * Setup marker if current property value was ever modified
     *
     * @param {boolean} isModified
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
                && !(contextClass instanceof Subclass.ClassManager.ClassTypes.ClassType)
            )
        ) {
            var message = 'Trying to set not valid context class ' +
                'in property "' + this.getPropertyNameFull() + '". ' +
                'It must be an instance of class "ClassType" or null. ';

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
     * Returns context class instance which current property belongs to
     *
     * @returns {ClassType|*}
     */
    PropertyType.prototype.getContextClass = function()
    {
        return this._contextClass;
    };

    /**
     * Sets name of the chain of properties which current property belongs to.
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
                && !(contextProperty instanceof Subclass.PropertyManager.PropertyTypes.PropertyType)
            )
        ) {
            var message = 'Trying to set not valid context property ' +
                'for property "' + this.getPropertyName() + '". ' +
                'It must be an instance of class "PropertyType" or null. ';

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
     * Returns name of the chain of properties which current property belongs to.
     *
     * @returns {string}
     */
    PropertyType.prototype.getContextProperty = function()
    {
        return this._contextProperty;
    };

    /**
     * Returns property definition
     *
     * @returns {Object}
     */
    PropertyType.prototype.getPropertyDefinition = function()
    {
        return this._propertyDefinition;
    };

    /**
     * Returns property clear name
     *
     * @returns {string}
     */
    PropertyType.prototype.getPropertyName = function()
    {
        return this._propertyName;
    };

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
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
     * Returns property hashed name
     *
     * @returns {*}
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
     *      "this" variable inside callback function will link to the class instance which property belongs to
     *      This callback function MUST return newValue value.
     *      So you can modify it if you need.
     */
    PropertyType.prototype.addWatcher = function(callback)
    {
        if (typeof callback != "function") {
            throw new Error('Trying to add invalid watcher to property "' + this._property.getPropertyNameFull() + '" ' +
                (this._property.getContextClass() ? (' in class "' + this._property.getContextClass().getClassName() + '"') : "") + ". " +
                'It must be a function.');
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
     * @param callback
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
     * Invokes all registerd watcher functions
     *
     * @param {Object} context
     * @param {*} newValue
     * @param {*} oldValue
     */
    PropertyType.prototype.invokeWatchers = function(context, newValue, oldValue)
    {
        if (typeof context != "object" || Array.isArray(context)) {
            throw new Error('Trying to invoke watchers in invalid context in property "' + this._property.getPropertyNameFull() + '" ' +
                (this._property.getContextClass() ? (' in class "' + this._property.getContextClass().getClassName() + '"') : "") + ". " +
                'It must be an object.');
        }
        var watchers = this.getWatchers();

        for (var i = 0; i < watchers.length; i++) {
            newValue = watchers[i].call(context, newValue, oldValue);
        }

        return newValue;
    };

    /**
     * Returns property type
     *
     * @returns {*}
     */
    PropertyType.prototype.getType = function()
    {
        return this.getPropertyDefinition().type;
    };

    /**
     * Checks if current property is writable
     *
     * @returns {*}
     */
    PropertyType.prototype.isWritable = function()
    {
        return this.getPropertyDefinition().writable;
    };

    /**
     * Sets property default value
     */
    PropertyType.prototype.setDefaultValue = function(value)
    {
        this.getPropertyDefinition().value = value;
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyType.prototype.getDefaultValue = function()
    {
        return this.getPropertyDefinition().value;
    };

    /**
     * Generates property getter function
     *
     * @returns {Function}
     */
    PropertyType.prototype.generateGetter = function()
    {
        var hashedPropName = this.getPropertyNameHashed();
        var propName = this.getPropertyName();
        var $this = this;

        if (
            this.isUseAccessors()
            || (
                !this.isUseAccessors()
                && this.isWritable()
            )
        ) {
            return function () {
                //if (!this.hasOwnProperty(hashedPropName)) {
                //    $this.attachHashedProperty(this);
                //}
                return this[hashedPropName];
            };

        } else {
            return function() {
                return this[propName];
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
        var hashedPropName = this.getPropertyNameHashed();
        var $this = this;

        if (!this.isWritable()) {
            return function(value) {
                throw new Error('Property "' + $this.getPropertyNameFull() + '" is not writable' +
                ($this.getContextClass() && ' in class "' + $this.getContextClass().getClassName() + '"') + '.');
            }
        }

        return function(value) {
            value = $this.invokeWatchers(this, value, $this.getValue(this));
            $this.validate(value);
            $this.setIsModified(true);

            //if (!this.hasOwnProperty(hashedPropName)) {
            //    $this.attachHashedProperty(this);
            //}
            this[hashedPropName] = value;
        };
    };

    /**
     * Returns value of current property
     *
     * @param {Object} context An object which current property belongs to.
     */
    PropertyType.prototype.getValue = function(context)
    {
        if (this.isUseAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(this.getPropertyName());
            return context[getterName]();
        }
        var propName = this.getPropertyName();
        return context[propName];
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
        if (!this.isWritable()) {
            console.warn('Trying to change not writable property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass() + '"' || "") + ".");
            return;
        }
        if (this.isUseAccessors()) {
            var setterName = Subclass.Tools.generateSetterName(this.getPropertyName());
            return context[setterName](value);
        }
        var propName = this.getPropertyName();
        context[propName] = value;
    };

    /**
     * Attaches property to specified context
     *
     * @param {Object} context
     */
    PropertyType.prototype.attach = function(context)
    {
        if (!context) {
            throw new Error('To attach property "' + this.getPropertyNameFull() + '" you must specify context.');
        }
        var propName = this.getPropertyName();

        if (this.isUseAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(propName);

            context[getterName] = this.generateGetter();

            if (this.isWritable()) {
                var setterName = Subclass.Tools.generateSetterName(propName);

                context[setterName] = this.generateSetter();
            }

        } else if (this.isWritable()) {
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
     * Attaches property that will hold property value in class instance
     *
     * @param {Object} context
     */
    PropertyType.prototype.attachHashedProperty = function(context)
    {
        if (!context) {
            throw new Error('To attach hashed property "' + this.getPropertyNameFull() + '" you must specify context.');
        }
        var hashedPropName = this.getPropertyNameHashed();
        var defaultValue = this.getDefaultValue();

        if (this.isWritable() && !this.isUseAccessors()) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                enumerable: true,
                writable: true,
                value: defaultValue
            });

        } else if (this.isUseAccessors()) {
            Object.defineProperty(context, hashedPropName, {
                configurable: true,
                enumerable: true,
                writable: this.isWritable(),
                value: defaultValue
            });
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
            throw new Error('To detach property "' + this.getPropertyNameFull() + '" you must specify context.');
        }
        var hashedPropName = this.getPropertyNameHashed();
        var propName = this.getPropertyName();

        for (var i = 0, propNames = [hashedPropName, propName]; i < propNames.length; i++) {
            delete context[propNames[i]];
        }
    };

    /**
     * Validates property value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    PropertyType.prototype.validate = function(value)
    {
        // Do needed validations
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    PropertyType.prototype.getBasePropertyDefinition = function()
    {
        return {
            /**
             * @type {string} Type of parameter
             */
            type: null,

            /**
             * @type {(*|null)} Default value
             */
            value: null,

            /**
             * @type {boolean} True if current parameter is changeable
             */
            writable: true,

            /**
             * @type {(function|null)} Callback that triggers when trying to set property value.
             *      It takes two arguments: the new value and the old value of property.
             */
            watcher: null,

            /**
             * @type {(boolean|null)} Indicates that accessor functions would be generated
             */
            accessors: null
        };
    };

    /**
     * Processing property definition
     */
    PropertyType.prototype.processPropertyDefinition = function()
    {
        var basePropertyDefinition = this.getBasePropertyDefinition();
        var propertyDefinition = this.getPropertyDefinition();

        this._propertyDefinition = Subclass.Tools.extend(basePropertyDefinition, propertyDefinition);
    };

    /**
     * Validating property definition
     */
    PropertyType.prototype.validatePropertyDefinition = function()
    {
        var propertyDefinition = this.getPropertyDefinition();
        var accessors = propertyDefinition.accessors;
        var writable = propertyDefinition.writable;
        var watcher = propertyDefinition.watcher;

        // Validating accessors attribute value

        if (accessors !== null && typeof accessors != 'boolean') {
            throw new Error('Invalid value of attribute "accessors" in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass().getClassName() + '"') + '. ' +
                'It must be a boolean or null.');
        }

        // Validating watcher attribute value

        if (watcher !== null && typeof watcher != 'function') {
            throw new Error('Invalid value of attribute "watcher" in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass().getClassName() + '"') + '. ' +
                'It must be a function or null.');
        }

        // Validating writable attribute value

        if (typeof writable != 'boolean') {
            throw new Error('Invalid value of attribute "writable" in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass().getClassName() + '"') + '. ' +
                'It must be a boolean.');
        }

        try {
            this.validate(this.getDefaultValue());

        } catch (e) {
            console.error("Error! Invalid default value!");
            throw e.stack;
        }
    };

    return PropertyType;

})();
