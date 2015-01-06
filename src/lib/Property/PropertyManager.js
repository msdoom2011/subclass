/**
 * @namespace
 */
Subclass.Property = {};

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
         * Custom data types manager
         *
         * @type {Subclass.Property.CustomTypesManager}
         * @private
         */
        this._customTypesManager = new Subclass.Property.CustomTypesManager(this);
    }

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
     * Returns instance of custom types manager
     *
     * @returns {Subclass.Property.CustomTypesManager}
     */
    PropertyManager.prototype.getCustomTypesManager = function()
    {
        return this._customTypesManager;
    };

    /**
     * Defines custom property types
     *
     * @param {Object.<Object>} definitions
     */
    PropertyManager.prototype.defineCustomDataTypes = function(definitions)
    {
        this.getCustomTypesManager().addTypeDefinitions(definitions);
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
     *      A Subclass.Class.ClassType instance which creating property will belongs to.
     *
     * @param {PropertyType} [contextProperty]
     *      A Subclass.Property.PropertyType instance witch creating property will belongs to.
     *
     * @returns {PropertyType}
     */
    PropertyManager.prototype.createProperty = function(propertyName, propertyDefinition, contextClass, contextProperty)
    {
        var customTypesManager = this.getCustomTypesManager();
        var propertyTypeName = propertyDefinition.type;

        if (customTypesManager.issetType(propertyTypeName)) {
            var customTypeDefinition = Subclass.Tools.copy(customTypesManager.getTypeDefinition(propertyTypeName));
            propertyTypeName = customTypeDefinition.type;

            propertyDefinition = Subclass.Tools.extendDeep(customTypeDefinition, propertyDefinition);
            propertyDefinition.type = propertyTypeName;
        }

        if (!Subclass.Property.PropertyManager.issetPropertyType(propertyTypeName)) {
            var propertyFullName = (contextProperty && contextProperty.getPropertyNameFull() + "." || '') + propertyName;

            throw new Error('Trying to create property "' + propertyFullName + '" of none existent type "' + propertyTypeName + '"' +
                (contextClass && ' in class "' + contextClass.getClassName() + '"') + '.');
        }

        var classConstructor = this.createPropertyConstructor(propertyName, propertyDefinition);
        var inst = new classConstructor(this, propertyName, propertyDefinition);

        // Setting context

        inst.setContextClass(contextClass || null);
        inst.setContextProperty(contextProperty || null);

        // Checking if property name allowed

        if (!contextProperty && !Subclass.Property.PropertyManager.isPropertyNameAllowed(propertyName)) {
            throw new Error('Trying to define property with not allowed name "' + propertyName + '"' +
                (contextClass && ' in class "' + contextClass.getClassName() + '"' || "") +  ".");
        }

        inst.initialize();

        if (!(inst instanceof Subclass.Property.PropertyTypeInterface)) {
            throw new Error('Property type factory must instance of "Subclass.Property.PropertyTypeInterface" class.');
        }

        return inst;
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
            throw new Error('Trying to get non existed property type factory "' + propertyTypeName + '".');
        }

        return this._propertyTypes[propertyTypeName];
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
     * Returns names of all registered property types
     *
     * @returns {string[]}
     */
    PropertyManager.getPropertyTypes = function()
    {
        return Object.keys(this._propertyTypes);
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
            throw new Error('Property names argument is not valid! It must be an array of strings.');
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