/**
 * @class
 * @constructor
 * @description
 *
 * The class instance of which allows create the new class definition or alter already existent class.
 * If you want alter definition of existent class you must be sure that was not created no one instance of this class.
 * Otherwise you can't save your changes.
 *
 * @throws {Error}
 *      Throws error if:
 *      - specified invalid or missed the class manager instance
 *      - specified invalid or missed the name of class type
 *
 * @param {Subclass.ClassManager} classManager
 *      The instance of class manager
 *
 * @param {string} [classType]
 *      The name of class type
 *
 * @param {string} [className]
 *      The name of class which definition you want to alter
 */
Subclass.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        if (!classManager || !(classManager instanceof Subclass.ClassManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of class manager', false)
                .received(classManager)
                .expected('an instance of class "Subclass.ClassManager"')
                .apply()
            ;
        }

        /**
         * The class manager instance
         *
         * @type {Subclass.ClassManager}
         * @private
         */
        this._classManager = classManager;

        /**
         * The instance of class definition
         *
         * @type {(Subclass.Class.ClassType|null)}
         * @private
         */
        this._class = null;

        /**
         * The name of class type
         *
         * @type {string}
         * @private
         */
        this._type = classType;

        /**
         * THe name of class
         *
         * @type {string}
         * @private
         */
        this._name = className;

        /**
         * The plain object with definition of class
         *
         * @type {Object}
         * @private
         */
        this._definition = {};

        /**
         * List of events
         *
         * @type {Array}
         * @private
         */
        this._events = [];


        // Initializing

        this
            .registerEvent("onInitialize")
            .registerEvent("onSetClass")
            .registerEvent("onPrepareBody")
            .registerEvent("onValidateBefore")
            .registerEvent("onValidateAfter")
            .registerEvent("onCreateBefore")
            .registerEvent("onCreateAfter")
            .registerEvent("onSaveBefore")
            .registerEvent("onSaveAfter")
            .registerEvent("onSaveAsBefore")
            .registerEvent("onSaveAsAfter")
        ;

        this.initialize();
    }

    ClassBuilder.$parent = Subclass.Extendable;

    ClassBuilder.$mixins = [Subclass.Event.EventableMixin];

    ClassBuilder.prototype = {

        /**
         * Initializes class builder
         */
        initialize: function()
        {
            this.initializeExtensions();
            this.getEvent('onInitialize').trigger();

            if (this.getName() && this.getClassManager().isset(this.getName())) {
                this._setClass(this.getName());
            }
        },

        /**
         * Returns the class manager instance
         *
         * @method getClassManager
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Subclass.ClassManager}
         */
        getClassManager: function()
        {
            return this._classManager;
        },

        /**
         * Sets the class instance which will be altered
         *
         * @method _setClass
         * @private
         *
         * @param {string} className
         *      The name of class
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        _setClass: function(className)
        {
            var classInst = this.getClassManager().get(className);
            var classDefinition = classInst.getDefinition().getData();

            if (classInst.wasInstanceCreated()) {
                Subclass.Error.create(
                    'Can\'t alter class "' + className + '". ' +
                    'The one or more instances of this class was already created ' +
                    'or was created one or more instance of class for which inherits from current one.'
                );
            }
            this.setName(classInst.getName());
            this._setType(classInst.constructor.getClassTypeName());
            this._class = classInst;
            this._setDefinition(Subclass.Tools.copy(classDefinition));
            this.getEvent('onSetClass').trigger(className);

            return this;
        },

        /**
         * Sets the definition of class
         *
         * @method _setDefinition
         * @private
         *
         * @throws {Error}
         *      Throws error if specified invalid definition of class
         *
         * @param {Object} classDefinition
         *      The plain object with definition of class
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        _setDefinition: function(classDefinition)
        {
            if (!classDefinition || !Subclass.Tools.isPlainObject(classDefinition)) {
                Subclass.Error.create('InvalidArgument')
                    .argument("the definition of class", false)
                    .received(classDefinition)
                    .expected("a plain object")
                    .apply()
                ;
            }
            this._definition = classDefinition;

            return this;
        },

        /**
         * Returns class definition
         *
         * @method getDefinition
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Object}
         */
        getDefinition: function()
        {
            return this._definition;
        },

        /**
         * Sets the class type
         *
         * @method _setType
         * @private
         *
         * @throws {Error}
         *      Throws error if specified invalid name of class type
         *
         * @param {string} classType
         *      The name of class type
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        _setType: function(classType)
        {
            if (typeof classType !== 'string') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the type of class", false)
                    .received(classType)
                    .expected("a string")
                    .apply()
                ;
            }
            if (this._class) {
                Subclass.Error.create('Can\'t redefine class type of already registered class.');
            }
            this._type = classType;

            return this;
        },

        /**
         * Returns the name of class type
         *
         * @method getType
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {string}
         */
        getType: function()
        {
            return this._type;
        },

        /**
         * Sets the name of class
         *
         * @method setName
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @throws {Error}
         *      Throws error if class with specified name already exists
         *
         * @param {string} className
         *      The name of class
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        setName: function(className)
        {
            if (this._class) {
                Subclass.Error.create('Can\'t redefine class name of already registered class.');
            }
            this._name = className;

            return this;
        },

        /**
         * Returns the name of class
         *
         * @method getName
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {string}
         */
        getName: function()
        {
            return this._name;
        },

        /**
         * Sets the parent of class (the class which the current one will extend)
         *
         * @method setParent
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @param {string} parentClassName
         *      The name of parent class which the current one will extend
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        setParent: function(parentClassName)
        {
            this.getDefinition().$_extends = parentClassName;

            return this;
        },

        /**
         * Returns the name of parent class
         *
         * @method getParent
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {string}
         */
        getParent: function()
        {
            return this.getDefinition().$_extends || null;
        },

        /**
         * Removes class parent
         *
         * @method removeParent
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        removeParent: function()
        {
            delete this.getDefinition().$_extends;

            return this;
        },

        /**
         * Sets constants of the class
         *
         * @method setConstants
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @throws {Error}
         *      Throws error if specified invalid definition of constants
         *
         * @param {Object} constants
         *      The plain object with constants definitions.
         *
         * @returns {Subclass.Class.ClassBuilder}
         *
         * @example
         * ...
         *
         * app.buildClass("Class")
         *      .setName("Foo/Bar/TestClass")
         *      .setConstants({
         *          FOO_CONST: 10,
         *          BAR_CONST: 20
         *      })
         *      .save()
         * ;
         * ...
         *
         * var TestClass = app.getClass("Foo/Bar/TestClass");
         * var testClassInst = TestClass.createInstance();
         * console.log(testClassInst.FOO_CONST);   // 10
         * console.log(testClassInst.BAR_CONST);   // 20
         */
        setConstants: function(constants)
        {
            if (!constants || !Subclass.Tools.isPlainObject(constants)) {
                Subclass.Error.create('InvalidArgument')
                    .argument("the constants definition", false)
                    .received(constants)
                    .expected("a plain object")
                    .apply()
                ;
            }
            this.getDefinition().$_constants = constants;

            return this;
        },

        /**
         * Returns constants of the class
         *
         * @method getConstants
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Object}
         */
        getConstants: function()
        {
            return this.getDefinition().$_constants || {};
        },

        /**
         * Sets constant of the class
         *
         * @method setConstant
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @throws {Error}
         *      Throws error if specified not allowed name of constant
         *
         * @param {string} constantName
         *      The name of constant
         *
         * @param {*} constantValue
         *      The value of constant
         *
         * @returns {Subclass.Class.ClassBuilder}
         *
         * @example
         * ...
         *
         * builder
         *      .setConstant("FOO_CONST", 10)
         *      .setConstant("BAR_CONST", 20)
         *      .save()
         * ;
         */
        setConstant: function(constantName, constantValue)
        {
            if (typeof constantName !== 'string') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the name of constant", false)
                    .received(constantName)
                    .expected("a string")
                    .apply()
                ;
            }
            this.getDefinition().$_constants[constantName] = constantValue;

            return this;
        },

        /**
         * Removes the constant
         *
         * @method removeConstant
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @throws {Error}
         *      Throws error if specified not allowed name of constant
         *
         * @param {string} constantName
         *      The name of constant
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        removeConstant: function(constantName)
        {
            if (typeof constantName !== 'string') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the name of constant", false)
                    .received(constantName)
                    .expected("a string")
                    .apply()
                ;
            }
            delete this.getDefinition().$_constants[constantName];

            return this;
        },

        /**
         * Prepares the object with class definition (the class body)
         *
         * @method _prepareBody
         * @private
         *
         * @param {Object} classBody
         *      The object with definition of class
         *
         * @returns {*}
         */
        _prepareBody: function(classBody)
        {
            if (!classBody || typeof classBody != 'object') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the class body", false)
                    .received(classBody)
                    .expected("a plain object")
                    .apply()
                ;
            }
            for (var propName in classBody) {
                if (!classBody.hasOwnProperty(propName)) {
                    continue;
                }
                if (propName.match(/^\$_/i)) {
                    delete classBody[propName];
                }
            }
            this
                .getEvent('onPrepareBody')
                .trigger(classBody)
            ;
            return classBody;
        },

        /**
         * Adds new methods and properties to definition of class (the class body)
         *
         * @method addBody
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @param {Object} classBody
         *      The plain object with definitions of properties and methods of the class
         *
         * @returns {Subclass.Class.ClassBuilder}
         *
         * @example
         * ...
         *
         * app.registerClass("Foo/Bar/TestClass", {
         *     _bar: 0,
         *
         *     $_constructor: function(bar) {
         *          this._bar = bar;
         *     }
         * });
         * ...
         *
         * app.alterClass("Foo/Bar/TestClass")
         *     .addBody({
         *
         *         _foo: 10,
         *
         *         setFoo: function(foo) {
         *             this._foo = foo;
         *         },
         *
         *         getFoo: function() {
         *             return this._foo;
         *         }
         *     })
         *     .save()
         * ;
         * ...
         *
         * var TestClass = app.getClass("Foo/Bar/TestClass");
         * var testClassDefinition = TestClass.getDefinition().getData();
         * console.log(testClassDefinition);
         *
         * // {
         * //   ...
         * //   _bar: 0,
         * //   _foo: 10,
         * //   $_constructor: function(bar) { ... },
         * //   setFoo: function(foo) { ... },
         * //   getFoo: function() { ... },
         * //   ...
         * // }
         */
        addBody: function(classBody)
        {
            classBody = this._prepareBody(classBody);

            var classDefinition = this.getDefinition();
            Subclass.Tools.extend(classDefinition, classBody);

            return this;
        },

        /**
         * Sets properties and methods of the class.<br /><br />
         *
         * Defines the class body except special properties which names start from "$_" symbols.
         * The such properties will be omitted.
         *
         * If you alter someone class then the call of this method removes all methods and properties
         * from the class body which not start from "$_" symbols and will be replaced by the new ones
         * from the object which is specified in current method as argument.
         *
         * @param {Object} classBody
         *      The plain object with definitions of properties and methods of the class
         *
         * @returns {Subclass.Class.ClassBuilder}
         *
         * @example
         *
         * app.buildClass("Class")
         *      .setName("Foo/Bar/TestClass")
         *      .setBody({
         *
         *          _bar: 0,
         *
         *          _foo: 10,
         *
         *          $_constructor: function(bar) {
         *              this._bar = bar;
         *          },
         *
         *          setFoo: function(foo) {
         *              this._foo = foo;
         *          },
         *
         *          getFoo: function() {
         *              return this._foo;
         *          }
         *      })
         *      .save()
         * ;
         */
        setBody: function(classBody)
        {
            classBody = this._prepareBody(classBody);

            var classDefinition = this.getDefinition();

            for (var propName in classDefinition) {
                if (!classDefinition.hasOwnProperty(propName)) {
                    continue;
                }
                if (!propName.match(/^$_/)) {
                    delete classDefinition[propName];
                }
            }
            Subclass.Tools.extend(classDefinition, classBody);

            return this;
        },

        /**
         * Sets constructor function of the class
         *
         * @method setConstructor
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @param {Function} constructorFunction
         *      The function which will be invoked every time the instance of class will be created
         *
         * @returns {Subclass.Class.ClassBuilder}
         *
         * @example
         * ...
         *
         * app.buildClass("Class")
         *      .setName("Foo/Bar/TestClass")
         *      .setConstructor(function(bar) {
         *          this._bar = bar;
         *      })
         *      .setBody({
         *          _bar: 0
         *      })
         *      .save()
         * ;
         */
        setConstructor: function(constructorFunction)
        {
            this.getDefinition().$_constructor = constructorFunction;

            return this;
        },

        /**
         * Returns constructor function of the class
         *
         * @method getConstructor
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {(Function|null)}
         */
        getConstructor: function()
        {
            return this.getDefinition().$_constructor || null;
        },

        /**
         * Removes class constructor function
         *
         * @method removeConstructor
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        removeConstructor: function()
        {
            var classDefinition = this.getDefinition();

            delete classDefinition.$_constructor;

            return this;
        },

        /**
         * Validates the result class definition object
         *
         * @method _validate
         * @private
         *
         * @throws {Error}
         *      Throws error if:
         *      - The name of class was missed
         *      - The type of class was missed
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        _validate: function()
        {
            this.getEvent('onValidateBefore').trigger();

            if (!this.getType()) {
                Subclass.Error.create('The type of the future class must be specified.');
            }
            this.getEvent('onValidateAfter').trigger();

            return this;
        },

        /**
         * Creates class type instance without its registration,
         * i.e. creates anonymous class
         *
         * @method create
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Subclass.Class.ClassType}
         */
        create: function()
        {
            this._validate();
            this.getEvent('onCreateBefore').trigger();

            if (this._class) {
                this._class.setDefinition(this.getDefinition());
                return this._class;
            }

            var classTypeConstructor = Subclass.ClassManager.getType(this.getType());
            var classTypeInstance = this.getClassManager().create(
                classTypeConstructor,
                this.getName() || ('AnonymousClass_' + String(Math.round(Math.random() * (new Date).valueOf() / 100000))),
                this.getDefinition()
            );
            this.getEvent('onCreateAfter').trigger(classTypeInstance);

            return classTypeInstance;
        },

        /**
         * Saves class definition changes and registers class
         * if the current one with the same name does not exist
         *
         * @method save
         * @memberOf Subclass.Class.ClassBuilder.prototype
         *
         * @returns {Subclass.Class.ClassType}
         */
        save: function()
        {
            if (!this.getName()) {
                Subclass.Error.create('The future class must be named.');
            }
            this._validate();
            this.getEvent('onSaveBefore').trigger();

            if (this._class) {
                this._class.setDefinition(this.getDefinition());
                return this._class;
            }
            var classTypeInst = this.getClassManager().add(
                this.getType(),
                this.getName(),
                this.getDefinition()
            );
            classTypeInst.getConstructor();
            this.getEvent('onSaveAfter').trigger(classTypeInst);

            return classTypeInst;
        },

        /**
         * Allows to create copy of class with definition of current class builder
         *
         * @param {string} className
         *      The name of new class
         *
         * @returns {Subclass.Class.ClassType}
         */
        saveAs: function(className)
        {
            if (!this.getName()) {
                Subclass.Error.create('The future class must be named.');
            }
            this._validate();
            this.getEvent('onSaveAsBefore').trigger();

            var classInst = this.getClassManager().add(
                this.getType(),
                className,
                this.getDefinition()
            );
            classInst.getConstructor();
            this.getEvent('onSaveAsAfter').trigger(classInst);

            return classInst;
        }
    };

    return ClassBuilder;
})();
