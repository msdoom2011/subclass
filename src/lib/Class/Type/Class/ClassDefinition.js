/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Class.ClassDefinition = (function()
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
            Subclass.Error.create('InvalidClassDefinitionOption')
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
            this._throwInvalidAttribute('$_traits', 'an array with string elements');
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
            Subclass.Error.create('InvalidClassDefinitionOption')
                .option('$_implements')
                .className(this.getClass().getName())
                .received(interfaces)
                .expected('an array of strings')
                .apply()
            ;
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

        return classDefinition;
    };

    ClassDefinition.prototype.processRelatives = function()
    {
        ClassDefinition.$parent.prototype.processRelatives.call(this);

        var classInst = this.getClass();
        var classManager = classInst.getClassManager();

        var interfaces = this.getImplements();
        var traits = this.getTraits();

        // Performing $_traits (Needs to be defined in ClassDefinition)

        if (traits && this.validateTraits(traits)) {
            for (var i = 0; i < traits.length; i++) {
                classManager.addToLoadStack(traits[i]);
            }
        }

        // Performing $_implements (Needs to be defined in ClassDefinition)

        if (interfaces && this.validateImplements(interfaces)) {
            for (i = 0; i < interfaces.length; i++) {
                classManager.addToLoadStack(interfaces[i]);
            }
        }
    };

    return ClassDefinition;
})();