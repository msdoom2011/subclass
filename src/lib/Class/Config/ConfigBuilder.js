/**
 * @class
 * @extends {Subclass.Class.ClassTypeBuilder}
 */
Subclass.Class.Config.ConfigBuilder = (function()
{
    function ConfigBuilder(classManager, classType, className)
    {
        ConfigBuilder.$parent.call(this, classManager, classType, className);
    }

    ConfigBuilder.$parent = Subclass.Class.ClassTypeBuilder;

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
            throw new Error('Invalid value of argument "includesList" in method "setIncludes" in "ConfigBuilder" class.');
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
            throw new Error('Specified invalid includes in "Config" class.');
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
     * @returns {Subclass.Class.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.setIncludes = function(includesList)
    {
        this._validateIncludes(includesList);
        this._normalizeIncludes(includesList);
        this._getDefinition().$_includes = includesList;

        return this;
    };

    /**
     * Adds new includes
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addIncludes = function(includesList)
    {
        this._validateIncludes(includesList);

        if (!this._getDefinition().$_includes) {
            this._getDefinition().$_includes = [];
        }
        this._getDefinition().$_includes = this._getDefinition().$_includes.concat(includesList);

        return this;
    };

    /**
     * Returns includes list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getIncludes = function()
    {
        return this._getDefinition().$_includes || [];
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