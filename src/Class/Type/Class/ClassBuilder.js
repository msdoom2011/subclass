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
     * Sets static properties and methods of the class
     *
     * @method setStatic
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of static properties
     *
     * @param {Object} staticProperties
     *      The plain object with definitions of static properties.
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.buildClass("Class")
     *      .setName("Foo/Bar/TestClass")
     *      .setStatic({
     *          staticProp: "static value",
     *          staticMethod: function() {
     *              alert(this.staticProp);
     *          }
     *      })
     *      .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     * var TestClassStatic = TestClass.getStatic();
     *
     * var staticProp = TestClassStatic.staticProp;  // "static value"
     * TestClassStatic.staticMethod();               // alerts "static value"
     */
    ClassBuilder.prototype.setStatic = function(staticProperties)
    {
        if (!staticProperties || !Subclass.Tools.isPlainObject(staticProperties)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the static properties", false)
                .received(staticProperties)
                .expected("a plain object")
                .apply()
            ;
        }
        this.getDefinition().$_static = staticProperties;

        return this;
    };

    /**
     * Returns static properties and methods of the class
     *
     * @method getStatic
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getStatic = function()
    {
        return this.getDefinition().$_static || {};
    };

    /**
     * Sets static property or method of the class
     *
     * @method setStaticProperty
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of static property or method
     *
     * @param {string} staticPropertyName
     *      The name of static property or method
     *
     * @param {*} staticPropertyValue
     *      The value of static property or method
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * // Defining few static properties
     * builder.setStatic({
     *     foo: "foo value",
     *     bar: 100
     * });
     *
     * // Defining static properties one at a time
     * builder
     *     .setStaticProperty("foo", "foo value")
     *     .setStaticProperty("bar", 100)
     * ;
     */
    ClassBuilder.prototype.setStaticProperty = function(staticPropertyName, staticPropertyValue)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of static property", false)
                .received(staticPropertyName)
                .expected("a string")
                .apply()
            ;
        }
        this.getDefinition().$_static[staticPropertyName] = staticPropertyValue;

        return this;
    };

    /**
     * Removes the static property or method
     *
     * @method removeStaticProperty
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of static property or name
     *
     * @param {string} staticPropertyName
     *      The name of static property or method
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeStaticProperty = function(staticPropertyName)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of static property", false)
                .received(staticPropertyName)
                .expected("a string")
                .apply()
            ;
        }
        delete this.getDefinition().$_static[staticPropertyName];
        return this;
    };

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
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
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
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
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

    return ClassBuilder;

})();