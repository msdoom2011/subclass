/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassDefinition}
 */
Subclass.ClassManager.ClassTypes.ClassType.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.ClassManager.ClassTypes.ClassDefinition;

    /**
     * Validates "$_static" attribute value
     *
     * @param {*} value
     * @throws {Error}
     */
    ClassDefinition.prototype.validateStatic = function(value)
    {
        if (value !== null && Subclass.Tools.isPlainObject(value)) {
            this._throwInvalidAttribute('$_static', 'an object or null.');
        }
    };

    /**
     * Sets "$_static" attribute value
     *
     * @param {Object} value Plain object with different properties and methods
     */
    ClassDefinition.prototype.setStatic = function(value)
    {
        this.validateStatic(value);
        this.getDefinition().$_static = value || {};
    };

    /**
     * Returns "$_static" attribute value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getStatic = function()
    {
        return this.getDefinition().$_static;
    };

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} traits
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
            this._throwInvalidAttribute('$_traits', 'an array with string elements.');
        }
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
        this.getDefinition().$_traits = traits || [];

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
        return this.getDefinition().$_traits;
    };

    /**
     * Validates "$_implements" attribute value
     *
     * @param {*} interfaces
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
            this._throwInvalidAttribute('$_implements', 'an array with string elements.');
        }
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
        this.getDefinition().$_implements = interfaces || [];

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
        return this.getDefinition().$_traits;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getBaseDefinition = function ()
    {
        var classDefinition = ClassDefinition.$parent.prototype.getBaseDefinition();

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

    ///**
    // * @inheritDoc
    // */
    //ClassDefinition.prototype.processDefinition = function ()
    //{
    //    var classDefinition = this.getDefinition();
    //
    //    // Parsing traits
    //
    //    for (var i = 0; i < classDefinition.$_traits.length; i++) {
    //        this.addTrait(classDefinition.$_traits[i]);
    //    }
    //
    //    // Parsing interfaces
    //
    //    for (i = 0; i < classDefinition.$_implements.length; i++) {
    //        this.addInterface(classDefinition.$_implements[i]);
    //    }
    //
    //    ClassDefinition.$parent.prototype.processClassDefinition.call(this);
    //};

    return ClassDefinition;
})();