/**
 * @class
 * @implements {Subclass.Class.ClassTypeInterface}
 * @description Abstract class of the each class type.
 *      Each instance of current class is a class definition which will be used
 *      for creating instances of its declaration.
 */
Subclass.Class.ClassType = (function()
{
    /**
     * @param {Subclass.Class.ClassManager} classManager
     *      Instance of class manager which will hold all class definitions of current module
     *
     * @param {string} className
     *      Name of the creating class
     *
     * @param {Object} classDefinition
     *      Definition of the creating class
     *
     * @constructor
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
        this._classDefinition = this.createDefinition(classDefinition);

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
     * @abstract
     */
    ClassType.getClassTypeName = function ()
    {
        throw new Error('Static method "getClassTypeName" must be implemented.');
    };

    /**
     * @inheritDoc
     * @abstract
     */
    ClassType.getBuilderClass = function()
    {
        throw new Error('Static method "getClassBuilder" must be implemented.');
    };

    /**
     * @inheritDoc
     */
    ClassType.getDefinitionClass = function()
    {
        return Subclass.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.initialize = function()
    {
        var classDefinition = this.getDefinition();
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
    ClassType.prototype.getName = function()
    {
        return this._className;
    };

    /**
     * Creates and returns class definition instance.
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.createDefinition = function(classDefinition)
    {
        var construct = null;
        var createInstance = true;

        if (!arguments[1]) {
            construct = this.constructor.getDefinitionClass();
        } else {
            construct = arguments[1];
        }
        if (arguments[2] === false) {
            createInstance = false;
        }

        if (construct.$parent) {
            var parentConstruct = this.createDefinition(
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
    ClassType.prototype.setDefinition = function(classDefinition)
    {
        this.constructor.call(
            this,
            this.getClassManager(),
            this.getName(),
            classDefinition
        );
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getDefinition = function()
    {
        return this._classDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.setParent = function (parentClassName)
    {
        if (typeof parentClassName == 'string') {
            this._classParent = this.getClassManager().getClass(parentClassName)

        } else if (parentClassName === null) {
            this._classParent = null;

        } else {
            throw new Error(
                'Argument parentClassName is not valid. It must be a name of parent class or null ' +
                'in class "' + this.getName() + '".'
            );
        }
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getParent = function ()
    {
        return this._classParent;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.hasParent = function()
    {
        return !!this._classParent;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getProperties = function(withInherited)
    {
        var properties = {};

        if (withInherited !== true) {
            withInherited = false;
        }

        if (withInherited && this.hasParent()) {
            var parentClass = this.getParent();
            var parentClassProperties = parentClass.getProperties(withInherited);

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
    ClassType.prototype.addProperty = function(propertyName, propertyDefinition)
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
    ClassType.prototype.getProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return this.getParent().getProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            throw new Error('Trying to call to non existent property "' + propertyName + '" ' +
                'in class "' + this.getName() + '".');
        }
        return this.getProperties()[propertyName];
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.issetProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return !!this.getParent().getProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            return false;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getConstructorEmpty = function ()
    {
        throw new Error('Static method "getConstructor" must be implemented.');
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getConstructor = function ()
    {
        if (!this._classConstructor) {
            var classDefinition = this.getDefinition();
            var baseClassDefinition = classDefinition.getBaseDefinition();

            classDefinition.setDefinition(Subclass.Tools.extend(
                baseClassDefinition,
                classDefinition.getDefinition()
            ));

            classDefinition.validateDefinition();
            classDefinition.processDefinition();

            this._classConstructor = this.createConstructor();
        }

        return this._classConstructor;
    };

    /**
     * Generates and returns current class instance constructor
     *
     * @returns {function}
     */
    ClassType.prototype.createConstructor = function ()
    {
        var classConstructor = this.getConstructorEmpty();
        var parentClass = this.getParent();

        if (parentClass) {
            var parentClassConstructor = parentClass.getConstructor();
            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            Subclass.Tools.extend(classConstructorProto, classConstructor.prototype);
            classConstructor.prototype = classConstructorProto;
        }

        this.attachProperties(classConstructor.prototype);

        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMethods());
        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMetaData());
        Object.defineProperty(classConstructor.prototype, "constructor", {
            enumerable: false,
            value: classConstructor
        });

        classConstructor.prototype.$_className = this.getName();
        classConstructor.prototype.$_classType = this.constructor.getClassTypeName();
        classConstructor.prototype.$_class = this;

        return classConstructor;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.attachProperties = function(context)
    {
        var classProperties = this.getProperties();

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
        var classConstructor = this.getConstructor();
        var classProperties = this.getProperties(true);
        var classInstance = new classConstructor();


        // Attaching hashed typed properties

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            classProperties[propertyName].attachHashedProperty(classInstance);
        }
        var classNoMethods = this.getDefinition().getNoMethods(true);

        for (var propName in classNoMethods) {
            if (!classNoMethods.hasOwnProperty(propName)) {
                continue;
            }
            classInstance[propName] = Subclass.Tools.copy(classNoMethods[propName]);
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
        if (this.getName() == className) {
            return true;
        }
        if (this.hasParent()) {
            return this.getParent().isInstanceOf(className);
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