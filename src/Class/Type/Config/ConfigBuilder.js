/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Config.ConfigBuilder = (function()
{
    function ConfigBuilder(classManager, classType, className)
    {
        ConfigBuilder.$parent.call(this, classManager, classType, className);
    }

    ConfigBuilder.$parent = Subclass.Class.ClassBuilder;

    /**
     * Validates includes list argument
     *
     * @param {*} includesList
     * @private
     */
    ConfigBuilder.prototype._validateIncludes = function(includesList)
    {
        try {
            if (!Array.isArray(includesList)) {
                throw "error";
            }
            for (var i = 0; i < includesList.length; i++) {
                this._validateInclude(includesList[i]);
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of config including class names", false)
                .received(includesList)
                .expected("an array of strings")
                .apply()
            ;
        }
    };

    /**
     * Validates config include
     *
     * @param {*} include
     * @private
     */
    ConfigBuilder.prototype._validateInclude = function(include)
    {
        if (
            typeof include != "string"
            && typeof include != "object"
            && include.getClassTypeName
            && include.getClassTypeName() !== "Config"
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of including config class', false)
                .expected('an instance of config class or a string')
                .received(include)
                .apply()
            ;
        }
    };

    /**
     * Brings includes list to common state
     *
     * @param {Array} includesList
     * @private
     */
    ConfigBuilder.prototype._normalizeIncludes = function(includesList)
    {
        for (var i = 0; i < includesList.length; i++) {
            includesList[i] = this._normalizeInclude(includesList[i]);
        }
    };

    /**
     * Normalizes config include
     *
     * @param {(string|Config)} include
     * @returns {string}
     * @private
     */
    ConfigBuilder.prototype._normalizeInclude = function(include)
    {
        this._validateInclude(include);

        if (typeof include != 'string') {
            return include.getName();
        }
    };

    /**
     * Sets includes list
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.setIncludes = function(includesList)
    {
        this._validateIncludes(includesList);
        this._normalizeIncludes(includesList);
        this.getDefinition().$_includes = includesList;

        return this;
    };

    /**
     * Adds new includes
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addIncludes = function(includesList)
    {
        this._validateIncludes(includesList);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes = this.getDefinition().$_includes.concat(includesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} include
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addInclude = function(include)
    {
        this._validateInclude(include);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes.push(include);

        return this;
    };

    /**
     * Returns includes list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getIncludes = function()
    {
        return this.getDefinition().$_includes || [];
    };

    /**
     * Validates decorators list argument
     *
     * @param {*} decoratorsList
     * @private
     */
    ConfigBuilder.prototype._validateDecorators = function(decoratorsList)
    {
        try {
            if (!Array.isArray(decoratorsList)) {
                throw "error";
            }
            for (var i = 0; i < decoratorsList.length; i++) {
                this._validateDecorator(decoratorsList[i]);
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of config decorator class names", false)
                .received(decoratorsList)
                .expected('an array of strings or instances of "Subclass.Class.Type.Config.Config" class')
                .apply()
            ;
        }
    };

    /**
     * Validates config decorator
     *
     * @param {*} decorator
     * @private
     */
    ConfigBuilder.prototype._validateDecorator = function(decorator)
    {
        if (
            typeof decorator != "string"
            && typeof decorator != "object"
            && decorator.getClassTypeName
            && decorator.getClassTypeName() !== "Config"
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of config decorating class", false)
                .received(decorator)
                .expected('a string or instance of "Subclass.Class.Type.Config.Config" class')
                .apply()
            ;
        }
    };

    /**
     * Brings decorators list to common state
     *
     * @param {Array} decoratorsList
     * @private
     */
    ConfigBuilder.prototype._normalizeDecorators = function(decoratorsList)
    {
        for (var i = 0; i < decoratorsList.length; i++) {
            decoratorsList[i] = this._normalizeDecorator(decoratorsList[i]);
        }
    };

    /**
     * Normalizes config decorator
     *
     * @param {(string|Config)} decorator
     * @returns {string}
     * @private
     */
    ConfigBuilder.prototype._normalizeDecorator = function(decorator)
    {
        this._validateDecorator(decorator);

        if (typeof decorator != 'string') {
            return decorator.getName();
        }
    };

    /**
     * Sets decorators list
     *
     * @param {string[]} decoratorsList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.setDecorators = function(decoratorsList)
    {
        this._validateDecorators(decoratorsList);
        this._normalizeDecorators(decoratorsList);
        this.getDefinition().$_decorators = decoratorsList;

        return this;
    };

    /**
     * Adds new decorators
     *
     * @param {string[]} decoratorsList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addDecorators = function(decoratorsList)
    {
        this._validateDecorators(decoratorsList);

        if (!this.getDefinition().$_decorators) {
            this.getDefinition().$_decorators = [];
        }
        this.getDefinition().$_decorators = this.getDefinition().$_decorators.concat(decoratorsList);

        return this;
    };

    /**
     * Adds new decorator
     *
     * @param {string[]} decorator
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addDecorator = function(decorator)
    {
        this._validateInclude(decorator);

        if (!this.getDefinition().$_decorators) {
            this.getDefinition().$_decorators = [];
        }
        this.getDefinition().$_decorators.push(decorator);

        return this;
    };

    /**
     * Returns decorators list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getDecorators = function()
    {
        return this.getDefinition().$_decorators || [];
    };

    ConfigBuilder.prototype.setProperties = undefined;

    ConfigBuilder.prototype.addProperties = undefined;

    ConfigBuilder.prototype.getProperties = undefined;

    ConfigBuilder.prototype.removeProperty = undefined;

    ConfigBuilder.prototype.setStatic = undefined;

    ConfigBuilder.prototype.getStatic = undefined;

    ConfigBuilder.prototype.setStaticProperty = undefined;

    ConfigBuilder.prototype.removeStaticProperty = undefined;

    return ConfigBuilder;

})();