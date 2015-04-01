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
     * @method setStaticProperties
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
     * var staticProp = TestClass.staticProp;  // "static value"
     * TestClass.staticMethod();               // alerts "static value"
     */
    ClassBuilder.prototype.setStaticProperties = function(staticProperties)
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
     * @method getStaticProperties
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getStaticProperties = function()
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

    return ClassBuilder;
})();