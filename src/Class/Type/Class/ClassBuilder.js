/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        ClassBuilder.$parent.call(this, classManager, classType, className);
    }

    ClassBuilder.$parent = Subclass.Class.ClassBuilder;

    /**
     * Validates list of traits
     *
     * @param {string[]} traitsList
     * @private
     */
    ClassBuilder.prototype._validateTraits = function(traitsList)
    {
        if (!Array.isArray(traitsList)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of trait names", false)
                .received(traitsList)
                .expected("an array of strings")
                .apply()
            ;
        }
        for (var i = 0; i < traitsList.length; i++) {
            this._validateTrait(traitsList[i]);
        }
    };

    /**
     * Validates trait name
     *
     * @param traitName
     * @private
     */
    ClassBuilder.prototype._validateTrait = function(traitName)
    {
        if (typeof traitName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the trait name", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
    };

    /**
     * Sets traits list
     *
     * @param {string[]} traitsList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setTraits = function(traitsList)
    {
        this._validateTraits(traitsList);
        this._getDefinition().$_traits = traitsList;

        return this;
    };

    /**
     * Adds new traits
     *
     * @param {string} traitsList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addTraits = function(traitsList)
    {
        this._validateTraits(traitsList);

        if (!this._getDefinition().$_traits) {
            this._getDefinition().$_traits = [];
        }
        this._getDefinition().$_traits = this._getDefinition().$_traits.concat(traitsList);

        return this;
    };

    /**
     * Adds new trait
     *
     * @param {string[]} traitName
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ClassBuilder.prototype.addTrait = function(traitName)
    {
        this._validateTrait(traitName);

        if (!this._getDefinition().$_traits) {
            this._getDefinition().$_traits = [];
        }
        this._getDefinition().$_traits.push(traitName);

        return this;
    };

    /**
     * Returns traits list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getTraits = function()
    {
        return this._getDefinition().$_traits || [];
    };

    /**
     * Validates list of interfaces
     *
     * @param {string} interfacesList
     * @private
     */
    ClassBuilder.prototype._validateInterfaces = function(interfacesList)
    {
        if (!Array.isArray(interfacesList)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of interface names", false)
                .received(interfacesList)
                .expected("an array of strings")
                .apply()
            ;
        }
        for (var i = 0; i < interfacesList.length; i++) {
            this._validateInterface(interfacesList[i]);
        }
    };

    ClassBuilder.prototype._validateInterface = function(interfaceName)
    {
        if (typeof interfaceName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the interface name", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
    };

    /**
     * Sets interfaces list
     *
     * @param {string[]} interfacesList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setInterfaces = function(interfacesList)
    {
        this._validateInterfaces(interfacesList);
        this._getDefinition().$_implements = interfacesList;

        return this;
    };

    /**
     * Adds new interfaces
     *
     * @param {string} interfacesList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addInterfaces = function(interfacesList)
    {
        this._validateInterfaces(interfacesList);

        if (!this._getDefinition().$_implements) {
            this._getDefinition().$_implements = [];
        }
        this._getDefinition().$_implements = this._getDefinition().$_implements.concat(interfacesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} interfaceName
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ClassBuilder.prototype.addInterface = function(interfaceName)
    {
        this._validateInclude(interfaceName);

        if (!this._getDefinition().$_implements) {
            this._getDefinition().$_implements = [];
        }
        this._getDefinition().$_implements.push(interfaceName);

        return this;
    };

    /**
     * Returns interfaces list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getInterfaces = function()
    {
        return this._getDefinition().$_implements || [];
    };

    return ClassBuilder;

})();