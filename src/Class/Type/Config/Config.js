/**
 * @namespace
 */
Subclass.Class.Type.Config = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Config.Config = (function()
{
    /*************************************************/
    /*        Describing class type "Config"          */
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
        return Subclass.Class.Type.Config.ConfigBuilder;
    };

    /**
     * @inheritDoc
     */
    Config.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Config.ConfigDefinition;
    };

    /**
     * @inheritDoc
     */
    Config.prototype.createConstructorOnGet = function()
    {
        return false;
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
            Subclass.Error.create(
                'The config "' + this.getName() + '" can be ' +
                'inherited only from an another config.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    Config.prototype.getConstructorEmpty = function ()
    {
        return function Config() {

            // Hook for the grunt-contrib-uglify plugin
            return Config.name;
        };
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
        if (!className || typeof className != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of including class", false)
                .received(className)
                .expected("a name of existent config class")
                .apply()
            ;
        }
        if (!this.getClassManager().issetClass(className)) {
            Subclass.Error.create(
                'Trying to include non existent class "' + className + '" ' +
                'to config class "' + this.getName() + '".'
            );
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
            Subclass.Error.create('InvalidArgument')
                .argument("the name of included class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
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
        if (!className || typeof className != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of config decorator class", false)
                .received(className)
                .expected("a name of existent config class")
                .apply()
            ;
        }
        if (!this.getClassManager().issetClass(className)) {
            Subclass.Error.create(
                'Trying to attach non existent decorator class "' + className + '" ' +
                'to config class "' + this.getName() + '".'
            );
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
            Subclass.Error.create('InvalidArgument')
                .argument("the name of config decorator class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
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