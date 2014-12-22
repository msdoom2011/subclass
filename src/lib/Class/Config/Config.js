Subclass.ClassManager.ClassTypes.Config = (function()
{
    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {ClassManager} classManager
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

    Config.$parent = Subclass.ClassManager.ClassTypes.ClassType;


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
    Config.getClassBuilder = function()
    {
        return Subclass.ClassManager.ClassTypes.Config.Builder;
    };

    /**
     * @inheritDoc
     */
    Config.prototype.initialize = function()
    {
        Config.$parent.prototype.initialize.call(this);

        this._validateClassDefinition();
        this._processClassDefinition();
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Config.prototype._validateClassDefinition = function()
    {
        var classDefinition = this.getClassDefinition();

        // Parsing includes

        if (classDefinition.$_includes && !Array.isArray(classDefinition.$_includes)) {
            throw new Error('Invalid attribute "$_includes" in class definition "' + this.getClassName() + '". ' +
            'It must be an array.');
        }

        // Parsing interfaces

        if (classDefinition.$_implements) {
            throw new Error('Config "' + this.getClassName() + '" can\'t implements any interfaces.');
        }

        // Parsing abstract classes

        if (classDefinition.$_abstract) {
            throw new Error('You can\'t specify abstract method by the property "$_abstract".');
        }

        // Parsing class properties

        if (classDefinition.$_properties) {
            throw new Error('You can\'t specify any typed properties in config class.' +
            ' All properties defined in class are typed by default.');
        }

        // Parsing static properties and methods

        if (classDefinition.$_static) {
            throw new Error('You can\'t specify any static properties or methods in config class.');
        }

        // Parsing traits

        if (Subclass.ClassManager.issetClassType('Trait')) {
            if (classDefinition.$_traits) {
                throw new Error('Config "' + this.getClassName() + '" can\'t contains any traits.');
            }
        }
    };

    /**
     * Processing class definition at initialisation stage
     * @private
     */
    Config.prototype._processClassDefinition = function()
    {
        var classDefinition = this.getClassDefinition();
        var parentClassName = classDefinition.$_extends;
        var includes = classDefinition.$_includes;

        delete classDefinition.$_extends;
        delete classDefinition.$_includes;

        this._classDefinition = {
            $_properties: classDefinition
        };
        if (parentClassName && typeof parentClassName == 'string') {
            this._classDefinition.$_extends = parentClassName;
            this.setClassParent(parentClassName);
        }
        if (includes && Array.isArray(includes)) {
            this._classDefinition.$_includes = includes;
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

        var classProperties = this.getClassDefinition().$_properties;

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
        var classDefinition = this.getClassDefinition();
        var classProperties = classDefinition.$_properties;
        var propName;

        if (this.getClassParent()) {
            var parentClass = this.getClassParent();
            var parentClassProperties = parentClass.getClassDefinition().$_properties;

            this.extendClassProperties(classProperties, parentClassProperties);
        }

        for (var i = 0, includes = this.getIncludes(); i < includes.length; i++) {
            var includeClass = includes[i];
            var includeClassProperties = includeClass.getClassDefinition().$_properties;

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
                throw new Error('Specified invalid property definition "' + propName + '" ' +
                'in class "' + this.getClassName() + '".');
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
    Config.prototype.setClassParent = function(parentClassName)
    {
        Config.$parent.prototype.setClassParent.call(this, parentClassName);

        if (
            this._classParent
            && this._classParent.constructor != Config
        ) {
            throw new Error('Config "' + this.getClassName() + '" can be inherited only from an another config.');
        }
    };

    /**
     * @inheritDoc
     */
    Config.prototype.getClassConstructorEmpty = function ()
    {
        return function Config(){};
    };

    /**
     * @inheritDoc
     */
    Config.prototype.getBaseClassDefinition = function ()
    {
        var classDefinition = Config.$parent.prototype.getBaseClassDefinition.call(this);

        delete classDefinition.$_properties;
        delete classDefinition.$_static;

        /**
         * @type {string[]}
         */
        classDefinition.$_includes = [];

        /**
         * Sets values
         *
         * @param {Object} values
         */
        classDefinition.setValues = function (values)
        {
            // @TODO
        };

        /**
         * Returns default values
         *
         * @returns {Object}
         */
        classDefinition.getDefaults = function ()
        {
            // @TODO do something
        };

        return classDefinition;
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
            'in config class "' + this.getClassName() + '". ' +
            'It must be name of existent config class.');
        }
        if (!this.getClassManager().issetClass(className)) {
            throw new Error('Trying to include non existent class "' + className + '" ' +
            'to config class "' + this.getClassName() + '".');
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
        if (this.getClassParent()) {
            var parent = this.getClassParent();

            if (parent.isIncludes) {
                return parent.isIncludes(className);
            }
        }
        return false;
    };

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Config);

    return Config;

})();