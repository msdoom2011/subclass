/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassBuilderExtension = function() {

    function ClassBuilderExtension(classInst)
    {
        ClassBuilderExtension.$parent.apply(this, arguments);
    }

    ClassBuilderExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassBuilder = Subclass.Class.Type.Class.ClassBuilder;

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
        this.getDefinition().$_traits = traitsList;

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

        if (!this.getDefinition().$_traits) {
            this.getDefinition().$_traits = [];
        }
        this.getDefinition().$_traits = this.getDefinition().$_traits.concat(traitsList);

        return this;
    };

    /**
     * Adds new trait
     *
     * @param {string[]} traitName
     * @returns {Subclass.Class.Type.Trait.TraitBuilder}
     */
    ClassBuilder.prototype.addTrait = function(traitName)
    {
        this._validateTrait(traitName);

        if (!this.getDefinition().$_traits) {
            this.getDefinition().$_traits = [];
        }
        this.getDefinition().$_traits.push(traitName);

        return this;
    };

    /**
     * Returns traits list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getTraits = function()
    {
        return this.getDefinition().$_traits || [];
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();