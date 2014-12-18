; ClassManager.ClassTypes.Config.Builder = (function()
{
    function ConfigBuilder(classManager, classType, className)
    {
        ConfigBuilder.$parent.call(this, classManager, classType, className);
    }

    ConfigBuilder.$parent = ClassManager.ClassTypes.ClassType.Builder;

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
                if (typeof includesList[i] != "string") {
                    throw "error";
                }
            }
        } catch (e) {
            throw new Error('Invalid value of argument "includesList" in method "setIncludes" in "ConfigBuilder" class.');
        }
    };

    /**
     * Sets includes list
     *
     * @param {string[]} includesList
     * @returns {ClassManager.ClassTypes.Config.Builder}
     */
    ConfigBuilder.prototype.setIncludes = function(includesList)
    {
        this._validateIncludes(includesList);
        this._getClassDefinition().$_includes = includesList;

        return this;
    };

    /**
     * Adds new includes
     *
     * @param {string[]} includesList
     * @returns {ClassManager.ClassTypes.Config.Builder}
     */
    ConfigBuilder.prototype.addIncludes = function(includesList)
    {
        this._validateIncludes(includesList);

        if (!this._getClassDefinition().$_includes) {
            this._getClassDefinition().$_includes = [];
        }
        this._getClassDefinition().$_includes = this._getClassDefinition().$_includes.concat(includesList);

        return this;
    };

    /**
     * Returns includes list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getIncludes = function()
    {
        return this._getClassDefinition().$_includes || [];
    };

    ConfigBuilder.prototype.setClassProperties = undefined;

    ConfigBuilder.prototype.addClassProperties = undefined;

    ConfigBuilder.prototype.getClassProperties = undefined;

    ConfigBuilder.prototype.removeClassProperty = undefined;

    ConfigBuilder.prototype.setStatic = undefined;

    ConfigBuilder.prototype.getStatic = undefined;

    ConfigBuilder.prototype.setStaticProperty = undefined;

    ConfigBuilder.prototype.removeStaticProperty = undefined;

    return ConfigBuilder;

})();