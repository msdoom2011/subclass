/**
 * @class
 */
Subclass.Class.ClassTypeBuilder = (function()
{
    function ClassTypeBuilder(classManager, classType, className)
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

    ClassTypeBuilder.$parent = null;

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ClassTypeBuilder.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Sets class instance that will altered
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeBuilder}
     * @private
     */
    ClassTypeBuilder.prototype._setClass = function(className)
    {
        var classInst = this.getClassManager().getClass(className);
        var classDefinition = classInst.getDefinition().getData();

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
     * @returns {Subclass.Class.ClassTypeBuilder}
     * @private
     */
    ClassTypeBuilder.prototype._setDefinition = function(classDefinition)
    {
        if (!classDefinition || !Subclass.Tools.isPlainObject(classDefinition)) {
            throw new Error(
                'Invalid argument "classDefinition" in method "_setDefinition" in ClassTypeBuilder. ' +
                'It must be a plain object.'
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
    ClassTypeBuilder.prototype._getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Sets class type
     *
     * @param {string} classType
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setType = function(classType)
    {
        if (typeof classType !== 'string') {
            throw new Error('Invalid argument "classType" in method "setType" in ClassTypeBuilder. ' +
                'It must be a string.');
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
    ClassTypeBuilder.prototype.getType = function()
    {
        return this._type;
    };

    /**
     * Sets name of class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setName = function(className)
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
    ClassTypeBuilder.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets parent of class
     *
     * @param {string} parentClassName
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setParent = function(parentClassName)
    {
        this._getDefinition().$_extends = parentClassName;

        return this;
    };

    /**
     * Returns parent of class
     *
     * @returns {ClassType}
     */
    ClassTypeBuilder.prototype.getParent = function()
    {
        return this._getDefinition().$_extends || null;
    };

    /**
     * Validates class properties definition
     *
     * @param classProperties
     * @private
     */
    ClassTypeBuilder.prototype._validateProperties = function(classProperties)
    {
        if (!classProperties || !Subclass.Tools.isPlainObject(classProperties)) {
            throw new Error('Invalid argument "classProperties" in method "_validateProperties" in ClassTypeBuilder. ' +
            'It must be a plain object.');
        }
    };

    /**
     * Sets typed properties of class
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setProperties = function(classProperties)
    {
        this._validateProperties(classProperties);
        this._getDefinition().$_properties = classProperties;

        return this;
    };

    /**
     * Adds new class properties
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.addProperties = function(classProperties)
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
    ClassTypeBuilder.prototype.getProperties = function()
    {
        return this._getDefinition().$_properties || {};
    };

    /**
     * Removes typed class property
     *
     * @param {string} propertyName
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.removeProperty = function(propertyName)
    {
        if (typeof propertyName !== 'string') {
            throw new Error('Invalid argument "propertyName" in method "removeProperty" in ClassTypeBuilder. ' +
                'It must be a string.');
        }
        delete this._getDefinition().$_properties[propertyName];

        return this;
    };

    /**
     * Sets static properties and methods of class
     *
     * @param {Object} staticProperties
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setStatic = function(staticProperties)
    {
        if (!staticProperties || !Subclass.Tools.isPlainObject(staticProperties)) {
            throw new Error('Invalid argument "staticProperties" in method "setStatic" in ClassTypeBuilder. ' +
                'It must be a plain object.');
        }
        this._getDefinition().$_static = staticProperties;

        return this;
    };

    /**
     * Returns static properties and methods of class
     *
     * @returns {Object}
     */
    ClassTypeBuilder.prototype.getStatic = function()
    {
        return this._getDefinition().$_static || {};
    };

    /**
     * Sets static property or method depending on value of staticPropertyValue argument
     *
     * @param {string} staticPropertyName
     * @param {*} staticPropertyValue
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setStaticProperty = function(staticPropertyName, staticPropertyValue)
    {
        if (typeof staticPropertyName !== 'string') {
            throw new Error('Invalid argument "staticPropertyName" in method "setStaticProperty" in ClassTypeBuilder. ' +
                'It must be a string.');
        }
        this._getDefinition().$_static[staticPropertyName] = staticPropertyValue;

        return this;
    };

    /**
     * Removes static property or method
     *
     * @param {string} staticPropertyName
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.removeStaticProperty = function(staticPropertyName)
    {
        if (typeof staticPropertyName !== 'string') {
            throw new Error('Invalid argument "staticPropertyName" in method "removeStaticProperty" in ClassTypeBuilder. ' +
            'It must be a string.');
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
    ClassTypeBuilder.prototype._prepareBody = function(classBody)
    {
        if (!classBody || typeof classBody != 'object') {
            throw new Error('Invalid argument "classBody" in method "setBody" in ClassTypeBuilder. ' +
            'It must be a plain object.');
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
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.addToBody = function(classBody)
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
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setBody = function(classBody)
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
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setConstructor = function(constructorFunction)
    {
        this._getDefinition().$_constructor = constructorFunction;

        return this;
    };

    /**
     * Returns class constructor
     *
     * @returns {(Function|null)}
     */
    ClassTypeBuilder.prototype.getConstructor = function()
    {
        return this._getDefinition().$_constructor || null;
    };

    /**
     * Removes class constructor
     *
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.removeConstructor = function()
    {
        var classDefinition = this._getDefinition();

        delete classDefinition.$_constructor;

        return this;
    };

    /**
     * Validates current class definition
     *
     * @returns {Subclass.Class.ClassTypeBuilder}
     * @private
     */
    ClassTypeBuilder.prototype._validate = function()
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
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ClassTypeBuilder.prototype.save = function()
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

    return ClassTypeBuilder;

})();
