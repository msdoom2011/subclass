/**
 * @class
 * @extends {Subclass.Class.ClassTypeBuilder}
 */
Subclass.Class.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        ClassBuilder.$parent.call(this, classManager, classType, className);
    }

    ClassBuilder.$parent = Subclass.Class.ClassTypeBuilder;

    /**
     * Validates traits list argument
     *
     * @param {*} traitsList
     * @private
     */
    ClassBuilder.prototype._validateTraits = function(traitsList)
    {
        try {
            if (!Array.isArray(traitsList)) {
                throw "error";
            }
            for (var i = 0; i < traitsList.length; i++) {
                if (typeof traitsList[i] != "string") {
                    throw "error";
                }
            }
        } catch (e) {
            throw new Error('Invalid value of argument "traitsList" in method "setTraits" in "ClassBuilder" class.');
        }
    };

    /**
     * Sets traits list
     *
     * @param {string[]} traitsList
     * @returns {Subclass.Class.Class.ClassBuilder}
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
     * @returns {Subclass.Class.Class.ClassBuilder}
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
     * Returns traits list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getTraits = function()
    {
        return this._getDefinition().$_traits || [];
    };

    ClassBuilder.prototype._validateInterfaces = function(interfacesList)
    {
        try {
            if (!Array.isArray(interfacesList)) {
                throw "error";
            }
            for (var i = 0; i < interfacesList.length; i++) {
                if (typeof interfacesList[i] != "string") {
                    throw "error";
                }
            }
        } catch (e) {
            throw new Error('Invalid value of argument "interfacesList" in method "setInterfaces" in "ClassBuilder" class.');
        }
    };

    /**
     * Sets interfaces list
     *
     * @param {string[]} interfacesList
     * @returns {Subclass.Class.Class.ClassBuilder}
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
     * @returns {Subclass.Class.Class.ClassBuilder}
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