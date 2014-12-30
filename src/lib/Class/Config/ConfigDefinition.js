/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Config.ConfigDefinition = (function()
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
        throw new Error('Config "' + this.getClass().getClassName() + '" can\'t contain any abstract methods.');
    };

    /**
     * Validate "$_implements" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateImplements = function(value)
    {
        throw new Error('Config "' + this.getClass().getClassName() + '" can\'t implements any interfaces.');
    };

    /**
     * Validate "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateStatic = function(value)
    {
        throw new Error('Config "' + this.getClass().getClassName() + '" can\'t contain any static properties and methods.');
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateTraits = function(value)
    {
        throw new Error(
            'Config "' + this.getClass().getClassName() + '" can\'t contain any traits.'
        );
    };

    /**
     * Validates "$_includes" attribute value
     *
     * @param {*} traits
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
            this._throwInvalidAttribute('$_includes', 'an array with string elements.');
        }
    };

    /**
     * Sets "$_includes" attribute value
     *
     * @param {string[]} includes
     *
     *      List of the classes which properties and method current one will contain.
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
        this.getDefinition().$_includes = includes || [];
    };

    /**
     * Return "$_includes" attribute value
     *
     * @returns {string[]}
     */
    ConfigDefinition.prototype.getIncludes = function()
    {
        return this.getDefinition().$_includes;
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.getBaseDefinition = function ()
    {
        var classDefinition = ConfigDefinition.$parent.prototype.getBaseDefinition.call(this);

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

    return ConfigDefinition;

})();