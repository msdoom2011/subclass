/**
 * @class
 * @extends {Subclass.ClassManager.ClassTypes.ClassDefinition}
 */
Subclass.ClassManager.ClassTypes.ClassType.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.ClassManager.ClassTypes.ClassDefinition;

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getBaseDefinition = function ()
    {
        var classDefinition = ClassDefinition.$parent.prototype.getBaseDefinition();

        if (Subclass.ClassManager.issetClassType('Trait')) {

            /**
             * Array of traits names
             *
             * @type {string[]}
             */
            classDefinition.$_traits = [];

            /**
             * Checks if current class instance has specified trait
             *
             * @param {string} traitName
             * @returns {boolean}
             */
            classDefinition.hasTrait = function (traitName)
            {
                return this.$_class.hasTrait(traitName);
            };
        }

        if (Subclass.ClassManager.issetClassType('Interface')) {

            /**
             * Array of interfaces names
             *
             * @type {string[]}
             */
            classDefinition.$_implements = [];

            /**
             * Checks if current class implements specified interface
             *
             * @param {string} interfaceName
             * @returns {boolean}
             */
            classDefinition.isImplements = function (interfaceName)
            {
                return this.$_class.isImplements(interfaceName);
            };
        }
        return classDefinition;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.processDefinition = function ()
    {
        var classDefinition = this.getDefinition();

        // Parsing traits

        if (Subclass.ClassManager.issetClassType('Trait')) {
            for (var i = 0; i < classDefinition.$_traits.length; i++) {
                this.addTrait(classDefinition.$_traits[i]);
            }
        }

        // Parsing interfaces

        if (Subclass.ClassManager.issetClassType('Interface')) {
            for (i = 0; i < classDefinition.$_implements.length; i++) {
                this.addInterface(classDefinition.$_implements[i]);
            }
        }

        ClassDefinition.$parent.prototype.processClassDefinition.call(this);
    };

    return ClassDefinition;
})();