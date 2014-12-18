
"use strict";

window.ClassManager = (function()
{
    /**
     * Class manager constructor
     * @constructor
     */
    function Manager()
    {
        this._propertyManager = ClassManager.PropertyManager.create(this);
        this._classes = {};
    }

    /**
     * Returns property manager instance
     *
     * @returns {PropertyManager}
     */
    Manager.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Checks if current class was registered
     *
     * @param {string} className
     * @returns {boolean}
     */
    Manager.prototype.issetClass = function(className)
    {
        for (var classTypeName in this._classes) {
            if (!this._classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            if (!!this._classes[classTypeName][className]) {
                return true;
            }
        }
        return false;
    };

    /**
     * Creates class instance
     *
     * @param {(ClassType|function)} classConstructor ClassType constructor
     * @param {string} className
     * @param {object} classDefinition
     * @returns {ClassType} class
     */
    Manager.prototype.createClass = function(classConstructor, className, classDefinition)
    {
        var createInstance = true;

        if (arguments[3] === false) {
            createInstance = false;
        }

        if (classConstructor.$parent) {
            var parentClassConstructor = this.createClass(
                classConstructor.$parent,
                className,
                classDefinition,
                false
            );

            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            classConstructorProto = ClassManager.Tools.extend(
                classConstructorProto,
                classConstructor.prototype
            );

            classConstructor.prototype = classConstructorProto;
            classConstructor.prototype.constructor = classConstructor;
        }

        if (createInstance) {
            var inst = new classConstructor(this, className, classDefinition);

            if (!(inst instanceof ClassManager.ClassTypes.ClassType)) {
                throw new Error('Class type factory must be instance of "ClassType" class.');
            }
            return inst;
        }

        return classConstructor;
    };

    /**
     * Adds new class
     *
     * @param {string} classTypeName
     * @param {string} className
     * @param {object} classDefinition
     * @returns {ClassType}
     */
    Manager.prototype.addClass = function(classTypeName, className, classDefinition)
    {
        if (!classTypeName) {
            throw new Error('Trying to register class without specifying class type.');
        }
        if (!ClassManager.issetClassType(classTypeName)) {
            throw new Error('Trying to register class of unknown class type "' + classTypeName + '".');
        }
        if (!className || typeof className != 'string') {
            throw new Error('Trying to register class with wrong name "' + className + '".');
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            throw new Error('Trying to register class with empty or not valid class definition.');
        }
        if (this.issetClass(className)) {
            throw new Error('Trying to redefine already existed class "' + className + '".');
        }
        var classTypeConstructor = ClassManager.getClassType(classTypeName);
        var classInstance = this.createClass(classTypeConstructor, className, classDefinition);

        if (!this._classes[classTypeName]) {
            this._classes[classTypeName] = {};
        }
        this._classes[classTypeName][className] = classInstance;

        return classInstance;
    };

    /**
     * Returns class
     *
     * @param {string} className
     * @returns {ClassType}
     */
    Manager.prototype.getClass = function(className)
    {
        if (!this.issetClass(className)) {
            throw new Error('Trying to call to none existed class "' + className + '".');
        }

        for (var classTypeName in this._classes) {
            if (!this._classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            if (!!this._classes[classTypeName][className]) {
                return this._classes[classTypeName][className];
            }
        }
    };

    Manager.prototype.buildClass = function(classType)
    {
        return this.createClassBuilder(classType);
    };

    Manager.prototype.alterClass = function(className)
    {
        return this.createClassBuilder(null, className);
    };

    /**
     * Creates instance of class builder
     *
     * @param {string} classType It can be name of class type or name of class which you want to alter.
     * @param {string} [className]
     */
    Manager.prototype.createClassBuilder = function(classType, className)
    {
        var classBuilderConstructor = null;
        var createInstance = true;

        if (!arguments[2]) {
            if (className && this.issetClass(className)) {
                classBuilderConstructor = this.getClass(className).constructor.getClassBuilder();
            } else {
                classBuilderConstructor = ClassManager.getClassType(classType).getClassBuilder();
            }
        } else {
            classBuilderConstructor = arguments[2];
        }
        if (arguments[3] === false) {
            createInstance = false;
        }

        if (classBuilderConstructor.$parent) {
            var parentClassBuilderConstructor = this.createClassBuilder(
                classType,
                className,
                classBuilderConstructor.$parent,
                false
            );

            var classBuilderConstructorProto = Object.create(parentClassBuilderConstructor.prototype);

            classBuilderConstructorProto = ClassManager.Tools.extend(
                classBuilderConstructorProto,
                classBuilderConstructor.prototype
            );

            classBuilderConstructor.prototype = classBuilderConstructorProto;
            classBuilderConstructor.prototype.constructor = classBuilderConstructor;
        }

        if (createInstance) {
            var inst = new classBuilderConstructor(this, classType, className);

            if (!(inst instanceof ClassManager.ClassTypes.ClassType.Builder)) {
                throw new Error('Class builder must be instance of "ClassManager.ClassBuilder" class.');
            }
            return inst;
        }

        return classBuilderConstructor;
    };


    //============================== ClassManager API ================================

    /**
     * @type {Object.<function>}
     * @private
     */
    var _classTypes = {};

    /**
     * @type {Array}
     * @private
     */
    var _notAllowedClassPropertyNames = [];

    return {
        /**
         * Namespace for property types
         *
         * @type {(Object.<function>|null)}
         */
        PropertyManager: null,

        /**
         * Class manager tools class
         *
         * @type {(Function|null)}
         */
        ClassTools: null,

        /**
         * Namespace for class types
         *
         * @type {(Object|Object.<function>)}
         */
        ClassTypes: {},

        /**
         * Creates instance of ClassManager
         *
         * @returns {ClassManager}
         */
        create: function()
        {
            return new Manager;
        },

        /**
         * Registers new type of classes
         *
         * @param {function} classTypeConstructor
         */
        registerClassType: function(classTypeConstructor)
        {
            var classTypeName = classTypeConstructor.getClassTypeName();

            _classTypes[classTypeName] = classTypeConstructor;

            /**
             * Registering new config
             *
             * @param {string} className
             * @param {Object} classDefinition
             */
            Manager.prototype["register" + classTypeName] = function (className, classDefinition)
            {
                this.addClass(
                    classTypeConstructor.getClassTypeName(),
                    className,
                    classDefinition
                );
            };
        },

        /**
         * Returns class type constructor
         *
         * @param classTypeName
         * @returns {Function}
         */
        getClassType: function(classTypeName)
        {
            if (!this.issetClassType(classTypeName)) {
                throw new Error('Trying to get non existed class type factory "' + classTypeName + '".');
            }
            return _classTypes[classTypeName];
        },

        /**
         * Checks if exists specified class type
         *
         * @param {string} classTypeName
         * @returns {boolean}
         */
        issetClassType: function(classTypeName)
        {
            return !!_classTypes[classTypeName];
        },

        getClassTypes: function()
        {
            return Object.keys(_classTypes);
        },

        /**
         * Registers new not allowed class property name
         *
         * @param {Array} propertyNames
         */
        registerNotAllowedClassPropertyNames: function(propertyNames)
        {
            try {
                if (!Array.isArray(propertyNames)) {
                    throw "error";
                }
                for (var i = 0; i < propertyNames.length; i++) {
                    if (_notAllowedClassPropertyNames.indexOf(propertyNames[i]) < 0) {
                        if (typeof propertyNames[i] != "string") {
                            throw "error";
                        }
                        _notAllowedClassPropertyNames.push(propertyNames[i]);
                    }
                }
            } catch (e) {
                throw new Error('Property names argument is not valid! It must be an array of strings.');
            }
        },

        getNotAllowedClassPropertyNames: function()
        {
            return _notAllowedClassPropertyNames;
        },

        /**
         * Checks if specified class property name is allowed
         *
         * @param propertyName
         * @returns {boolean}
         */
        isClassPropertyNameAllowed: function(propertyName)
        {
            for (var i = 0; i < _notAllowedClassPropertyNames.length; i++) {
                var regExp = new RegExp("^_*" + _notAllowedClassPropertyNames[i] + "_*$", 'i');

                if (regExp.test(propertyName)) {
                    return false;
                }
            }
            return true;
        }
    };
})();

