/**
 * @class
 */
Subclass.Class.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.Class.ClassType)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the class instance", false)
                .received(classInst)
                .expected('an instance of "Subclass.Class.ClassType"')
                .apply()
            ;
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected('a plain object')
                .apply()
            ;
        }

        /**
         * @type {Subclass.Class.ClassType}
         * @private
         */
        this._class = classInst;

        /**
         * @type {Object}
         * @private
         */
        this._data = classDefinition;

        /**
         * @type {Object}
         * @private
         */
        this._events = {};

        // Initializing operations

        this
            .registerEvent('onInitialize')
            .registerEvent('onGetBaseData')
            .registerEvent('onProcessRelatedClasses')
            .registerEvent('onNormalizeData')
            .registerEvent('onValidateData')
            .registerEvent('onProcessData')
            .registerEvent('onGetNoMethods')
            .registerEvent('onGetMethods')
            .registerEvent('onGetMetaData')
        ;
        this.initialize();
    }

    ClassDefinition.$parent = Subclass.Extendable;

    ClassDefinition.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Initializes class definition
     */
    ClassDefinition.prototype.initialize = function()
    {
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    };

    /**
     * Returns class definition object
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getData = function()
    {
        return this._data;
    };

    /**
     * Sets class definition data
     *
     * @param data
     */
    ClassDefinition.prototype.setData = function(data)
    {
        if (!data || typeof data != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition data", false)
                .received(data)
                .expected("a plain object")
                .apply()
            ;
        }
        this._data = data;
    };

    /**
     * Returns class instance
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassDefinition.prototype.getClass = function()
    {
        return this._class;
    };

    /**
     * Validates "$_requires" option value
     *
     * @param {*} requires
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateRequires = function(requires)
    {
        if (requires && typeof requires != 'object') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_requires')
                .received(requires)
                .className(this.getClass().getName())
                .expected('a plain object with string properties')
                .apply()
            ;
        }
        if (requires) {
            if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    if (typeof requires[i] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            } else {
                for (var alias in requires) {
                    if (!requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    if (!alias[0].match(/[a-z$_]/i)) {
                        Subclass.Error.create(
                            'Invalid alias name for required class "' + requires[alias] + '" ' +
                            'in class "' + this.getClass().getName() + '".'
                        );
                    }
                    if (typeof requires[alias] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            }
        }
        return true;
    };

    /**
     * Sets "$_requires" option value
     *
     * @param {Object.<string>} requires
     *
     * List of the classes that current one requires. It can be specified in two ways:
     *
     * 1. As an array of class names:
     *
     * Example:
     * [
     *    "Namespace/Of/Class1",
     *    "Namespace/Of/Class2",
     *    ...
     * ]
    */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;
    };

    /**
     * Return "$_requires" option value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getData().$_requires;
    };

    /**
     * Validates "$_extends" option value
     *
     * @param {*} parentClassName
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateExtends = function(parentClassName)
    {
        if (parentClassName !== null && typeof parentClassName != 'string') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_extends')
                .received(parentClassName)
                .className(this.getClass().getName())
                .expected('a string or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_extends" option value
     *
     * @param {string} parentClassName  Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setExtends = function(parentClassName)
    {
        this.validateExtends(parentClassName);
        this.getData().$_extends = parentClassName;

        if (parentClassName) {
            this.getClass().setParent(parentClassName);
        }
    };

    /**
     * Returns "$_extends" option value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getExtends = function()
    {
        return this.getData().$_extends;
    };

    /**
     * Validates "$_constants" option value
     *
     * @param {*} constants
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateConstants = function(constants)
    {
        if (constants !== null && !Subclass.Tools.isPlainObject(constants)) {
            Subclass.Error.create("InvalidClassOption")
                .option('$_constants')
                .className(this.getClass().getName())
                .received(constants)
                .expected('a plain object with not function values')
                .apply()
            ;
        } else if (constants) {
            for (var constantName in constants) {
                if (!constants.hasOwnProperty(constantName)) {
                    continue;
                }
                if (typeof constants[constantName] == 'function') {
                    Subclass.Error.create("InvalidClassOption")
                        .option('$_constants')
                        .className(this.getClass().getName())
                        .expected('a plain object with not function values')
                        .apply()
                    ;
                }
            }
        }
    };

    /**
     * Sets "$_constants" option value
     *
     * @param {Object} constants
     *      Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setConstants = function(constants)
    {
        this.validateConstants(constants);
        this._constants = constants;

        if (constants) {
            this.getClass().setConstants(constants);
        }
    };

    /**
     * Returns "$_constants" option value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getConstants = function()
    {
        return this._constants;
    };

    /**
     * Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMetaData = function(withInherited)
    {
        var metaData = this._getDataPart('metaData', withInherited);

        this.getEvent('onGetMetaData').trigger(metaData);

        return metaData;
    };

    /**
     * Returns all class methods (except methods which names started from symbols "$_")
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMethods = function(withInherited)
    {
        var methods = this._getDataPart('methods', withInherited);

        this.getEvent('onGetMethods').trigger(methods);

        return methods;
    };

    /**
     * Returns class to which belongs specified method body
     *
     * @param {Function} methodName
     *      The name of class method
     *
     * @returns {(Subclass.Class.ClassType|null)}
     */
    ClassDefinition.prototype.getMethodClass = function(methodName)
    {
        var classInst = this.getData();

        if (classInst.hasOwnProperty(methodName)) {
            return this.getClass();
        }
        if (this.getClass().hasParent()) {
            return this.getClass()
                .getParent()
                .getDefinition()
                .getMethodClass(methodName)
            ;
        }
        return null;
    };

    /**
     * Returns class method by its name
     *
     * @param {string} methodName
     *      The name of method
     */
    ClassDefinition.prototype.getMethod = function(methodName)
    {
        if (!this.issetMethod(methodName)) {
            Subclass.Error.create(
                'Trying to get non existent method "' + methodName + '" ' +
                'from definition of class "' + this.getClass().getName() + '".'
            );
        }
        return this.getMethods(true)[methodName];
    };

    /**
     * Checks whether method with specified name exists
     *
     * @param {string} methodName
     *      The name of method
     */
    ClassDefinition.prototype.issetMethod = function(methodName)
    {
        return this.getMethods(true).hasOwnProperty(methodName);
    };

    /**
     * Returns all class properties (except properties which names started from symbols "$_")
     * that are not methods
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getNoMethods = function(withInherited)
    {
        var noMethods = this._getDataPart('noMethods', withInherited);

        this.getEvent('onGetNoMethods').trigger(noMethods);

        return noMethods;
    };

    /**
     * Returns some grouped parts of class definition depending on specified typeName.
     *
     * @param {string} typeName
     *      Can be one of the followed values: 'noMethods', 'methods' or 'metaData'
     *
     *      noMethods - Returns all class properties (except properties which names started from symbols "$_")
     *      that are not methods
     *
     *      methods - Returns all class methods (except methods which names started from symbols "$_")
     *
     *      metaData - Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     * @private
     */
    ClassDefinition.prototype._getDataPart = function(typeName, withInherited)
    {
        if (['noMethods', 'methods', 'metaData'].indexOf(typeName) < 0) {
            Subclass.Error.create(
                'Trying to get not existent ' +
                'class definition part data "' + typeName + '".'
            );
        }
        if (withInherited !== true) {
            withInherited = false;
        }
        var definition = this.getData();
        var classInst = this.getClass();
        var parts = {};

        if (classInst.hasParent() && withInherited) {
            var classParent = classInst.getParent();
            var classParentDefinition = classParent.getDefinition();

            parts = classParentDefinition._getDataPart(
                typeName,
                withInherited
            );
        }

        for (var propName in definition) {
            if (
                !definition.hasOwnProperty(propName)
                || (
                    (typeName == 'noMethods' && (
                        typeof definition[propName] == 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'methods' && (
                        typeof definition[propName] != 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'metaData' && (
                        !propName.match(/^\$_/i)
                    ))
                )
            ) {
                continue;
            }
            parts[propName] = definition[propName];
        }
        return parts;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    ClassDefinition.prototype.createBaseData = function()
    {
        return {

            /**
             * Required classes
             *
             * @type {(string[]|Object.<string>|null)}
             */
            $_requires: null,

            /**
             * Parent class name
             *
             * @type {string}
             */
            $_extends: null,

            /**
             * Constants list
             *
             * @type {Object}
             */
            $_constants: null,

            /**
             * Returns class manager instance
             *
             * @returns {Subclass.ClassManager}
             */
            getClassManager: function()
            {
                return this.$_class.getClassManager();
            },

            /**
             * Returns class definition instance
             *
             * @returns {Subclass.Class.ClassType}
             */
            getClass: function()
            {
                return this.$_class;
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

            /**
             * Returns type name of class
             *
             * @returns {*}
             */
            getClassType: function()
            {
                return this.$_classType;
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
             * Returns parent class
             *
             * @returns {Object} parent class.
             */
            getParent: function ()
            {
                if (this.$_class.hasParent()) {
                    return this.$_class.getParent();
                }
                return null;
            },

            /**
             *
             * @param {string} methodName
             * @param [arguments]
             */
            callParent: function (methodName)
            {
                var methodFunc = this[methodName];

                if (!methodFunc || typeof methodFunc != 'function') {
                    Subclass.Error.create(
                        'Trying to call to non existent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '"'
                    );
                }
                var parentClass = this
                    .getParent()
                    .getDefinition()
                    .getMethodClass(methodName)
                ;
                if (!parentClass) {
                    Subclass.Error.create(
                        'Trying to call parent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '" which hasn\'t parent'
                    );
                }
                if (methodFunc == parentClass.getDefinition().getData()[methodName]) {
                    parentClass = parentClass.getParent();
                }
                var args = [];

                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return parentClass
                    .getDefinition()
                    .getData()[methodName]
                    .apply(this, args)
                ;
            },

            /**
             * Returns copy of current class instance
             *
             * @returns {Object}
             */
            getCopy: function()
            {
                var copyInst = new this.constructor();
                var props = Object.getOwnPropertyNames(this);

                for (var i = 0; i < props.length; i++) {
                    copyInst[props[i]] = this[props[i]];
                }
                return copyInst;
            }
        };
    };

    /**
     * Returns base class definition data
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getBaseData = function()
    {
        var data = this.createBaseData();

        // Because many class types redefine methods #createBaseData without
        // calling its parent realisation some required properties can lose.
        // To avoid it, the required properties were placed here.

        /**
         * Class name
         *
         * @type {string}
         */
        data.$_className = null;

        /**
         * Class type
         *
         * @type {string}
         */
        data.$_classType = null;

        /**
         * Class definition closure
         *
         * @type {Subclass.Class.ClassType}
         */
        data.$_class = null;


        // Triggering event handlers

        this.getEvent("onGetBaseData").trigger(data);

        return data;
    };

    /**
     * Normalizes definition data
     */
    ClassDefinition.prototype.normalizeData = function()
    {
        // Do some manipulations with class definition data

        this.getEvent('onNormalizeData').trigger(this.getData());
    };

    /**
     * Validates class definition
     *
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateData = function ()
    {
        // Do some validation manipulations with class definition data

        this.getEvent('onValidateData').trigger(this.getData());

        return true;
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassDefinition.prototype.processData = function()
    {
        var definition = this.getData();

        for (var attrName in definition) {
            if (
                !definition.hasOwnProperty(attrName)
                || !attrName.match(/^\$_/i)
            ) {
                continue;
            }
            var setterMethod = "set" + attrName.substr(2)[0].toUpperCase() + attrName.substr(3);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        this.getEvent('onProcessData').trigger(definition);
    };

    /**
     * Searches for the names of classes which are needed to be loaded
     */
    ClassDefinition.prototype.processRelatedClasses = function()
    {
        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        var requires = this.getRequires();
        var parentClass = this.getExtends();

        // Performing $_requires option

        if (requires && this.validateRequires(requires)) {
            if (Subclass.Tools.isPlainObject(requires)) {
                for (var alias in requires) {
                    if (requires.hasOwnProperty(alias)) {
                        classManager.load(requires[alias]);
                    }
                }
            } else if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    classManager.load(requires[i]);
                }
            }
        }

        // Performing $_extends option

        if (parentClass && this.validateExtends(parentClass)) {
            classManager.load(parentClass);
        }

        this.getEvent('onProcessRelatedClasses').trigger();
    };

    return ClassDefinition;

})();