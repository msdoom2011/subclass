/**
 * @class
 * @extends {Subclass.Class.Type.Class.ClassDefinition}
 */
Subclass.Class.Type.AbstractClass.AbstractClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function AbstractClassDefinition(classInst, classDefinition)
    {
        AbstractClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    AbstractClassDefinition.$parent = Subclass.Class.Type.Class.ClassDefinition;

    AbstractClassDefinition.prototype = {

        /**
         * @inheritDoc
         */
        validateFinal: function(isFinal)
        {
            Subclass.Error.create(
                'Abstract class definition cannot contain $_final option ' +
                'and consequently can\'t be final.'
            )
        },

        /**
         * Validates "$_abstract" attribute value
         *
         * @param {*} value
         * @returns {boolean}
         * @throws {Error}
         */
        validateAbstract: function(value)
        {
            try {
                if (value !== null && !Subclass.Tools.isPlainObject(value)) {
                    throw 'error';
                }
                if (value) {
                    for (var methodName in value) {
                        if (!value.hasOwnProperty(methodName)) {
                            continue;
                        }
                        if (typeof value[methodName] != 'function') {
                            throw 'error';
                        }
                    }
                }
            } catch (e) {
                if (e == 'error') {
                    Subclass.Error.create('InvalidClassOption')
                        .option('$_abstract')
                        .className(this.getClass().getName())
                        .expected('a plain object with methods or a null')
                        .received(value)
                        .apply()
                    ;
                } else {
                    throw e;
                }
            }
            return true;
        },

        /**
         * Sets "$_abstract" attribute value
         *
         * @param {Object} value
         *      The plain object with different properties and methods
         */
        setAbstract: function(value)
        {
            this.validateAbstract(value);
            this.getData().$_abstract = value || {};

            if (value) {
                this.getClass().addAbstractMethods(value);
            }
        },

        /**
         * Returns "$_abstract" attribute value
         *
         * @returns {Object}
         */
        getAbstract: function()
        {
            return this.getData().$_abstract;
        },

        /**
         * @inheritDoc
         */
        createBaseData: function ()
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
                 * Object that contains abstract methods
                 *
                 * @type {Object}
                 */
                $_abstract: {}
            }
        }
    };

    return AbstractClassDefinition;

})();