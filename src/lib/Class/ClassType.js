Subclass.ClassManager.ClassTypes.ClassType = (function()
{
    /**
     * Constructor of base class type
     *
     * @param {ClassManager} classManager
     * @param {string} className
     * @param {object} classDefinition
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
         * @type {ClassManager}
         * @private
         */
        this._classManager = classManager;

        /**
         * @type {string}
         * @private
         */
        this._className = className;

        /**
         * @type {Object}
         * @private
         */
        this._classDefinition = classDefinition;

        /**
         * @type {(function|null)}
         * @private
         */
        this._classConstructor = null;

        /**
         * @type {(ClassType|null)}
         * @private
         */
        this._classParent = null;

        /**
         * @type {Object}
         * @private
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
     * @type {ClassType}
     */
    ClassType.$parent = null;

    /**
     * Returns name of class type
     *
     * @returns {string}
     */
    ClassType.getClassTypeName = function ()
    {
        throw new Error('Static method "getClassTypeName" must be implemented.');
    };

    /**
     * Returns class builder constructor of current class type.
     */
    ClassType.getClassBuilder = function()
    {
        throw new Error('Static method "getClassBuilder" must be implemented.');
    };

    /**
     * Initializes class on creation stage
     */
    ClassType.prototype.initialize = function()
    {
        // Do something
    };

    /**
     * Returns class manager instance
     *
     * @returns {ClassManager}
     */
    ClassType.prototype.getClassManager = function ()
    {
        return this._classManager;
    };

    /**
     * Returns name of current class instance
     *
     * @returns {string}
     */
    ClassType.prototype.getClassName = function ()
    {
        return this._className;
    };

    /**
     * Sets class definition
     *
     * @param {Object} classDefinition
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
     * Returns class definition object
     *
     * @returns {Object}
     */
    ClassType.prototype.getClassDefinition = function ()
    {
        return this._classDefinition;
    };

    /**
     * Sets class parent
     *
     * @param {string} parentClassName
     */
    ClassType.prototype.setClassParent = function (parentClassName)
    {
        if (typeof parentClassName == 'string') {
            this._classParent = this.getClassManager().getClass(parentClassName)

        } else if (parentClassName === null) {
            this._classParent = null;

        } else {
            throw new Error('Argument parentClassName is not valid. It must be a name of parent class or null ' +
                'in class "' + this.getClassName() + '".');
        }
    };

    /**
     * Returns parent class instance
     *
     * @return {(ClassType|null)}
     */
    ClassType.prototype.getClassParent = function ()
    {
        return this._classParent;
    };

    /**
     * Returns all typed properties in current class instance
     *
     * @param {boolean} withInherited
     * @returns {Object.<PropertyType>}
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
     * Adds new typed property to class
     *
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     */
    ClassType.prototype.addClassProperty = function(propertyName, propertyDefinition)
    {
        var propertyManager = this.getClassManager().getPropertyManager();

        this._classProperties[propertyName] = propertyManager.createProperty(
            propertyName,
            propertyDefinition,
            this
        );
    };

    /**
     * Returns property instance by its name
     *
     * @param {string} propertyName
     * @returns {PropertyType}
     * @throws {Error}
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
     * Checks if property with specified property name exists
     *
     * @param propertyName
     * @returns {boolean}
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

    ClassType.prototype.getStatic = function()
    {
        return this.getClassDefinition().$_static || {};
    };

    /**
     * Returns constructor function for current class type
     *
     * @returns {function} Returns named function
     * @throws {Error}
     */
    ClassType.prototype.getClassConstructorEmpty = function ()
    {
        throw new Error('Static method "getClassConstructor" must be implemented.');
    };

    /**
     * Returns class constructor
     *
     * @returns {function}
     */
    ClassType.prototype.getClassConstructor = function ()
    {
        if (!this._classConstructor) {
            var baseClassDefinition = this.getBaseClassDefinition();
            this._classDefinition = Subclass.Tools.extend(
                baseClassDefinition,
                this._classDefinition
            );

            this.validateClassDefinition();
            this.processClassDefinition();

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
        Subclass.Tools.extend(classConstructor.prototype, this.getClassDefinition());

        Object.defineProperty(classConstructor.prototype, "constructor", {
            enumerable: false,
            value: classConstructor
        });

        classConstructor.prototype.$_classType = classConstructor.name;
        classConstructor.prototype.$_className = this.getClassName();
        classConstructor.prototype.$_class = this;

        return classConstructor;
    };

    /**
     * Creates and attaches class typed properties
     *
     * @param context
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
     * Checks if current class is instance of another class
     *
     * @param {string} className
     * @return {boolean}
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

    /**
     * Creates class instance of current class type
     *
     * @returns {object} Class instance
     */
    ClassType.prototype.createInstance = function ()
    {
        var args = [];

        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var classConstructor = this.getClassConstructor();
        var classProperties = this.getClassProperties(true);
        var classInstance = new classConstructor();

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            classProperties[propertyName].attachHashedProperty(classInstance);
        }

        Object.seal(classInstance);

        if (classInstance.$_constructor) {
            classInstance.$_constructor.apply(classInstance, args);
        }

        return classInstance;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    ClassType.prototype.getBaseClassDefinition = function ()
    {
        return {

            /**
             * @type {string} Class name
             */
            $_className: null,

            /**
             * @type {string} Class type
             */
            $_classType: null,

            /**
             * @type {ClassType} Class definition closure
             */
            $_class: null,

            /**
             * @type {(string[]|null)} Required classes
             * @TODO needed for auto load classes in further implementation
             */
            $_requires: null,

            /**
             * @type {string} Parent class name
             */
            $_extends: null,

            /**
             * @type {Object} List of class typed properties
             */
            $_properties: {},

            /**
             * @type {Object} Static properties and methods for current class constructor
             */
            $_static: {},

            /**
             * Class constructor
             *
             * @param [arguments] Any class constructor arguments
             */
            $_constructor: function()
            {
                // Do something
            },

            /**
             * Returns class manager instance
             *
             * @returns {ClassManager}
             */
            getClassManager: function()
            {
                return this.$_class.getClassManager();
            },

            /**
             * Returns class name
             *
             * @returns {string}
             */
            getClassName: function()
            {
                return this.$_className;
            },

            getStatic: function()
            {
                return this.$_class.getStatic();
            },

            /**
             * Checks if current class instance of passed class with specified name
             *
             * @param {string} className
             * @returns {boolean}
             */
            isInstanceOf: function (className)
            {
                return this.$_class.isInstanceOf(className);
            },

            /**
             * Returns parent class definition instance
             *
             * @returns {Object} Prototype of parent class.
             */
            getParent: function ()
            {
                if (!this.$_class.getClassParent()) {
                    return null;
                }
                return this.$_class
                    .getClassParent()
                    .getClassConstructor()
                    .prototype
                ;
            },

            /**
             * Returns copy of current class instance
             *
             * @returns {Object}
             */
            getCopy: function()
            {
                // @TODO needs further implementation
            },

            /**
             * Validates type of parameter and setts default value if it's undefined
             *
             * @param {string} paramType
             * @param {*} paramValue
             * @param {*} [defaultValue]
             * @returns {*}
             */
            param: function (paramType, paramValue, defaultValue)
            {
                if (typeof paramValue == 'undefined') {
                    paramValue = defaultValue;
                }
                //if (typeof paramValue != paramType && paramValue !== null) {
                //    throw new Error("Trying to set not valid value of type '" + (typeof paramValue) + "'. '" + paramType + "' is expected.");
                //}

                return paramValue;
            },

            /**
             * Checks if property is typed
             *
             * @param {string} propertyName
             * @returns {boolean}
             */
            issetProperty: function(propertyName)
            {
                return this.$_class.issetClassProperty(propertyName);
            },

            /**
             * Returns property api object
             *
             * @param {string} propertyName
             * @returns {Subclass.PropertyManager.PropertyTypes.PropertyAPI}
             */
            getProperty: function(propertyName)
            {
                return this.$_class.getClassProperty(propertyName).getAPI(this);
            }
        };
    };

    /**
     * Validates class
     */
    ClassType.prototype.validateClassDefinition = function ()
    {
        var classDefinition = this.getClassDefinition();

        for (var propName in classDefinition) {
            if (!classDefinition.hasOwnProperty(propName)) {
                continue;
            }
            if (!Subclass.ClassManager.isClassPropertyNameAllowed(propName)) {
                throw new Error('Trying to define property with not allowed name "' + propName + '" ' +
                    'in class "' + this.getClassName() + '".');
            }
        }
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassType.prototype.processClassDefinition = function ()
    {
        var classDefinition = this.getClassDefinition();
        var classProperties = classDefinition.$_properties;
        var parentClassName = classDefinition.$_extends;

        if (classProperties && typeof classProperties == 'object') {
            for (var propName in classProperties) {
                if (!classProperties.hasOwnProperty(propName)) {
                    continue;
                }
                this.addClassProperty(
                    propName,
                    classProperties[propName]
                );
            }
        }
        if (parentClassName && typeof parentClassName == 'string') {
            this.setClassParent(parentClassName);
        }

        // Extending accessors

        this.extendClassPropertyAccessors();
    };

    /**
    * Extends class constructor with specific methods.
    *
    * If getter or setter of any typed property was redefined in the class definition
    * the new methods will generated. For setter it's gonna be "<setterOrGetterName>Default"
    * where "<setterOrGetterName>" is name of redefined setter or getter name.
    *
    * These methods allows to interact with private properties through redefined getters and setters.
    *
    * @returns {Function}
    */
    ClassType.prototype.extendClassPropertyAccessors = function()
    {
        var classProperties = this.getClassProperties();
        var classDefinition = this.getClassDefinition();

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            var property = classProperties[propertyName];

            if (!property.isUseAccessors()) {
                continue;
            }
            var accessors = {
                Getter: Subclass.Tools.generateGetterName(propertyName),
                Setter: Subclass.Tools.generateSetterName(propertyName)
            };

            for (var accessorType in accessors) {
                if (!accessors.hasOwnProperty(accessorType)) {
                    continue;
                }
                var accessorName = accessors[accessorType];

                if (classDefinition[accessorName]) {
                    classDefinition[accessorName + "Default"] = property['generate' + accessorType]();
                }
            }
        }
    };


    /*************************************************/
    /*        Performing register operations         */
    /*************************************************/

    // Adding not allowed class properties

    Subclass.ClassManager.registerNotAllowedClassPropertyNames([
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