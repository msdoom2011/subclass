/**
 * @namespace
 */
Subclass.Property = {};

/**
 * @namespace
 */
Subclass.Property.Error = {};

/**
 * @namespace
 */
Subclass.Property.Type = {};

/**
 * @class
 */
Subclass.Property.PropertyManager = (function()
{
    /**
     * Property manager constructor
     *
     * @param {Subclass.Module.Module} module - Instance of module
     * @constructor
     */
    function PropertyManager(module)
    {
        /**
         * Instance of module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * Random number that will be added to hashed property names
         *
         * @type {number}
         * @private
         */
        this._hash = Math.round(Math.abs(new Date().getTime() * Math.random() / 100000));

        /**
         * Data types manager
         *
         * @type {Subclass.Property.DataTypeManager}
         * @private
         */
        this._dataTypeManager = new Subclass.Property.DataTypeManager(this);
    }

    PropertyManager.prototype.initialize = function()
    {
        this.getDataTypeManager().initialize();
    };

    /**
     * Returns subclass module instance
     *
     * @returns {Subclass.Module.Module}
     */
    PropertyManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns instance of data type manager
     *
     * @returns {Subclass.Property.DataTypeManager}
     */
    PropertyManager.prototype.getDataTypeManager = function()
    {
        return this._dataTypeManager;
    };

    /**
     * Defines data types
     *
     * @param {Object.<Object>} definitions
     */
    PropertyManager.prototype.defineDataTypes = function(definitions)
    {
        this.getDataTypeManager().addTypeDefinitions(definitions);
    };

    /**
     * Returns hash of all properties that will further created
     *
     * @returns {number}
     */
    PropertyManager.prototype.getPropertyNameHash = function()
    {
        return this._hash;
    };

    /**
     * Creates specified type property constructor
     *
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @returns {Function}
     */
    PropertyManager.prototype.createPropertyConstructor = function(propertyName, propertyDefinition)
    {
        var propertyTypeName = propertyDefinition.type;
        var classConstructor;

        if (arguments[2]) {
            classConstructor = arguments[2];

        } else {
            classConstructor = Subclass.Property.PropertyManager.getPropertyType(propertyTypeName);
        }

        if (classConstructor.$parent) {
            var parentClassConstructor = this.createPropertyConstructor(
                propertyName,
                propertyDefinition,
                classConstructor.$parent
            );

            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            classConstructorProto = Subclass.Tools.extend(
                classConstructorProto,
                classConstructor.prototype
            );

            classConstructor.prototype = classConstructorProto;
            classConstructor.prototype.constructor = classConstructor;
        }

        return classConstructor;
    };

    /**
     * Creates instance of specified type property
     *
     * @param {string} propertyName
     *      A name of the property.
     *
     * @param {Object} propertyDefinition
     *      A plain object which describes property.
     *
     * @param {ClassType} [contextClass]
     *      A Subclass.Class.ClassType instance to which creating property will belongs to.
     *
     * @param {PropertyType} [contextProperty]
     *      A Subclass.Property.PropertyType instance to witch creating property will belongs to.
     *
     * @returns {Subclass.Property.PropertyType}
     */
    PropertyManager.prototype.createProperty = function(propertyName, propertyDefinition, contextClass, contextProperty)
    {
        if (!Subclass.Tools.isPlainObject(propertyDefinition)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the definition of property "' + propertyName + '"', false)
                .received(propertyDefinition)
                .expected('a plain object with mandatory property "type"')
                .apply()
            ;
        }
        var dataTypeManager = this.getDataTypeManager();
        var propertyTypeName = propertyDefinition.type;

        if (dataTypeManager.issetType(propertyTypeName)) {
            var dataTypeDefinition = Subclass.Tools.copy(dataTypeManager.getTypeDefinition(propertyTypeName));
            propertyTypeName = dataTypeDefinition.type;

            propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
            propertyDefinition.type = propertyTypeName;
        }

        if (!Subclass.Property.PropertyManager.issetPropertyType(propertyTypeName)) {
            var propertyFullName = (contextProperty && contextProperty.getNameFull() + "." || '') + propertyName;

            Subclass.Error.create(
                'Trying to create property "' + propertyFullName + '" of none existent type "' + propertyTypeName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"') + '.'
            );
        }

        var classConstructor = this.createPropertyConstructor(propertyName, propertyDefinition);
        var inst = new classConstructor(this, propertyName, propertyDefinition);

        // Setting context

        inst.setContextClass(contextClass || null);
        inst.setContextProperty(contextProperty || null);

        // Checking if property name allowed

        if (!contextProperty && !Subclass.Property.PropertyManager.isPropertyNameAllowed(propertyName)) {
            Subclass.Error.create(
                'Trying to define property with not allowed name "' + propertyName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"' || "") +  "."
            );
        }
        inst.initialize();

        return inst;
    };

    PropertyManager.prototype.normalizePropertyDefinition = function(definition)
    {
        var dataTypeManager = this.getDataTypeManager();

        if (definition === undefined || definition === null) {
            Subclass.Error.create("InvalidArgument")
                .argument('the definition of property', false)
                .received(definition)
                .expected('not null or undefined')
                .apply()
            ;
        }
        if (typeof definition == 'string' && dataTypeManager.issetType(definition)) {
            return dataTypeManager.getTypeDefinition(definition);
        }
        if (Array.isArray(definition) && definition.length >= 1) {
            var dataTypeName, dataType;

            if (definition[0] && PropertyManager.issetPropertyType(definition[0])) {
                dataTypeName = definition[0];
                dataType = PropertyManager.getPropertyType(dataTypeName);

                definition = dataType.normalizeDefinition(definition);

            } else if (definition[0] && dataTypeManager.issetType(definition[0])) {
                dataTypeName = definition[0];
                definition = dataTypeManager.getTypeDefinition(dataTypeName);
            }
        }
        return definition;
    };


    //================================ PUBLIC API ==================================

    /**
     * A collection of registered property types
     *
     * @type {Object.<Function>}
     * @private
     */
    PropertyManager._propertyTypes = {};

    /**
     * A collection of non allowed property names
     *
     * @type {Array}
     * @private
     */
    PropertyManager._notAllowedPropertyNames = [];

    /**
     * Registering new property type
     *
     * @param {Function} propertyTypeConstructor
     */
    PropertyManager.registerPropertyType = function(propertyTypeConstructor)
    {
        var propertyTypeName = propertyTypeConstructor.getPropertyTypeName();

        this._propertyTypes[propertyTypeName] = propertyTypeConstructor;
    };

    /**
     * Returns property type constructor
     *
     * @param {string} propertyTypeName
     * @returns {Function}
     */
    PropertyManager.getPropertyType = function(propertyTypeName)
    {
        if (!this.issetPropertyType(propertyTypeName)) {
            Subclass.Error.create(
                'Trying to get non existed property type ' +
                'factory "' + propertyTypeName + '".'
            );
        }
        return this._propertyTypes[propertyTypeName];
    };

    /**
     * Returns all registered property types
     *
     * @returns {Object.<Function>}
     */
    PropertyManager.getPropertyTypes = function()
    {
        return this._propertyTypes;
    };

    /**
     * Checks if needed property type was ever registered
     *
     * @param {string} propertyTypeName
     * @returns {boolean}
     */
    PropertyManager.issetPropertyType = function(propertyTypeName)
    {
        return !!this._propertyTypes[propertyTypeName];
    };

    /**
     * Registers new not allowed class property name
     *
     * @param {Array} propertyNames
     */
    PropertyManager.registerNotAllowedPropertyNames = function(propertyNames)
    {
        try {
            if (!Array.isArray(propertyNames)) {
                throw "error";
            }
            for (var i = 0; i < propertyNames.length; i++) {
                if (this._notAllowedPropertyNames.indexOf(propertyNames[i]) < 0) {
                    if (typeof propertyNames[i] != "string") {
                        throw "error";
                    }
                    this._notAllowedPropertyNames.push(propertyNames[i]);
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the not allowed names of property", false)
                    .received(propertyNames)
                    .expected("an array of strings")
                    .apply()
                ;
            } else {
                throw e;
            }
        }
    };

    /**
     * Returns not allowed property names
     *
     * @returns {string[]}
     */
    PropertyManager.getNotAllowedPropertyNames = function()
    {
        return this._notAllowedPropertyNames;
    };

    /**
     * Checks if specified class property name is allowed
     *
     * @param propertyName
     * @returns {boolean}
     */
    PropertyManager.isPropertyNameAllowed = function(propertyName)
    {
        if (propertyName.match(/[^\$a-z0-9_]/i)) {
            return false;
        }
        for (var i = 0; i < this._notAllowedPropertyNames.length; i++) {
            var regExp = new RegExp("^_*" + this._notAllowedPropertyNames[i] + "_*$", 'i');

            if (regExp.test(propertyName)) {
                return false;
            }
        }
        return true;
    };

    return PropertyManager;

})();