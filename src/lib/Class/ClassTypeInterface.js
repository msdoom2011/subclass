/**
 * @interface
 */
Subclass.ClassManager.ClassTypes.ClassTypeInterface = (function()
{
    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @constructor
     */
    function ClassTypeInterface (classManager, className, classDefinition) {}

    /**
     * Returns name of class type
     *
     * @returns {string}
     */
    ClassTypeInterface.getClassTypeName = function() {};

    /**
     * Returns class builder constructor of current class type.
     */
    ClassTypeInterface.getClassBuilderClass = function() {};

    /**
     * Returns class for creating class definition instance
     *
     * @returns {Function}
     */
    ClassTypeInterface.getClassDefinitionClass = function() {};

    /**
     * Initializes class on creation stage
     */
    ClassTypeInterface.prototype.initialize = function() {};

    /**
     * Returns class manager instance
     *
     * @returns {ClassManager}
     */
    ClassTypeInterface.prototype.getClassManager = function() {};

    /**
     * Returns name of current class instance
     *
     * @returns {string}
     */
    ClassTypeInterface.prototype.getClassName = function() {};

    /**
     * Sets class definition
     *
     * @param {Object} classDefinition
     */
    ClassTypeInterface.prototype.setClassDefinition = function(classDefinition) {};

    /**
     * Returns class definition object
     *
     * @returns {Subclass.ClassManager.ClassTypes.ClassDefinition}
     */
    ClassTypeInterface.prototype.getClassDefinition = function() {};

    /**
     * Sets class parent
     *
     * @param {string} parentClassName
     */
    ClassTypeInterface.prototype.setClassParent = function (parentClassName) {};

    /**
     * Returns parent class instance
     *
     * @return {(Subclass.ClassManager.ClassTypes.ClassTypeInterface|null)}
     */
    ClassTypeInterface.prototype.getClassParent = function() {};

    /**
     * Returns all typed properties in current class instance
     *
     * @param {boolean} withInherited
     * @returns {Object.<Subclass.PropertyManager.PropertyTypeInterface>}
     */
    ClassTypeInterface.prototype.getClassProperties = function(withInherited) {};

    /**
     * Adds new typed property to class
     *
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     */
    ClassTypeInterface.prototype.addClassProperty = function(propertyName, propertyDefinition) {};

    /**
     * Returns property instance by its name
     *
     * @param {string} propertyName
     * @returns {Subclass.PropertyManager.PropertyTypeInterface}
     * @throws {Error}
     */
    ClassTypeInterface.prototype.getClassProperty = function(propertyName) {};

    /**
     * Checks if property with specified property name exists
     *
     * @param {string} propertyName
     * @returns {boolean}
     */
    ClassTypeInterface.prototype.issetClassProperty = function(propertyName) {};

    /**
     * Returns constructor function for current class type
     *
     * @returns {function} Returns named function
     * @throws {Error}
     */
    ClassTypeInterface.prototype.getClassConstructorEmpty = function() {};

    /**
     * Returns class constructor
     *
     * @returns {Function}
     */
    ClassTypeInterface.prototype.getClassConstructor = function() {};

    /**
     * Creates and attaches class typed properties
     *
     * @param {Object} context Class constructor prototype
     */
    ClassTypeInterface.prototype.attachClassProperties = function(context) {};

    /**
     * Creates class instance of current class type
     *
     * @returns {object} Class instance
     */
    ClassTypeInterface.prototype.createInstance = function() {};

    /**
     * Checks if current class is instance of another class
     *
     * @param {string} className
     * @return {boolean}
     */
    ClassTypeInterface.prototype.isInstanceOf = function(className) {};


    return ClassTypeInterface;

})();