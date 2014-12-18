; ClassManager.ClassTypes.ClassType = (function()
{
    /**
     * Constructor of base class type
     *
     * @param {ClassManager} classManager
     * @param {string} className
     * @param {object} classDefinition
     * @returns {{}}
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
         * @type {{}}
         * @private
         */
        this._staticProperties = {};

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
     * @returns {Object.<PropertyType>}
     */
    ClassType.prototype.getClassProperties = function()
    {
        return this._classProperties;
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

    /**
     * Setup static methods and properties of current class
     *
     * @param staticProperties
     */
    ClassType.prototype.setStaticProperties = function(staticProperties)
    {
        if (!staticProperties || typeof staticProperties != "object") {
            throw new Error('Argument with static properties must be an object ' +
                'in class "' + this.getClassName() + '".');
        }
        this._staticProperties = staticProperties;
    };

    /**
     * Returns all static methods of current class
     *
     * @returns {*}
     */
    ClassType.prototype.getStaticProperties = function()
    {
        return this._staticProperties;
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
            this._classDefinition = ClassManager.Tools.extend(
                baseClassDefinition,
                this._classDefinition
            );

            this.validateClassDefinition();
            this.processClassDefinition();

            this._classConstructor = this.createClassConstructor();
            this._classConstructor = this.extendClassConstructor();
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

            ClassManager.Tools.extend(classConstructorProto, classConstructor.prototype);
            classConstructor.prototype = classConstructorProto;
        }

        ClassManager.Tools.extend(classConstructor.prototype, this.getClassDefinition());
        this.attachClassProperties(classConstructor.prototype);
        this.attachStaticProperties(classConstructor);

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
    ClassType.prototype.extendClassConstructor = function()
    {
        var classConstructor = this.getClassConstructor();
        var classProperties = this.getClassProperties();

        if (classProperties) {
            var classPropertiesNames = Object.keys(classProperties);
            var classDefinition = this.getClassDefinition();

            for (var i = 0; i < classPropertiesNames.length; i++) {
                var propertyName = classPropertiesNames[i];

                if (!classProperties[propertyName].isUseAccessors()) {
                    continue;
                }
                var accessors = [
                    ClassManager.Tools.generateSetterName(propertyName),
                    ClassManager.Tools.generateGetterName(propertyName)
                ];
                for (var j = 0; j < accessors.length; j++) {
                    var accessorName = accessors[j];

                    if (classDefinition[accessorName]) {
                        classConstructor.prototype[accessorName + "Default"] = classConstructor.prototype[accessorName];
                        classConstructor.prototype[accessorName] = classDefinition[accessorName];
                    }
                }
            }
        }
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
     * Attaches static properties to constructor
     *
     * @param context
     */
    ClassType.prototype.attachStaticProperties = function(context)
    {
        var staticProperties = this.getStaticProperties();

        for (var propName in staticProperties) {
            if (!staticProperties.hasOwnProperty(propName)) {
                continue;
            }
            context[propName] = staticProperties[propName];
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
        var classInstance = new classConstructor();

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
            $_constructor: function ()
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
                return this.getClassWrap().getClassManager();
            },

            /**
             * Returns class name
             *
             * @returns {string}
             */
            getClassName: function ()
            {
                return this.$_className;
            },

            /**
             * Returns class definition instance
             *
             * @returns {ClassType}
             */
            getClassWrap: function ()
            {
                return this.$_class;
            },

            /**
             * Checks if current class instance of passed class with specified name
             *
             * @param {string} className
             * @returns {boolean}
             */
            isInstanceOf: function (className)
            {
                return this.getClassWrap().isInstanceOf(className);
            },

            /**
             * Returns parent class definition instance
             *
             * @returns {ClassType} Prototype of parent class.
             */
            getParent: function ()
            {
                if (!this.getClassWrap().getClassParent()) {
                    return null;
                }
                return this.getClassWrap()
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
                if (typeof paramValue != paramType && paramValue !== null) {
                    throw new Error("Trying to set not valid value of type '" + (typeof paramValue) + "'. '" + paramType + "' is expected.");
                }
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
                return this.getClassWrap().issetClassProperty(propertyName);
            },

            /**
            * Returns class typed property
            *
            * @param {string} propertyName
            * @returns {PropertyType}
            */
            getPropertyValue: function(propertyName)
            {
                return this.getClassWrap().getClassProperty(propertyName).getValue(this);
            },

            /**
            * Sets class typed property
            *
            * @param {string} propertyName
            * @param {*} value
            * @returns {PropertyType}
            */
            setPropertyValue: function(propertyName, value)
            {
                return this.getClassWrap().getClassProperty(propertyName).setValue(this, value);
            },

            /**
             * Returns default value of typed class property
             *
             * @param {string} propertyName
             * @returns {*}
             */
            getPropertyDefaultValue: function (propertyName)
            {
                var classInst = this.getClassWrap();
                var propertyInst = classInst.getClassProperty(propertyName);

                return propertyInst.getDefaultValue();
            },

            /**
             * Checks if specified value is valid for interesting property
             *
             * @param {string} propertyName
             * @param {*} value
             * @returns {boolean}
             */
            isPropertyValueValid: function(propertyName, value)
            {
                var classInst = this.getClassWrap();
                var classProperty = classInst.getClassProperty(propertyName);

                try {
                    classProperty.validate(value);
                    return true;

                } catch (e) {
                    return false;
                }
            },

            /**
             * Checks if property value was ever changed
             *
             * @param {string} propertyName
             * @returns {boolean}
             */
            isPropertyModified: function(propertyName)
            {
                var classWrap = this.getClassWrap();
                var classProperty = classWrap.getClassProperty(propertyName);

                return classProperty.isModified();
            },

            /**
             * Marks property as modified
             *
             * @param propertyName
             */
            setPropertyModified: function(propertyName)
            {
                var classWrap = this.getClassWrap();
                var classProperty = classWrap.getClassProperty(propertyName);

                classProperty.setIsModified(true);
            },

            /**
             * Marks property as not modifield
             *
             * @param propertyName
             */
            setPropertyUnmodified: function(propertyName)
            {
                var classWrap = this.getClassWrap();
                var classProperty = classWrap.getClassProperty(propertyName);

                return classProperty.setIsModified(false);
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
            if (!ClassManager.isClassPropertyNameAllowed(propName)) {
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
        var staticProperties = classDefinition.$_static;
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
        if (staticProperties && typeof staticProperties == 'object') {
            this.setStaticProperties(staticProperties);
        }
        if (parentClassName && typeof parentClassName == 'string') {
            this.setClassParent(parentClassName);
        }
    };


    /*************************************************/
    /*        Performing register operations         */
    /*************************************************/

    // Adding not allowed class properties

    ClassManager.registerNotAllowedClassPropertyNames([
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