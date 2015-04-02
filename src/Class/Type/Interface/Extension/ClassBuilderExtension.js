/**
 * @class
 * @constructor
 * @extends {Subclass.Extension}
 */
Subclass.Class.Type.Interface.Extension.ClassBuilderExtension = function() {

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

    /**
     * Validates interface name
     *
     * @param interfaceName
     * @private
     */
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
        this.getDefinition().$_implements = interfacesList;

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

        if (!this.getDefinition().$_implements) {
            this.getDefinition().$_implements = [];
        }
        this.getDefinition().$_implements = this.getDefinition().$_implements.concat(interfacesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} interfaceName
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addInterface = function(interfaceName)
    {
        this._validateInclude(interfaceName);

        if (!this.getDefinition().$_implements) {
            this.getDefinition().$_implements = [];
        }
        this.getDefinition().$_implements.push(interfaceName);

        return this;
    };

    /**
     * Returns interfaces list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getInterfaces = function()
    {
        return this.getDefinition().$_implements || [];
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();