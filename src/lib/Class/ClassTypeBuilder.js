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
        this._classType = classType;

        /**
         * @type {string}
         * @private
         */
        this._className = null;

        /**
         * @type {Object}
         * @private
         */
        this._classDefinition = {};


        // Initializing

        if (classManager.issetClass(className)) {
            this._setClass(className);

        } else {
            this._className = className;
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

        this.setClassName(classInst.getName());
        this.setClassType(classInst.constructor.getClassTypeName());
        this._class = classInst;

        this._setClassDefinition(Subclass.Tools.copy(classDefinition));

        return this;
    };

    /**
     * Sets definition of class
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassTypeBuilder}
     * @private
     */
    ClassTypeBuilder.prototype._setClassDefinition = function(classDefinition)
    {
        if (!classDefinition || !Subclass.Tools.isPlainObject(classDefinition)) {
            throw new Error(
                'Invalid argument "classDefinition" in method "_setClassDefinition" in ClassTypeBuilder. ' +
                'It must be a plain object.'
            );
        }
        this._classDefinition = classDefinition;

        return this;
    };

    /**
     * Returns class definition
     *
     * @returns {Object}
     * @private
     */
    ClassTypeBuilder.prototype._getClassDefinition = function()
    {
        return this._classDefinition;
    };

    /**
     * Sets class type
     *
     * @param {string} classType
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setClassType = function(classType)
    {
        if (typeof classType !== 'string') {
            throw new Error('Invalid argument "classType" in method "setClassType" in ClassTypeBuilder. ' +
                'It must be a string.');
        }
        if (this._class) {
            throw new Error('Can\'t redefine class type of already registered class.');
        }
        this._classType = classType;

        return this;
    };

    /**
     * Returns class type
     *
     * @returns {string}
     */
    ClassTypeBuilder.prototype.getClassType = function()
    {
        return this._classType;
    };

    /**
     * Sets name of class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setClassName = function(className)
    {
        if (this._class) {
            throw new Error('Can\'t redefine class name of already registered class.');
        }
        this._className = className;

        return this;
    };

    /**
     * Returns name of class
     *
     * @returns {string}
     */
    ClassTypeBuilder.prototype.getClassName = function()
    {
        return this._className;
    };

    /**
     * Sets parent of class
     *
     * @param {string} parentClassName
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setClassParent = function(parentClassName)
    {
        this._getClassDefinition().$_extends = parentClassName;

        return this;
    };

    /**
     * Returns parent of class
     *
     * @returns {ClassType}
     */
    ClassTypeBuilder.prototype.getClassParent = function()
    {
        return this._getClassDefinition().$_extends || null;
    };

    ClassTypeBuilder.prototype._validateClassProperties = function(classProperties)
    {
        if (!classProperties || !Subclass.Tools.isPlainObject(classProperties)) {
            throw new Error('Invalid argument "classProperties" in method "setClassProperties" in ClassTypeBuilder. ' +
            'It must be a plain object.');
        }
    };

    /**
     * Sets typed properties of class
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setClassProperties = function(classProperties)
    {
        this._validateClassProperties(classProperties);
        this._getClassDefinition().$_properties = classProperties;

        return this;
    };

    /**
     * Adds new class properties
     *
     * @param {Object.<Object>} classProperties
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.addClassProperties = function(classProperties)
    {
        this._validateClassProperties(classProperties);

        if (!this._getClassDefinition().$_properties) {
            this._getClassDefinition().$_properties = {};
        }
        Subclass.Tools.extend(
            this._getClassDefinition().$_properties,
            classProperties
        );

        return this;
    };

    /**
     * Returns typed properties of class
     *
     * @returns {Object.<Object>}
     */
    ClassTypeBuilder.prototype.getClassProperties = function()
    {
        return this._getClassDefinition().$_properties || {};
    };

    /**
     * Removes typed class property
     *
     * @param {string} propertyName
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.removeClassProperty = function(propertyName)
    {
        if (typeof propertyName !== 'string') {
            throw new Error('Invalid argument "propertyName" in method "removeClassProperty" in ClassTypeBuilder. ' +
                'It must be a string.');
        }
        delete this._getClassDefinition().$_properties[propertyName];

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
        this._getClassDefinition().$_static = staticProperties;

        return this;
    };

    /**
     * Returns static properties and methods of class
     *
     * @returns {Object}
     */
    ClassTypeBuilder.prototype.getStatic = function()
    {
        return this._getClassDefinition().$_static || {};
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
        this._getClassDefinition().$_static[staticPropertyName] = staticPropertyValue;

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
        delete this._getClassDefinition().$_static[staticPropertyName];

        return this;
    };

    /**
     * Prepares class body
     *
     * @param {Object} classBody
     * @returns {*}
     * @private
     */
    ClassTypeBuilder.prototype._prepareClassBody = function(classBody)
    {
        if (!classBody || typeof classBody != 'object') {
            throw new Error('Invalid argument "classBody" in method "setClassBody" in ClassTypeBuilder. ' +
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
    ClassTypeBuilder.prototype.addClassBody = function(classBody)
    {
        classBody = this._prepareClassBody(classBody);

        var classDefinition = this._getClassDefinition();
        Subclass.Tools.extend(classDefinition, classBody);

        return this;
    };

    /**
     * Sets class not typed properties and methods
     *
     * @param {Object} classBody
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.setClassBody = function(classBody)
    {
        classBody = this._prepareClassBody(classBody);

        var classDefinition = this._getClassDefinition();

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
    ClassTypeBuilder.prototype.setClassConstructor = function(constructorFunction)
    {
        this._getClassDefinition().$_constructor = constructorFunction;

        return this;
    };

    /**
     * Returns class constructor
     *
     * @returns {(Function|null)}
     */
    ClassTypeBuilder.prototype.getClassConstructor = function()
    {
        return this._getClassDefinition().$_constructor || null;
    };

    /**
     * Removes class constructor
     *
     * @returns {Subclass.Class.ClassTypeBuilder}
     */
    ClassTypeBuilder.prototype.removeClassConstructor = function()
    {
        var classDefinition = this._getClassDefinition();

        delete classDefinition.$_constructor;

        return this;
    };

    /**
     * Validates current class definition
     *
     * @returns {Subclass.Class.ClassTypeBuilder}
     * @private
     */
    ClassTypeBuilder.prototype._validateClass = function()
    {
        if (!this.getClassName()) {
            throw new Error('Future class must be named.');
        }
        if (!this.getClassType()) {
            throw new Error('The type of the future class must be specified.');
        }
        return this;
    };

    /**
     * Saves class definition changes and registers class if it's needed
     *
     * @returns {ClassType}
     */
    ClassTypeBuilder.prototype.saveClass = function()
    {
        this._validateClass();

        if (this._class) {
            this._class.setDefinition(this._getClassDefinition());
            return this._class;
        }
        return this.getClassManager().addClass(
            this.getClassType(),
            this.getClassName(),
            this._getClassDefinition()
        );
    };

    return ClassTypeBuilder;

})();
