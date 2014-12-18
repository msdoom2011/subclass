; Subclass.PropertyManager = (function()
{
    /**
     * Property manager constructor
     *
     * @param {ClassManager} classManager Instance of class manager
     * @constructor
     */
    function PropertyManager(classManager)
    {
        this._hash = Math.round(Math.abs(new Date().getTime() * Math.random() / 100000));
        this._classManager = classManager;
    }

    /**
     * Returns class manager instance
     *
     * @returns {ClassManager}
     */
    PropertyManager.prototype.getClassManager = function()
    {
        return this._classManager;
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
            classConstructor = Subclass.PropertyManager.getPropertyType(propertyTypeName);
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
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @param {PropertyType} contextProperty
     * @returns {PropertyType}
     */
    PropertyManager.prototype.createProperty = function(propertyName, propertyDefinition, contextClass, contextProperty)
    {
        var propertyTypeName = propertyDefinition.type;

        if (!Subclass.PropertyManager.issetPropertyType(propertyTypeName)) {
            var propertyFullName = (contextProperty && contextProperty.getPropertyNameFull() + "." || '') + propertyName;

            throw new Error('Trying to create property "' + propertyFullName + '" of none existent type "' + propertyTypeName + '"' +
            (contextClass && ' in class "' + contextClass.getClassName() + '"') + '.');
        }

        var classConstructor = this.createPropertyConstructor(propertyName, propertyDefinition);
        var inst = new classConstructor(
            this,
            propertyName,
            propertyDefinition
        );

        // Setting context

        inst.setContextClass(contextClass || null);
        inst.setContextProperty(contextProperty || null);


        // Checking if property name allowed

        if (!contextProperty && !Subclass.isClassPropertyNameAllowed(propertyName)) {
            throw new Error('Trying to define property with not allowed name "' + propertyName + '"' +
                (contextClass && ' in class "' + contextClass.getClassName() + '"' || "") +  ".");
        }

        inst.initialize();

        if (!(inst instanceof Subclass.PropertyManager.PropertyTypes.PropertyType)) {
            throw new Error('Property type factory must instance of "PropertyType" class.');
        }
        return inst;
    };


    //================================ PUBLIC API ==================================

    /**
     * @type {Object.<function>}
     *
     * @private
     */
    var _propertyTypes = {};

    return {

        PropertyTypes: {},

        /**
         * Creates instance of PropertyManager
         *
         * @param {ClassManager} classManager Instance of class manager
         * @returns {PropertyManager}
         */
        create: function(classManager)
        {
            return new PropertyManager(classManager);
        },

        /**
         * Registering new property type
         *
         * @param {Function} propertyTypeConstructor
         */
        registerPropertyType: function(propertyTypeConstructor)
        {
            var propertyTypeName = propertyTypeConstructor.getPropertyTypeName();

            _propertyTypes[propertyTypeName] = propertyTypeConstructor;
        },

        /**
         * Returns property type constructor
         *
         * @param {string} propertyTypeName
         * @returns {Function}
         */
        getPropertyType: function(propertyTypeName)
        {
            if (!this.issetPropertyType(propertyTypeName)) {
                throw new Error('Trying to get non existed property type factory "' + propertyTypeName + '".');
            }

            return _propertyTypes[propertyTypeName];
        },

        /**
         * Checks if needed property type was ever registered
         *
         * @param {string} propertyTypeName
         * @returns {boolean}
         */
        issetPropertyType: function(propertyTypeName)
        {
            return !!_propertyTypes[propertyTypeName];
        }
    }
})();