/**
 * @namespace
 */
Subclass.Class.Config = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Config.Config = (function()
{
    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.Class.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Config(classManager, className, classDefinition)
    {
        /**
         * List of config classes
         *
         * @type {Config[]}
         * @private
         */
        this._includes = [];

        /**
         * List of config classes
         *
         * @type {Config[]}
         * @private
         */
        this._decorators = [];

        Config.$parent.call(this, classManager, className, classDefinition);
    }

    Config.$parent = Subclass.Class.ClassType;


    /**
     * @inheritDoc
     */
    Config.getClassTypeName = function ()
    {
        return "Config";
    };

    /**
     * @inheritDoc
     */
    Config.getBuilderClass = function()
    {
        return Subclass.Class.Config.ConfigBuilder;
    };

    /**
     * @inheritDoc
     */
    Config.getDefinitionClass = function()
    {
        return Subclass.Class.Config.ConfigDefinition;
    };

    /**
     * @inheritDoc
     */
    Config.prototype.initialize = function()
    {
        this._validateDefinition();
        this._processDefinition();

        Config.$parent.prototype.initialize.call(this);
    };

    /**
     * Validating class definition
     *
     * @throws {Error}
     * @private
     */
    Config.prototype._validateDefinition = function()
    {
        var classDefinition = this.getDefinition();
        var classDefinitionData = classDefinition.getData();

        for (var attrName in classDefinitionData) {
            if (
                !classDefinitionData.hasOwnProperty(attrName)
                || !attrName.match(/^\$_/i)
            ) {
                continue;
            }
            var validateMethod = "validate" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[validateMethod]) {
                this[validateMethod](classDefinitionData[attrName]);
            }
        }
    };

    /**
     * Processing class definition at initialisation stage
     * @private
     */
    Config.prototype._processDefinition = function()
    {
        // Retrieving class definition data
        var classDefinition = this.getDefinition();
        var classDefinitionDataDefault = classDefinition.getData();

        // Retrieving all properties we want to save
        var parentClassName = classDefinition.getExtends();
        var decorators = classDefinition.getDecorators();
        var includes = classDefinition.getIncludes();

        // Removing from definition data all properties that are not definitions of typed properties
        delete classDefinitionDataDefault.$_decorators;
        delete classDefinitionDataDefault.$_includes;
        delete classDefinitionDataDefault.$_extends;
        delete classDefinitionDataDefault.$_properties;

        // Creating new empty class definition data

        classDefinition.setData({});
        var classDefinitionData = classDefinition.getData();

        // Filling $_properties parameter by all property definitions from old class definition

        classDefinitionData.$_properties = classDefinitionDataDefault;

        // Setting parent class if exists

        if (parentClassName) {
            classDefinitionData.$_extends = parentClassName;
            this.setParent(parentClassName);
        }

        // Setting includes if exists

        if (includes && Array.isArray(includes)) {
            classDefinitionData.$_includes = includes;

            for (var i = 0; i < includes.length; i++) {
                this.addInclude(includes[i]);
            }
        }

        // Setting decorators if exists

        if (decorators && Array.isArray(decorators)) {
            classDefinitionData.$_decorators = decorators;

            for (i = 0; i < decorators.length; i++) {
                this.addDecorator(decorators[i]);
            }
        }

        // Extending class properties

        this.normalizeProperties();

        // Customising property definitions

        var classProperties = classDefinitionData.$_properties;

        for (var propName in classProperties) {
            if (classProperties.hasOwnProperty(propName)) {
                classProperties[propName].accessors = false;
            }
        }
    };

    /**
     * Normalising class properties
     */
    Config.prototype.normalizeProperties = function()
    {
        var classDefinition = this.getDefinition();
        var classProperties = classDefinition.getProperties();
        var propName;

        // Processing parent class

        if (this.hasParent()) {
            var parentClass = this.getParent();
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
                var includeClass = includes[i];
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
                        classDefinition.getData().$_properties = includeClassProperties;
                        classProperties = classDefinition.getProperties();
                        break;
                }

            }
        }

        // Validating result properties

        for (propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            var property = classProperties[propName];

            if (!property || !Subclass.Tools.isPlainObject(property)) {
                throw new Error(
                    'Specified invalid property definition "' + propName + '" ' +
                    'in class "' + this.getName() + '".'
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
    Config.prototype.extendProperties = function(childProperties, parentProperties)
    {
        for (var propName in childProperties) {
            if (!childProperties.hasOwnProperty(propName)) {
                continue;
            }
            if (
                Subclass.Tools.isPlainObject(childProperties[propName])
                && childProperties[propName].hasOwnProperty('type')
                && parentProperties[propName]
            ) {
                childProperties[propName] = Subclass.Tools.extendDeep(
                    Subclass.Tools.copy(parentProperties[propName]),
                    childProperties[propName]
                );

            } else if (
                childProperties[propName]
                && parentProperties[propName]
            ) {
                childProperties[propName] = Subclass.Tools.extendDeep(
                    Subclass.Tools.copy(parentProperties[propName]),
                    { value: childProperties[propName] }
                );
            }
        }
    };

    /**
     * @inheritDoc
     */
    Config.prototype.setParent = function(parentClassName)
    {
        Config.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Config
        ) {
            throw new Error('Config "' + this.getName() + '" can be inherited only from an another config.');
        }
    };

    /**
     * @inheritDoc
     */
    Config.prototype.getConstructorEmpty = function ()
    {
        return function Config() {};
    };

    /**
     * Returns all included config classes
     *
     * @returns {Config[]}
     */
    Config.prototype.getIncludes = function()
    {
        return this._includes;
    };

    /**
     * Adds included config class instance
     *
     * @param className
     */
    Config.prototype.addInclude = function(className)
    {
        if (typeof className != "string") {
            throw new Error('Invalid argument "includeClassName" in method "addInclude" ' +
            'in config class "' + this.getName() + '". ' +
            'It must be name of existent config class.');
        }
        if (!this.getClassManager().issetClass(className)) {
            throw new Error('Trying to include non existent class "' + className + '" ' +
            'to config class "' + this.getName() + '".');
        }
        var classObj = this.getClassManager().getClass(className);

        this._includes.push(classObj);
    };

    /**
     * Checks if current config class includes specified
     *
     * @param {string} className
     * @returns {boolean}
     */
    Config.prototype.isIncludes = function(className)
    {
        if (!className || typeof className != 'string') {
            throw new Error('Trait name must be specified.');
        }
        var includes = this.getIncludes();

        for (var i = 0; i < includes.length; i++) {
            if (includes[i].isInstanceOf(className)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.isIncludes) {
                return parent.isIncludes(className);
            }
        }
        return false;
    };

    /**
     * Returns all decorator config classes
     *
     * @returns {Config[]}
     */
    Config.prototype.getDecorators = function()
    {
        return this._decorators;
    };

    /**
     * Adds decorator config class instance
     *
     * @param className
     */
    Config.prototype.addDecorator = function(className)
    {
        if (typeof className != "string") {
            throw new Error('Invalid argument "className" in method "addDecorator" ' +
            'in config class "' + this.getName() + '". ' +
            'It must be name of existent config class.');
        }
        if (!this.getClassManager().issetClass(className)) {
            throw new Error('Trying to attach non existent decorator class "' + className + '" ' +
            'to config class "' + this.getName() + '".');
        }
        var classObj = this.getClassManager().getClass(className);

        this._decorators.push(classObj);
    };

    /**
     * Checks whether current config class attached specified decorator class
     *
     * @param {string} className
     * @returns {boolean}
     */
    Config.prototype.hasDecorator = function(className)
    {
        if (!className || typeof className != 'string') {
            throw new Error('Trait name must be specified.');
        }
        var decorators = this.getDecorators();

        for (var i = 0; i < decorators.length; i++) {
            if (decorators[i].isInstanceOf(className)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.hasDecorator) {
                return parent.hasDecorator(className);
            }
        }
        return false;
    };

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.Class.ClassManager.registerClassType(Config);

    return Config;

})();