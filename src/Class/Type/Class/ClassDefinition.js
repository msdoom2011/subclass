/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Class.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.Class.ClassDefinition;

    ClassDefinition.prototype = {

        /**
         * Validates "$_final" option value
         *
         * @param {*} isFinal
         * @returns {boolean}
         * @throws {Error}
         */
        validateFinal: function(isFinal)
        {
            if (typeof isFinal != 'boolean') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_final')
                    .received(isFinal)
                    .className(this.getClass().getName())
                    .expected('a boolean')
                    .apply()
                ;
            }
            return true;
        },

        /**
         * Sets "$_final" option value
         *
         * @param {boolean} isFinal
         */
        setFinal: function(isFinal)
        {
            this.validateFinal(isFinal);
            this.getData().$_final = isFinal;
        },

        /**
         * Returns "$_final" option value
         *
         * @returns {boolean}
         */
        getFinal: function()
        {
            return this.getData().$_final;
        },

        /**
         * @alias {Subclass.Class.Type.Class.ClassDefinition.prototype#getFinal}
         *
         * @returns {boolean}
         */
        isFinal: function()
        {
            return this.getFinal();
        },

        /**
         * Validates "$_static" attribute value
         *
         * @param {*} value
         * @returns {boolean}
         * @throws {Error}
         */
        validateStatic: function(value)
        {
            if (value !== null && !Subclass.Tools.isPlainObject(value)) {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_static')
                    .className(this.getClass().getName())
                    .received(value)
                    .expected('a plain object or null')
                    .apply()
                ;
            }
            return true;
        },

        /**
         * Sets "$_static" attribute value
         *
         * @param {Object} value Plain object with different properties and methods
         */
        setStatic: function(value)
        {
            this.validateStatic(value);
            this.getData().$_static = value || {};

            if (value) {
                this.getClass().addStaticProperties(value);
            }
        },

        /**
         * Returns "$_static" attribute value
         *
         * @returns {Object}
         */
        getStatic: function()
        {
            return this.getData().$_static;
        },

        /**
         * @inheritDoc
         */
        createBaseData: function ()
        {
            var classDefinition = ClassDefinition.$parent.prototype.createBaseData();

            /**
             * Makes class final. It means that it can't be parent for any another class
             *
             * @type {boolean}
             */
            classDefinition.$_final = false;

            /**
             * Static properties and methods for current class constructor
             *
             * @type {Object}
             */
            classDefinition.$_static = {};

            return classDefinition;
        }
    };

    return ClassDefinition;
})();