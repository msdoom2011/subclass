/**
 * @class
 * @implements {Subclass.Class.ClassTypeInterface}
 */
Subclass.Class.ClassType = (function()
{
    /**
     * @inheritDoc
     */
    function ClassType(classManager, className, classDefinition)
    {
        if (!classManager) {
            throw new Error("The first parameter is required and must be instance of ClassManager class.");
        }
        if (!className || typeof className != 'string') {
            throw new Error("Class name must be a string!");
        }
        if (!classDefinition && typeof classDefinition != 'object') {
            throw new Error("Class definition must be an object.");
        }

        /**
         * @type {Subclass.Class.ClassManager}
         * @protected
         */
        this._classManager = classManager;

        /**
         * @type {string}
         * @protected
         */
        this._className = className;

        /**
         * @type {Subclass.Class.ClassDefinition}
         * @protected
         */
        this._classDefinition = this.createClassDefinition(classDefinition);

        /**
         * @type {(function|null)}
         * @protected
         */
        this._classConstructor = null;

        /**
         * @type {(ClassType|null)}
         * @protected
         */
        this._classParent = null;

        /**
         * @type {Object}
         * @protected
         */
        this._classProperties = {};

        /**
         * Initializing operations
         */
        this.initialize();
    }

    /**
     * Can be parent class type
     *
     * @type {(ClassTypeInterface|null)}
     */
    ClassType.$parent = Subclass.Class.ClassTypeInterface;

    /**
     * @inheritDoc
     */
    ClassType.getClassTypeName = function ()
    {
        throw new Error('Static method "getClassTypeName" must be implemented.');
    };

    /**
     * @inheritDoc
     */
    ClassType.getClassBuilderClass = function()
    {
        throw new Error('Static method "getClassBuilder" must be implemented.');
    };

    /**
     * @inheritDoc
     */
    ClassType.getClassDefinitionClass = function()
    {
        return Subclass.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.initialize = function()
    {
        var classDefinition = this.getClassDefinition();
            classDefinition.processRelatives();
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassManager = function ()
    {
        return this._classManager;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassName = function ()
    {
        return this._className;
    };

    /**
     * Creates and returns class definition instance.
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.createClassDefinition = function(classDefinition)
    {
        var construct = null;
        var createInstance = true;

        if (!arguments[1]) {
            construct = this.constructor.getClassDefinitionClass();
        } else {
            construct = arguments[1];
        }
        if (arguments[2] === false) {
            createInstance = false;
        }

        if (construct.$parent) {
            var parentConstruct = this.createClassDefinition(
                classDefinition,
                construct.$parent,
                false
            );

            var constructProto = Object.create(parentConstruct.prototype);

            constructProto = Subclass.Tools.extend(
                constructProto,
                construct.prototype
            );

            construct.prototype = constructProto;
            construct.prototype.constructor = construct;
        }

        if (createInstance) {
            var inst = new construct(this, classDefinition);

            if (!(inst instanceof Subclass.Class.ClassDefinition)) {
                throw new Error(
                    'Class definition class must be instance of ' +
                    '"Subclass.Class.ClassDefinition" class.'
                );
            }
            return inst;
        }

        return construct;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.setClassDefinition = function(classDefinition)
    {
        this.constructor.call(
            this,
            this.getClassManager(),
            this.getClassName(),
            classDefinition
        );
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassDefinition = function()
    {
        return this._classDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.setClassParent = function (parentClassName)
    {
        if (typeof parentClassName == 'string') {
            this._classParent = this.getClassManager().getClass(parentClassName)

        } else if (parentClassName === null) {
            this._classParent = null;

        } else {
            throw new Error(
                'Argument parentClassName is not valid. It must be a name of parent class or null ' +
                'in class "' + this.getClassName() + '".'
            );
        }
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassParent = function ()
    {
        return this._classParent;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassProperties = function(withInherited)
    {
        var properties = {};

        if (withInherited !== true) {
            withInherited = false;
        }

        if (withInherited && this.getClassParent()) {
            var parentClass = this.getClassParent();
            var parentClassProperties = parentClass.getClassProperties(withInherited);

            Subclass.Tools.extend(
                properties,
                parentClassProperties
            );
        }
        return Subclass.Tools.extend(
            properties,
            this._classProperties
        );
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.addClassProperty = function(propertyName, propertyDefinition)
    {
        var propertyManager = this.getClassManager().getModule().getPropertyManager();

        this._classProperties[propertyName] = propertyManager.createProperty(
            propertyName,
            propertyDefinition,
            this
        );
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassProperty = function(propertyName)
    {
        var classProperties = this.getClassProperties();

        if (!classProperties[propertyName] && this.getClassParent()) {
            return this.getClassParent().getClassProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            throw new Error('Trying to call to non existent property "' + propertyName + '" ' +
                'in class "' + this.getClassName() + '".');
        }
        return this.getClassProperties()[propertyName];
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.issetClassProperty = function(propertyName)
    {
        var classProperties = this.getClassProperties();

        if (!classProperties[propertyName] && this.getClassParent()) {
            return !!this.getClassParent().getClassProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            return false;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassConstructorEmpty = function ()
    {
        throw new Error('Static method "getClassConstructor" must be implemented.');
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getClassConstructor = function ()
    {
        if (!this._classConstructor) {
            var classDefinition = this.getClassDefinition();
            var baseClassDefinition = classDefinition.getBaseDefinition();

            classDefinition.setDefinition(Subclass.Tools.extend(
                baseClassDefinition,
                classDefinition.getDefinition()
            ));

            classDefinition.validateDefinition();
            classDefinition.processDefinition();

            this._classConstructor = this.createClassConstructor();
        }

        return this._classConstructor;
    };

    /**
     * Generates and returns current class instance constructor
     *
     * @returns {function}
     */
    ClassType.prototype.createClassConstructor = function ()
    {
        var classConstructor = this.getClassConstructorEmpty();
        var parentClass = this.getClassParent();

        if (parentClass) {
            var parentClassConstructor = parentClass.getClassConstructor();
            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            Subclass.Tools.extend(classConstructorProto, classConstructor.prototype);
            classConstructor.prototype = classConstructorProto;
        }

        this.attachClassProperties(classConstructor.prototype);

        Subclass.Tools.extend(
            classConstructor.prototype,
            this.getClassDefinition().getDefinition()
        );
        Object.defineProperty(classConstructor.prototype, "constructor", {
            enumerable: false,
            value: classConstructor
        });

        classConstructor.prototype.$_className = this.getClassName();
        classConstructor.prototype.$_classType = this.constructor.getClassTypeName();
        classConstructor.prototype.$_class = this;

        return classConstructor;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.attachClassProperties = function(context)
    {
        var classProperties = this.getClassProperties();

        for (var propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            classProperties[propName].attach(context);
        }
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.createInstance = function()
    {
        var args = [];

        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var classManager = this.getClassManager();
        var classConstructor = this.getClassConstructor();
        var classProperties = this.getClassProperties(true);
        var classInstance = new classConstructor();


        // Attaching hashed typed properties

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            classProperties[propertyName].attachHashedProperty(classInstance);
        }

        Object.seal(classInstance);


        // Setting required classes to alias typed properties

        if (classInstance.$_requires) {
            if (Subclass.Tools.isPlainObject(classInstance.$_requires)) {
                for (var alias in classInstance.$_requires) {
                    if (!classInstance.$_requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    var setterName = Subclass.Tools.generateSetterName(alias);
                    var requiredClassName = classInstance.$_requires[alias];
                    var requiredClass = classManager.getClass(requiredClassName);

                    classInstance[setterName](requiredClass);
                }
            }
        }
        if (classInstance.$_constructor) {
            classInstance.$_constructor.apply(classInstance, args);
        }

        return classInstance;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.isInstanceOf = function (className)
    {
        if (!className) {
            throw new Error('Class name must be specified!');
        }
        if (this.getClassName() == className) {
            return true;
        }
        if (this.getClassParent()) {
            return this.getClassParent().isInstanceOf(className);
        }
        return false;
    };


    /*************************************************/
    /*        Performing register operations         */
    /*************************************************/

    // Adding not allowed class properties

    Subclass.Property.PropertyManager.registerNotAllowedPropertyNames([
        "class",
        "parent",
        "classManager",
        "class_manager",
        "classWrap",
        "class_wrap",
        "className",
        "class_name"
    ]);

    return ClassType;

})();