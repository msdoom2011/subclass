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
        this._validateClassDefinition();
        this._processClassDefinition();

        Config.$parent.prototype.initialize.call(this);
    };

    /**
     * Validating class definition
     *
     * @throws {Error}
     * @private
     */
    Config.prototype._validateClassDefinition = function()
    {
        var classDefinition = this.getDefinition();
        var classDefinitionData = classDefinition.getDefinition();

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
    Config.prototype._processClassDefinition = function()
    {
        var classDefinition = this.getDefinition();
        var classDefinitionDataDefault = classDefinition.getDefinition();
        var parentClassName = classDefinition.getExtends();
        var includes = classDefinition.getIncludes();
        var requires = classDefinition.getIncludes();

        delete classDefinitionDataDefault.$_requires;
        delete classDefinitionDataDefault.$_includes;
        delete classDefinitionDataDefault.$_extends;
        delete classDefinitionDataDefault.$_properties;

        classDefinition.setDefinition({});
        var classDefinitionData = classDefinition.getDefinition();
        classDefinitionData.$_properties = classDefinitionDataDefault;

        if (parentClassName && typeof parentClassName == 'string') {
            classDefinitionData.$_extends = parentClassName;
            this.setParent(parentClassName);
        }
        if (includes && Array.isArray(includes)) {
            classDefinitionData.$_includes = includes;
        }
        if (requires) {
            classDefinitionData.$_requires = requires;
        }

        // Processing includes

        if (includes) {
            for (var i = 0; i < includes.length; i++) {
                this.addInclude(includes[i]);
            }
        }

        // Extending class properties

        this.normalizeClassProperties();

        // Customising property definitions

        var classProperties = classDefinitionData.$_properties;

        for (var propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            classProperties[propName].accessors = false;
        }
    };

    /**
     * Normalising class properties
     */
    Config.prototype.normalizeClassProperties = function()
    {
        var classDefinition = this.getDefinition();
        var classProperties = classDefinition.getProperties();
        var propName;

        if (this.hasParent()) {
            var parentClass = this.getParent();
            var parentClassProperties = parentClass.getDefinition().getProperties();

            this.extendClassProperties(classProperties, parentClassProperties);
        }

        for (var i = 0, includes = this.getIncludes(); i < includes.length; i++) {
            var includeClass = includes[i];
            var includeClassProperties = includeClass.getDefinition().getProperties();

            this.extendClassProperties(classProperties, includeClassProperties);

            for (propName in includeClassProperties) {
                if (!includeClassProperties.hasOwnProperty(propName)) {
                    continue;
                }
                if (!classProperties[propName]) {
                    classProperties[propName] = Subclass.Tools.copy(includeClassProperties[propName]);
                }
            }
        }

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
    Config.prototype.extendClassProperties = function(childProperties, parentProperties)
    {
        for (var propName in childProperties) {
            if (!childProperties.hasOwnProperty(propName)) {
                continue;
            }
            if (
                Subclass.Tools.isPlainObject(childProperties[propName])
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
            this._classParent
            && this._classParent.constructor != Config
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

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.Class.ClassManager.registerClassType(Config);

    return Config;

})();