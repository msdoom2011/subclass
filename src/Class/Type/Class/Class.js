/**
 * @namespace
 */
Subclass.Class.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Class.Class = (function() {

    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Class(classManager, className, classDefinition)
    {
        Class.$parent.call(this, classManager, className, classDefinition);

        /**
         * List of abstract methods (functions with needed arguments)
         *
         * @type {(Object|null)}
         * @private
         */
        this._abstractMethods = {};

        /**
         * Names of class static properties
         *
         * @type {Array}
         * @private
         */
        this._static = [];

        /**
         * The context object for static methods
         *
         * @type {Object}
         * @private
         */
        this._staticContext = null;
    }

    Class.$parent = Subclass.Class.ClassType;

    /**
     * @inheritDoc
     */
    Class.getClassTypeName = function ()
    {
        return "Class";
    };

    /**
     * @inheritDoc
     */
    Class.getBuilderClass = function()
    {
        return Subclass.Class.Type.Class.ClassBuilder;
    };

    /**
     * @inheritDoc
     */
    Class.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getConstructorEmpty = function ()
    {
        return function Class() {

            // Hook for the grunt-contrib-uglify plugin
            return Class.name;
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Class.prototype.createConstructor = function ()
    {
        var classConstructor = Class.$parent.prototype.createConstructor.call(this);
        var abstractMethods = this._abstractMethods = this.getAbstractMethods();
        var notImplementedMethods = [];

        if (this.hasParent()) {
            var parent = this.getParent();

            // Adding parent abstract methods

            if (parent.getAbstractMethods) {
                this.extendAbstractMethods(parent);
            }

            // Adding parent static properties

            if (parent.getStaticProperties) {
                this.extendStaticProperties(parent);
            }
        }

        // Checking for not implemented methods

        if (this.constructor != Subclass.Class.Type.AbstractClass.AbstractClass) {
            for (var abstractMethodName in abstractMethods) {
                if (!abstractMethods.hasOwnProperty(abstractMethodName)) {
                    continue;
                }
                if (
                    !classConstructor.prototype[abstractMethodName]
                    || typeof classConstructor.prototype[abstractMethodName] != 'function'
                ) {
                    notImplementedMethods.push(abstractMethodName);
                }
            }
            if (notImplementedMethods.length) {
                Subclass.Error.create(
                    'The class "' + this.getName() + '" must be an abstract or implement abstract methods: ' +
                    '"' + notImplementedMethods.join('", "') + '".'
                );
            }
        }

        return classConstructor;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.setParent = function (parentClassName)
    {
        Class.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Class
            && this._parent.constructor != Subclass.ClassManager.getClassType('AbstractClass')
        ) {
            Subclass.Error.create(
                'The class "' + this.getName() + '" can be inherited ' +
                'only from another class or abstract class.'
            );
        }
    };

    /**
     * Returns class static properties and methods
     *
     * @returns {Object}
     */
    Class.prototype.getStaticContext = function()
    {
        var $this = this;

        if (!this._staticContext) {
            this._staticContext = {

                /**
                 * Returns current class declaration instance
                 *
                 * @returns {Subclass.Class.ClassType}
                 */
                getClass: function()
                {
                    return $this;
                },

                /**
                 * Returns parent of current class
                 *
                 * @returns {(Subclass.Class.ClassType|null)}
                 */
                getParent: function()
                {
                    return $this.getParent();
                }
            }
        }
        return this._staticContext;
    };

    /**
     * Adds static properties
     *
     * @throws {Error}
     *      Throws error if specified invalid static properties definition
     *
     * @param {Object} properties
     */
    Class.prototype.addStaticProperties = function(properties)
    {
        if (!properties || !Subclass.Tools.isPlainObject(properties)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the static properties definition', false)
                .expected('a plain object')
                .received(properties)
                .apply()
            ;
        }
        for (var propName in properties) {
            if (properties.hasOwnProperty(propName)) {
                this.addStaticProperty(propName, properties[propName]);
            }
        }
    };

    /**
     * Adds the new static property.<br />
     *
     * If the static property value was specified as a function then it will contain
     * specific static context object with all earlier defined static properties and methods.<br />
     *
     * If you'll want call static method with another context, you should use the "origin" property of it.
     * For example, instead of using expression myClass.staticMethod.call(obj) you should use this:
     * myClass.staticMethod.<b>origin</b>.call(obj).
     *
     * @thorws {Error}
     *      Throws error if specified invalid static property name
     *
     * @param {string} propertyName
     *      The name of static property
     *
     * @param {*} propertyValue
     *      The value of static property
     */
    Class.prototype.addStaticProperty = function(propertyName, propertyValue)
    {
        if (!propertyName || typeof propertyName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of static property', false)
                .expected('a string')
                .received(propertyName)
                .apply()
            ;
        }
        var staticContext = this.getStaticContext();
            staticContext[propertyName] = propertyValue;

        this._static.push(propertyName);

        if (typeof propertyValue == 'function') {
            this[propertyName] = function() {
                return staticContext[propertyName].apply(staticContext, arguments);
            };
            this[propertyName].origin = propertyValue;

        } else {
            Object.defineProperty(this, propertyName, {
                configurable: true,
                enumerable: true,
                set: function(value) {
                    staticContext[propertyName] = value;
                },
                get: function() {
                    return staticContext[propertyName];
                }
            });
        }
    };

    /**
     * Extends static properties from parent to current class
     *
     * @param {Subclass.Class.Type.Class.Class} parentClass
     *      The parent class declaration instance
     */
    Class.prototype.extendStaticProperties = function(parentClass)
    {
        var ownStaticPropertyNames = Subclass.Tools.copy(this.getStaticPropertyNames());
        var ownStaticContext = Subclass.Tools.copy(this.getStaticContext());
        var parentStaticContext = parentClass.getStaticContext();
        var parentStaticPropertyNames = parentClass.getStaticPropertyNames();
        var propName, propValue;

        for (var i = 0; i < parentStaticPropertyNames.length; i++) {
            propName = parentStaticPropertyNames[i];
            propValue = parentStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
        for (i = 0; i < ownStaticPropertyNames.length; i++) {
            propName = ownStaticPropertyNames[i];
            propValue = ownStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
    };

    /**
     * Returns all defined static class properties
     *
     * @returns {Object}
     */
    Class.prototype.getStaticProperties = function()
    {
        var staticPropertyNames = this._static;
        var staticProperties = {};

        for (var i = 0; i < staticPropertyNames.length; i++) {
            staticProperties[staticPropertyNames[i]] = this[staticPropertyNames];
        }
    };

    /**
     * Returns array with names of static class properties
     *
     * @returns {Array}
     */
    Class.prototype.getStaticPropertyNames = function()
    {
        return this._static;
    };

    /**
     * Returns all abstract methods
     *
     * @returns {Array}
     */
    Class.prototype.getAbstractMethods = function ()
    {
        return this._abstractMethods;
    };

    /**
     * Adds new abstract methods to be implemented
     *
     * @param methods
     */
    Class.prototype.addAbstractMethods = function(methods)
    {
        Subclass.Tools.extend(this._abstractMethods, methods);
    };

    Class.prototype.extendAbstractMethods = function(parentClass)
    {
        Subclass.Tools.extend(
            this.getAbstractMethods(),
            parentClass.getAbstractMethods()
        );
    };

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerClassType(Class);

    return Class;

})();