/**
 * @class
 * @constructor
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.AbstractClass.AbstractClassBuilder = (function()
{
    function AbstractClassBuilder(classManager, classType, className)
    {
        AbstractClassBuilder.$parent.call(this, classManager, classType, className);
    }

    AbstractClassBuilder.$parent = Subclass.Class.Type.Class.ClassBuilder;

    AbstractClassBuilder.prototype = {

        setFinal: undefined,

        getFinal: undefined,

        /**
         * Validates abstract methods argument
         *
         * @param {Object.<Function>} abstractMethods
         * @private
         */
        _validateAbstractMethods: function(abstractMethods)
        {
            if (!Subclass.Tools.isPlainObject(abstractMethods)) {
                Subclass.Error.create('InvalidArgument')
                    .argument("the list of abstract methods", false)
                    .received(abstractMethods)
                    .expected("a plain object with functions")
                    .apply()
                ;
            }
            for (var methodName in abstractMethods) {
                if (abstractMethods.hasOwnProperty(methodName)) {
                    this._validateAbstractMethod(abstractMethods[methodName]);
                }
            }
        },

        /**
         * Validates abstract method
         *
         * @param abstractMethod
         * @private
         */
        _validateAbstractMethod: function(abstractMethod)
        {
            if (typeof abstractMethod != 'function') {
                Subclass.Error.create('InvalidArgument')
                    .argument('the name of abstract method', false)
                    .received(abstractMethod)
                    .expected('a function')
                    .apply()
                ;
            }
        },

        /**
         * Sets abstract methods
         *
         * @param {Object.<Function>} abstractMethods
         * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
         */
        setAbstractMethods: function(abstractMethods)
        {
            this._validateAbstractMethods(abstractMethods);
            this.getDefinition().$_abstract = abstractMethods;

            return this;
        },

        /**
         * Adds new abstract methods
         *
         * @param {Object.<Function>} abstractMethods
         * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
         */
        addAbstractMethods: function(abstractMethods)
        {
            this._validateAbstractMethods(abstractMethods);

            if (!this.getDefinition().$_abstract) {
                this.getDefinition().$_abstract = {};
            }
            Subclass.Tools.extend(
                this.getDefinition().$_abstract,
                abstractMethods
            );

            return this;
        },

        /**
         * Adds new abstract method
         *
         * @param {string} methodName
         * @param {Function} methodFunction
         * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
         */
        addAbstractMethod: function(methodName, methodFunction)
        {
            this._validateAbstractMethod(methodFunction);

            if (!methodName || typeof methodName != 'string') {
                Subclass.Error.create('InvalidArgument')
                    .argument('the name of abstract method', false)
                    .received(methodName)
                    .expected('a string')
                    .apply()
                ;
            }
            if (!this.getDefinition().$_abstract) {
                this.getDefinition().$_abstract = {};
            }
            this.getDefinition().$_abstract[methodName] = methodFunction;

            return this;
        },

        /**
         * Returns abstract methods
         *
         * @returns {Object.<Function>}
         */
        getAbstractMethods: function()
        {
            return this.getDefinition().$_abstract || {};
        },

        /**
         * Removes abstract method with specified method name
         *
         * @param {string} abstractMethodName
         * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
         */
        removeAbstractMethod: function(abstractMethodName)
        {
            var abstractMethods = this.getAbstractMethods();

            delete abstractMethods[abstractMethodName];

            return this;
        }
    };

    return AbstractClassBuilder;
})();