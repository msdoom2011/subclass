/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Class.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Validates "$_static" attribute value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateStatic = function(value)
    {
        if (value !== null && !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidClassOption')
                .option('$_static')
                .className(this.getClass().getName())
                .received(value)
                .expected('a plain object or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_static" attribute value
     *
     * @param {Object} value Plain object with different properties and methods
     */
    ClassDefinition.prototype.setStatic = function(value)
    {
        this.validateStatic(value);
        this.getData().$_static = value || {};
    };

    /**
     * Returns "$_static" attribute value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getStatic = function()
    {
        return this.getData().$_static;
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} traits
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateTraits = function(traits)
    {
        try {
            if (traits && !Array.isArray(traits)) {
                throw 'error';
            }
            if (traits) {
                for (var i = 0; i < traits.length; i++) {
                    if (typeof traits[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_traits')
                    .className(this.getClass().getName())
                    .received(traits)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_traits" attribute value
     *
     * @param {string[]} traits
     *
     *      List of the classes which properties and method current one will contain.
     *
     *      Example: [
     *         "Namespace/Of/Trait1",
     *         "Namespace/Of/Trait2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setTraits = function(traits)
    {
        this.validateTraits(traits);
        this.getData().$_traits = traits || [];

        if (traits) {
            var classInst = this.getClass();

            for (var i = 0; i < traits.length; i++) {
                classInst.addTrait(traits[i]);
            }
        }
    };

    /**
     * Return "$_traits" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getTraits = function()
    {
        return this.getData().$_traits;
    };

    /**
     * Validates "$_implements" attribute value
     *
     * @param {*} interfaces
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateImplements = function(interfaces)
    {
        try {
            if (interfaces && !Array.isArray(interfaces)) {
                throw 'error';
            }
            if (interfaces) {
                for (var i = 0; i < interfaces.length; i++) {
                    if (typeof interfaces[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_implements')
                    .className(this.getClass().getName())
                    .received(interfaces)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_implements" attribute value
     *
     * @param {string[]} interfaces
     *
     *      List of the interfaces witch current one will implement.
     *
     *      Example: [
     *         "Namespace/Of/Interface1",
     *         "Namespace/Of/Interface2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setImplements = function(interfaces)
    {
        this.validateImplements(interfaces);
        this.getData().$_implements = interfaces || [];

        if (interfaces) {
            var classInst = this.getClass();

            for (var i = 0; i < interfaces.length; i++) {
                classInst.addInterface(interfaces[i]);
            }
        }
    };

    /**
     * Return "$_implements" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getImplements = function()
    {
        return this.getData().$_implements;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getBaseData = function ()
    {
        var classDefinition = ClassDefinition.$parent.prototype.getBaseData();

        /**
         * Static properties and methods for current class constructor
         *
         * @type {Object}
         */
        classDefinition.$_static = {};

        /**
         * Array of traits names
         *
         * @type {string[]}
         */
        classDefinition.$_traits = [];

        /**
         * Array of interfaces names
         *
         * @type {string[]}
         */
        classDefinition.$_implements = [];

        /**
         * Returns all static methods and properties
         *
         * @returns {Object}
         */
        classDefinition.getStatic = function()
        {
            return this.$_class.getStatic();
        };

        /**
         * Checks if current class instance has specified trait
         *
         * @param {string} traitName
         * @returns {boolean}
         */
        classDefinition.hasTrait = function (traitName)
        {
            return this.$_class.hasTrait(traitName);
        };

        /**
         * Checks if current class implements specified interface
         *
         * @param {string} interfaceName
         * @returns {boolean}
         */
        classDefinition.isImplements = function (interfaceName)
        {
            return this.$_class.isImplements(interfaceName);
        };

        ///**
        // * Returns the property instance based on specified data type.
        // *
        // * @param {(string|{type:{string}})} dataType
        // * @returns {Subclass.Property.PropertyAPI}
        // * @private
        // */
        //classDefinition._getDataTypeProperty = function(dataType)
        //{
        //    var classManager = this.getClassManager();
        //    var propertyManager = classManager.getModule().getPropertyManager();
        //    var property;
        //
        //    if (
        //        dataType &&
        //        typeof dataType == 'object'
        //        && dataType.type &&
        //        typeof dataType.type == 'string'
        //    ) {
        //        return propertyManager.createProperty('test', dataType).getAPI(this);
        //
        //    } else if (!dataType || typeof dataType != 'string') {
        //        Subclass.Error.create("InvalidArgument")
        //            .argument('the data type', false)
        //            .received(dataType)
        //            .expected('a string')
        //            .apply()
        //        ;
        //    }
        //
        //    if (this.issetProperty(dataType)) {
        //        property = this.getProperty(dataType);
        //
        //    } else {
        //        var dataTypeManager = propertyManager.getDataTypeManager();
        //
        //        if (dataTypeManager.issetType(dataType)) {
        //            property = dataTypeManager.getType(dataType).getAPI(this);
        //        }
        //    }
        //    if (!property) {
        //        Subclass.Error.create(
        //            'Specified non existent or data type which ' +
        //            'can\'t be used in data type validation.'
        //        );
        //    }
        //    return property;
        //};
        //
        ///**
        // * Validates and returns default value if the value is undefined
        // * or returns the same value as was specified if it's valid
        // *
        // * @param {(string|{type:{string}})} dataType
        // * @param {*} value
        // * @param {*} [valueDefault]
        // * @returns {*}
        // */
        //classDefinition.value = function(dataType, value, valueDefault)
        //{
        //    var property = this._getDataTypeProperty(dataType);
        //    dataType = typeof dataType == 'object' ? dataType.type : dataType;
        //
        //    if (value === undefined && arguments.length == 3) {
        //        return valueDefault;
        //
        //    } else if (value === undefined) {
        //        return property.getDefaultValue();
        //
        //    } else if (!property.isValueValid(value)) {
        //        Subclass.Error.create(
        //            'Specified invalid value that is not corresponds to data type "' + dataType + '".'
        //        );
        //    }
        //
        //    return value;
        //};
        //
        ///**
        // * Validates and returns (if valid)
        // * @param dataType
        // * @param value
        // */
        //classDefinition.result = function(dataType, value)
        //{
        //    var property = this._getDataTypeProperty(dataType);
        //    dataType = typeof dataType == 'object' ? dataType.type : dataType;
        //
        //    if (!property.isValueValid(value)) {
        //        Subclass.Error.create(
        //            'Trying to return not valid value that is not corresponds to data type "' + dataType + '".'
        //        );
        //    }
        //    return value;
        //};

        return classDefinition;
    };

    ClassDefinition.prototype.processRelatedClasses = function()
    {
        ClassDefinition.$parent.prototype.processRelatedClasses.call(this);

        var classInst = this.getClass();
        var classManager = classInst.getClassManager();

        var interfaces = this.getImplements();
        var traits = this.getTraits();

        // Performing $_traits (Needs to be defined in ClassDefinition)

        if (traits && this.validateTraits(traits)) {
            for (var i = 0; i < traits.length; i++) {
                classManager.loadClass(traits[i]);
            }
        }

        // Performing $_implements (Needs to be defined in ClassDefinition)

        if (interfaces && this.validateImplements(interfaces)) {
            for (i = 0; i < interfaces.length; i++) {
                classManager.loadClass(interfaces[i]);
            }
        }
    };

    return ClassDefinition;
})();