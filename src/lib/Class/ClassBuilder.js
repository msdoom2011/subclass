/**
 * @class
 */
Subclass.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        /**
         * @type {Subclass.Class.ClassManager}
         */
        this._classManager = classManager;

        /**
         * @type {(ClassType|null)}
         * @private
         */
        this._class = null;

        /**
         * @type {string}
         * @private
         */
        this._type = classType;

        /**
         * @type {string}
         * @private
         */
        this._name = null;

        /**
         * @type {Object}
         * @private
         */
        this._definition = {};


        // Initializing

        if (classManager.issetClass(className)) {
            this._setClass(className);

        } else {
            this._name = className;
        }
    }

    ClassBuilder.$parent = null;

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ClassBuilder.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Sets class instance that will altered
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassBuilder}
     * @private
     */
    ClassBuilder.prototype._setClass = function(className)
    {
        var classInst = this.getClassManager().getClass(className);
        var classDefinition = classInst.getDefinition().getData();

        if (classInst.wasInstanceCreated()) {
            throw new Error(
                'Can\'t alter class "' + className + '" because ' +
                'the one or more it instances was already created.'
            );
        }

        this.setName(classInst.getName());
        this.setType(classInst.constructor.getClassTypeName());
        this._class = classInst;

        this._setDefinition(Subclass.Tools.copy(classDefinition));

        return this;
    };

    /**
     * Sets definition of class
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassBuilder}
     * @private
     */
    ClassBuilder.prototype._setDefinition = function(classDefinition)
    {
        if (!classDefinition || !Subclass.Tools.isPlainObject(classDefinition)) {
            Subclass.Exception.InvalidArgument(
                "classDefinition",
                classDefinition,
                "a plain object"
            );
        }
        this._definition = classDefinition;

        return this;
    };

    /**
     * Returns class definition
     *
     * @returns {Object}
     * @private
     */
    ClassBuilder.prototype._getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Sets class type
     *
     * @param {string} classType
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setType = function(classType)
    {
        if (typeof classType !== 'string') {
            Subclass.Exception.InvalidArgument(
                "classType",
                classType,
                "a string"
            );
        }
        if (this._class) {
            throw new Error('Can\'t redefine class type of already registered class.');
        }
        this._type = classType;

        return this;
    };

    /**
     * Returns class type
     *
     * @returns {string}
     */
    ClassBuilder.prototype.getType = function()
    {
        return this._type;
    };

    /**
     * Sets name of class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setName = function(className)
    {
        if (this._class) {
            throw new Error('Can\'t redefine class name of already registered class.');
        }
        this._name = className;

        return this;
    };

    /**
     * Returns name of class
     *
     * @returns {string}
     */
    ClassBuilder.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets parent of class
     *
     * @param {string} parentClassName
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setParent = function(parentClassName)
    {
        this._getDefinition().$_extends = parentClassName;

        return this;
    };

    /**
     * Returns parent of class
     *
     * @returns {ClassType}
     */
    ClassBuilder.prototype.getParent = function()
    {
        return this._getDefinition().$_extends || null;
    };

    /**
     * Validates class properties definition
     *
     * @param classProperties
     * @private
     */
    ClassBuilder.prototype._validateProperties = function(classProperties)
    {
        if (!classProperties || !Subclass.Tools.isPlainObject(classProperties)) {
            Subclass.Exception.InvalidArgument(
                "classProperties",
                classProperties,
                "a plain object"
            );
        }
    };

    /**
     * Sets typed properties of class
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setProperties = function(classProperties)
    {
        this._validateProperties(classProperties);
        this._getDefinition().$_properties = classProperties;

        return this;
    };

    /**
     * Adds new class properties
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addProperties = function(classProperties)
    {
        this._validateProperties(classProperties);

        if (!this._getDefinition().$_properties) {
            this._getDefinition().$_properties = {};
        }
        Subclass.Tools.extend(
            this._getDefinition().$_properties,
            classProperties
        );

        return this;
    };

    /**
     * Returns typed properties of class
     *
     * @returns {Object.<Object>}
     */
    ClassBuilder.prototype.getProperties = function()
    {
        return this._getDefinition().$_properties || {};
    };

    /**
     * Removes typed class property
     *
     * @param {string} propertyName
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeProperty = function(propertyName)
    {
        if (typeof propertyName !== 'string') {
            Subclass.Exception.InvalidArgument(
                "propertyName",
                propertyName,
                "a string"
            );
        }
        delete this._getDefinition().$_properties[propertyName];

        return this;
    };

    /**
     * Sets static properties and methods of class
     *
     * @param {Object} staticProperties
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setStatic = function(staticProperties)
    {
        if (!staticProperties || !Subclass.Tools.isPlainObject(staticProperties)) {
            Subclass.Exception.InvalidArgument(
                "staticProperties",
                staticProperties,
                "a plain object"
            );
        }
        this._getDefinition().$_static = staticProperties;

        return this;
    };

    /**
     * Returns static properties and methods of class
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getStatic = function()
    {
        return this._getDefinition().$_static || {};
    };

    /**
     * Sets static property or method depending on value of staticPropertyValue argument
     *
     * @param {string} staticPropertyName
     * @param {*} staticPropertyValue
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setStaticProperty = function(staticPropertyName, staticPropertyValue)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Exception.InvalidArgument(
                "staticPropertyName",
                staticPropertyName,
                "a string"
            );
        }
        this._getDefinition().$_static[staticPropertyName] = staticPropertyValue;

        return this;
    };

    /**
     * Removes static property or method
     *
     * @param {string} staticPropertyName
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeStaticProperty = function(staticPropertyName)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Exception.InvalidArgument(
                "staticPropertyName",
                staticPropertyName,
                "a string"
            );
        }
        delete this._getDefinition().$_static[staticPropertyName];

        return this;
    };

    /**
     * Prepares class body
     *
     * @param {Object} classBody
     * @returns {*}
     * @private
     */
    ClassBuilder.prototype._prepareBody = function(classBody)
    {
        if (!classBody || typeof classBody != 'object') {
            Subclass.Exception.InvalidArgument(
                "classBody",
                classBody,
                "a plain object"
            );
        }
        for (var propName in classBody) {
            if (!classBody.hasOwnProperty(propName)) {
                continue;
            }
            if (propName.match(/^\$_/i)) {
                delete classBody[propName];
            }
        }
        return classBody;
    };

    /**
     * Adds new methods and properties to classBody
     *
     * @param {Object} classBody
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addToBody = function(classBody)
    {
        classBody = this._prepareBody(classBody);

        var classDefinition = this._getDefinition();
        Subclass.Tools.extend(classDefinition, classBody);

        return this;
    };

    /**
     * Sets class not typed properties and methods
     *
     * @param {Object} classBody
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setBody = function(classBody)
    {
        classBody = this._prepareBody(classBody);

        var classDefinition = this._getDefinition();

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
    };

    /**
     * Sets class constructor function
     *
     * @param {Function }constructorFunction
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setConstructor = function(constructorFunction)
    {
        this._getDefinition().$_constructor = constructorFunction;

        return this;
    };

    /**
     * Returns class constructor
     *
     * @returns {(Function|null)}
     */
    ClassBuilder.prototype.getConstructor = function()
    {
        return this._getDefinition().$_constructor || null;
    };

    /**
     * Removes class constructor
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeConstructor = function()
    {
        var classDefinition = this._getDefinition();

        delete classDefinition.$_constructor;

        return this;
    };

    /**
     * Validates current class definition
     *
     * @returns {Subclass.Class.ClassBuilder}
     * @private
     */
    ClassBuilder.prototype._validate = function()
    {
        if (!this.getName()) {
            throw new Error('Future class must be named.');
        }
        if (!this.getType()) {
            throw new Error('The type of the future class must be specified.');
        }
        return this;
    };

    /**
     * Saves class definition changes and registers class if it's needed
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassBuilder.prototype.save = function()
    {
        this._validate();

        if (this._class) {
            this._class.setDefinition(this._getDefinition());
            return this._class;
        }
        return this.getClassManager().addClass(
            this.getType(),
            this.getName(),
            this._getDefinition()
        );
    };

    return ClassBuilder;

})();
