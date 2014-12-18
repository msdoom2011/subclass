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
                && !(contextClass instanceof Subclass.ClassTypes.ClassType)
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
     * Returns callback function that triggers when trying to get property value
     *
     * @returns {Function|null}
     */
    PropertyType.prototype.getOnGet = function()
    {
        return this.getPropertyDefinition().onGet;
    };

    /**
     * Returns callback function that triggers when trying to set property value
     *
     * @returns {Function|null}
     */
    PropertyType.prototype.getOnSet = function()
    {
        return this.getPropertyDefinition().onSet;
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
                if (!this.hasOwnProperty(hashedPropName)) {
                    $this.attachHashedProperty(this);
                }
                var value = this[hashedPropName];

                if ($this.getOnGet()) {
                    value = $this.getOnSet()(value);
                }
                return value;
            };

        } else {
            return function() {
                var value = this[propName];

                if ($this.getOnGet()) {
                    value = $this.getOnSet()(value);
                }
                return value;
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
            if ($this.getOnSet()) {
                value = $this.getOnSet()(value);
            }
            $this.validate(value);
            $this.setIsModified(true);

            if (!this.hasOwnProperty(hashedPropName)) {
                $this.attachHashedProperty(this);
            }
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
             * @type {(function|null)} Callback that triggers when trying to get property value
             */
            onGet: null,

            /**
             * @type {(function|null)} Callback that triggers when trying to set property value
             */
            onSet: null,

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
        var onGet = propertyDefinition.onGet;
        var onSet = propertyDefinition.onSet;
        var writable = propertyDefinition.writable;

        // Validating accessors attribute value

        if (accessors !== null && typeof accessors != 'boolean') {
            throw new Error('Invalid value of attribute "accessors" in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass().getClassName() + '"') + '. ' +
                'It must be a boolean or null.');
        }

        // Validating onGet attribute value

        if (onGet !== null && typeof onGet != 'function') {
            throw new Error('Invalid value of attribute "onGet" in definition of property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() && ' in class "' + this.getContextClass().getClassName() + '"') + '. ' +
                'It must be a function or null.');
        }

        // Validating onSet attribute value

        if (onSet !== null && typeof onSet != 'function') {
            throw new Error('Invalid value of attribute "onSet" in definition of property "' + this.getPropertyNameFull() + '"' +
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


    /*************************************************/
    /*        Performing register operations         */
    /*************************************************/

    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Returns name of class property getter function
         *
         * @param {string} propertyName
         * @returns {string}
         */
        generateGetterName: function(propertyName)
        {
            return generateAccessorName("get", propertyName);
        },

        /**
         * Returns name of class property setter function
         *
         * @param {string} propertyName
         * @returns {string}
         */
        generateSetterName: function(propertyName)
        {
            return generateAccessorName("set", propertyName);
        }
    });

    /**
     * Generates class property accessor function name
     *
     * @param {string} accessorType Can be "get" or "set"
     * @param {string} propertyName
     * @returns {string}
     */
    function generateAccessorName(accessorType, propertyName)
    {
        if (['get', 'set'].indexOf(accessorType) < 0) {
            throw new Error('Invalid accessor type! It can be only "get" or "set".');
        }
        var propNameParts = propertyName.split("_");

        for (var i = 0; i < propNameParts.length; i++) {
            if (propNameParts[i] === "") {
                continue;
            }
            propNameParts[i] = propNameParts[i][0].toUpperCase() + propNameParts[i].substr(1);
        }

        return accessorType + propNameParts.join("");
    }

    return PropertyType;

})();
