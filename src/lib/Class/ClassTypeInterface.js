/**
 * @interface
 */
Subclass.Class.ClassTypeInterface = (function()
{
    function ClassTypeInterface () {}

    /**
     * Returns name of class type
     *
     * @example Example:
     *      Subclass.Class.Trait.Trait.getClassTypeName(); // returns "Trait"
     *
     * @returns {string}
     */
    ClassTypeInterface.getClassTypeName = function() {};

    /**
     * Returns class builder constructor for specific class of current class type.
     *
     * @example Example:
     *      Subclass.Class.AbstractClass.AbstractClass.getClassBuilderClass();
     *      // returns Subclass.Class.AbstractClass.AbstractClassBuilder class constructor
     *
     * @returns {Function}
     */
    ClassTypeInterface.getClassBuilderClass = function() {};

    /**
     * Returns constructor for creating class definition instance
     *
     * @example Example:
     *      Subclass.Class.Class.Class.getClassDefinitionClass();
     *      // returns Subclass.Class.Class.ClassDefinition class constructor
     *
     * @returns {Function}
     */
    ClassTypeInterface.getClassDefinitionClass = function() {};

    /**
     * Initializes class on creation stage.
     * Current method invokes automatically right at the end of the class type constructor.
     * It can contain different manipulations with class definition or other manipulations that is needed
     */
    ClassTypeInterface.prototype.initialize = function() {};

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.Class.ClassManager}
     */
    ClassTypeInterface.prototype.getClassManager = function() {};

    /**
     * Returns name of the current class instance
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
     * @returns {Subclass.Class.ClassDefinition}
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
     * @return {(Subclass.Class.ClassTypeInterface|null)}
     */
    ClassTypeInterface.prototype.getClassParent = function() {};

    /**
     * Checks whether current class extends another one
     *
     * @returns {boolean}
     */
    ClassTypeInterface.prototype.hasClassParent = function() {};

    /**
     * Returns all typed properties in current class instance
     *
     * @param {boolean} withInherited
     * @returns {Object.<Subclass.Property.PropertyTypeInterface>}
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
     * @returns {Subclass.Property.PropertyTypeInterface}
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