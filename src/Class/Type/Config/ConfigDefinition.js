/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Config.ConfigDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ConfigDefinition(classInst, classDefinition)
    {
        ConfigDefinition.$parent.call(this, classInst, classDefinition);
    }

    ConfigDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateAbstract = function(value)
    {
        Subclass.Error.create(
            'The config "' + this.getClass().getName() + '" ' +
            'can\'t contain any abstract methods.'
        );
    };

    /**
     * Validate "$_implements" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateImplements = function(value)
    {
        Subclass.Error.create(
            'The config "' + this.getClass().getName() + '" ' +
            'can\'t implements any interfaces.'
        );
    };

    /**
     * Validate "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateStatic = function(value)
    {
        Subclass.Error.create(
            'The config "' + this.getClass().getName() + '" ' +
            'can\'t contain any static properties and methods.'
        );
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateTraits = function(value)
    {
        Subclass.Error.create(
            'The config "' + this.getClass().getName() + '" can\'t contain any traits.'
        );
    };

    /**
     * Validates "$_includes" attribute value
     *
     * @param {*} includes
     * @returns {boolean}
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateIncludes = function(includes)
    {
        try {
            if (includes && !Array.isArray(includes)) {
                throw 'error';
            }
            if (includes) {
                for (var i = 0; i < includes.length; i++) {
                    if (typeof includes[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_includes')
                    .className(this.getClass().getName())
                    .received(includes)
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
     * Sets "$_includes" attribute value
     *
     * @param {string[]} includes
     *
     *      List of the classes which properties current one will contain.
     *
     *      Example: [
     *         "Namespace/Of/Config1",
     *         "Namespace/Of/Config2",
     *         ...
     *      ]
     */
    ConfigDefinition.prototype.setIncludes = function(includes)
    {
        this.validateIncludes(includes);
        this.getData().$_includes = includes || [];

        if (includes) {
            for (var i = 0; i < includes.length; i++) {
                this.getClass().addInclude(includes[i]);
            }
        }
    };

    /**
     * Return "$_includes" attribute value
     *
     * @returns {string[]}
     */
    ConfigDefinition.prototype.getIncludes = function()
    {
        return this.getData().$_includes || [];
    };

    /**
     * Validates "$_decorators" attribute value
     *
     * @param {*} decorators
     * @returns {boolean}
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateDecorators = function(decorators)
    {
        try {
            if (decorators && !Array.isArray(decorators)) {
                throw 'error';
            }
            if (decorators) {
                for (var i = 0; i < decorators.length; i++) {
                    if (typeof decorators[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_decorators')
                    .className(this.getClass().getName())
                    .received(decorators)
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
     * Sets "$_decorators" attribute value
     *
     * @param {string[]} decorators
     *
     *      List of the classes which properties overlaps properties from current one class
     *
     *      Example: [
     *         "Namespace/Of/Config1",
     *         "Namespace/Of/Config2",
     *         ...
     *      ]
     */
    ConfigDefinition.prototype.setDecorators = function(decorators)
    {
        this.validateDecorators(decorators);
        this.getData().$_decorators = decorators || [];

        if (decorators) {
            for (var i = 0; i < decorators.length; i++) {
                this.getClass().addDecorator(decorators[i]);
            }
        }
    };

    /**
     * Return "$_decorators" attribute value
     *
     * @returns {string[]}
     */
    ConfigDefinition.prototype.getDecorators = function()
    {
        return this.getData().$_decorators || [];
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.getBaseData = function ()
    {
        var classDefinition = ConfigDefinition.$parent.prototype.getBaseData.call(this);

        delete classDefinition.$_properties;
        delete classDefinition.$_static;
        delete classDefinition.$_abstract;
        delete classDefinition.$_implements;
        delete classDefinition.$_requires;
        delete classDefinition.$_traits;

        /**
         * @type {string[]}
         */
        classDefinition.$_includes = [];

        /**
         * @type {string[]}
         */
        classDefinition.$_decorators = [];

        /**
         * Sets values
         *
         * @param {Object} values
         */
        classDefinition.setValues = function(values)
        {
            if (!values || !Subclass.Tools.isPlainObject(values)) {
                Subclass.Error.create('InvalidArgument')
                    .argument("the config class values", false)
                    .received(values)
                    .expected('a plain object')
                    .apply()
                ;
            }
            for (var propName in values) {
                if (values.hasOwnProperty(propName)) {
                    this[propName] = values[propName];
                }
            }
        };

        /**
         * Returns object with all config properties with current values
         *
         * @returns {{}}
         */
        classDefinition.getValues = function()
        {
            var values = {};
            var properties = this.$_class.getProperties();

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    values[propName] = properties[propName].getValue(this, true);
                }
            }
            return values;
        };

        /**
         * Sets class property defaults
         *
         * @param defaults
         * @returns {*}
         */
        classDefinition.setDefaults = function(defaults)
        {
            for (var propName in defaults) {
                if (defaults.hasOwnProperty(propName)) {
                    this.getProperty(propName).setDefaultValue(defaults[propName]);
                }
            }
            return defaults;
        };

        /**
         * Returns default values
         *
         * @returns {Object}
         */
        classDefinition.getDefaults = function()
        {
            var defaults = {};
            var properties = this.$_class.getProperties();

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    defaults[propName] = properties[propName].getDefaultValue();
                }
            }
            return defaults;
        };

        /**
         * Returns default values in full set (if defined "map" type property
         * will be returned defaults values from schema).
         *
         * @returns {{}}
         */
        classDefinition.getSchemaDefaults = function()
        {
            var defaults = {};
            var properties = this.$_class.getProperties();

            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                if (properties[propName].getSchemaDefaultValue) {
                    defaults[propName] = properties[propName].getSchemaDefaultValue();

                } else {
                    defaults[propName] = properties[propName].getDefaultValue();
                }
            }
            return defaults;
        };

        return classDefinition;
    };

    /**
     * Normalizes class definition at initialisation stage
     */
    ConfigDefinition.prototype.normalizeData = function()
    {
        ConfigDefinition.$parent.prototype.normalizeData.call(this);

        // Retrieving class definition data
        var dataDefault = this.getData();

        // Retrieving all properties we want to save
        var parentClassName = this.getExtends();
        var decorators = this.getDecorators();
        var includes = this.getIncludes();

        // Removing from definition data all properties that are not definitions of typed properties
        delete dataDefault.$_decorators;
        delete dataDefault.$_includes;
        delete dataDefault.$_extends;
        delete dataDefault.$_properties;

        // Creating new empty class definition data

        this._data = {};
        var data = this._data;

        // Filling $_properties parameter by all property definitions from old class definition

        data.$_properties = dataDefault;

        // Setting parent class if exists

        if (parentClassName) {
            data.$_extends = parentClassName;
        }

        // Setting includes if exists

        if (includes && Array.isArray(includes)) {
            data.$_includes = includes;
        }

        // Setting decorators if exists

        if (decorators && Array.isArray(decorators)) {
            data.$_decorators = decorators;
        }

        // Extending class properties

        this.normalizeProperties();

        // Customising property definitions

        for (var propName in data.$_properties) {
            if (data.$_properties.hasOwnProperty(propName)) {
                data.$_properties[propName].accessors = false;
            }
        }
    };

    /**
     * Normalising class properties
     */
    ConfigDefinition.prototype.normalizeProperties = function()
    {
        var classManager = this.getClass().getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();
        var classProperties = this.getProperties();
        var propName;

        // Normalizing short style property definitions

        for (propName in classProperties) {
            if (classProperties.hasOwnProperty(propName)) {
                classProperties[propName] = propertyManager.normalizePropertyDefinition(
                    classProperties[propName]
                );
            }
        }

        // Processing parent class

        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().getClass(parentClassName);
            var parentClassConstructor = parentClass.getConstructor();
            var parentClassProperties = parentClass.getDefinition().getProperties();

            this.extendProperties(classProperties, parentClassProperties);
        }

        // Processing included and decoration classes

        var classCollections = {
            includes: this.getIncludes(),
            decorators: this.getDecorators()
        };

        for (var collectionType in classCollections) {
            if (!classCollections.hasOwnProperty(collectionType)) {
                continue;
            }
            var includes = classCollections[collectionType];

            for (var i = 0; i < includes.length; i++) {
                var includeClassName = includes[i];
                var includeClass = this.getClass().getClassManager().getClass(includeClassName);
                var includeClassConstructor = includeClass.getConstructor();
                var includeClassProperties = Subclass.Tools.copy(includeClass.getDefinition().getProperties());

                switch (collectionType) {
                    case 'includes':
                        this.extendProperties(
                            classProperties,
                            includeClassProperties
                        );
                        for (propName in includeClassProperties) {
                            if (
                                includeClassProperties.hasOwnProperty(propName)
                                && !classProperties.hasOwnProperty(propName)
                            ) {
                                classProperties[propName] = Subclass.Tools.copy(includeClassProperties[propName]);
                            }
                        }
                        break;

                    case 'decorators':
                        this.extendProperties(
                            includeClassProperties,
                            classProperties
                        );
                        for (propName in classProperties) {
                            if (
                                classProperties.hasOwnProperty(propName)
                                && !includeClassProperties.hasOwnProperty(propName)
                            ) {
                                includeClassProperties[propName] = Subclass.Tools.copy(classProperties[propName]);
                            }
                        }
                        this.getData().$_properties = includeClassProperties;
                        classProperties = this.getProperties();
                        break;
                }
            }
        }
        //
        //// Normalizing short style property definitions
        //
        //for (propName in classProperties) {
        //    if (classProperties.hasOwnProperty(propName)) {
        //        classProperties[propName] = propertyManager.normalizePropertyDefinition(
        //            classProperties[propName]
        //        );
        //    }
        //}

        // Validating result properties

        for (propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            var property = classProperties[propName];

            if (!property || !Subclass.Tools.isPlainObject(property)) {
                Subclass.Error.create(
                    'Specified invalid definition of property "' + propName + '" ' +
                    'in class "' + this.getClass().getName() + '".'
                );
            }
        }
    };

    /**
     * Extending class property definitions
     *
     * @param {Object} childProperties
     * @param {Object} parentProperties
     */
    ConfigDefinition.prototype.extendProperties = function(childProperties, parentProperties)
    {
        for (var propName in childProperties) {
            if (!childProperties.hasOwnProperty(propName)) {
                continue;
            }
            if (
                Subclass.Tools.isPlainObject(childProperties[propName])
                && childProperties[propName].hasOwnProperty('type')
                && parentProperties
                && parentProperties.hasOwnProperty(propName)
            ) {
                childProperties[propName] = Subclass.Tools.extendDeep(
                    Subclass.Tools.copy(parentProperties[propName]),
                    childProperties[propName]
                );

            } else if (
                parentProperties
                && parentProperties[propName]
            ) {
                childProperties[propName] = Subclass.Tools.extendDeep(
                    Subclass.Tools.copy(parentProperties[propName]),
                    { value: childProperties[propName] }
                );
            }
        }
    };

    ConfigDefinition.prototype.processRelatedClasses = function()
    {
        ConfigDefinition.$parent.prototype.processRelatedClasses.call(this);

        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        var includes = this.getIncludes();
        var decorators = this.getDecorators();

        // Performing $_includes (Needs to be defined in ConfigDefinition)

        if (includes && this.validateIncludes(includes)) {
            for (var i = 0; i < includes.length; i++) {
                classManager.loadClass(includes[i]);
            }
        }

        // Performing $_decorators (Needs to be defined in ConfigDefinition)

        if (decorators && this.validateDecorators(decorators)) {
            for (i = 0; i < decorators.length; i++) {
                classManager.loadClass(decorators[i]);
            }
        }
    };

    return ConfigDefinition;

})();