/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Extension;

    ClassDefinitionExtension.initialize = function(classInst)
    {
        this.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * Array of traits names
             *
             * @type {string[]}
             */
            data.$_traits = [];

            /**
             * Checks if current class instance has specified trait
             *
             * @param {string} traitName
             * @returns {boolean}
             */
            data.hasTrait = function (traitName)
            {
                return this.$_class.hasTrait(traitName);
            };
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var traits = this.getTraits();

            if (traits && this.validateTraits(traits)) {
                for (var i = 0; i < traits.length; i++) {
                    classManager.loadClass(traits[i]);
                }
            }
        });
    };

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} traits
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateTraits = function(traits)
    {
        try {
            if (traits && !Array.isArray(traits)) {
                throw 'error';
            }
            if (traits) {
                for (var i = 0; i < traits.length; i++) {
                    if (typeof traits[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_traits')
                    .className(this.getClass().getName())
                    .received(traits)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_traits" attribute value
     *
     * @param {string[]} traits
     *
     *      List of the classes which properties and method current one will contain.
     *
     *      Example: [
     *         "Namespace/Of/Trait1",
     *         "Namespace/Of/Trait2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setTraits = function(traits)
    {
        this.validateTraits(traits);
        this.getData().$_traits = traits || [];

        if (traits) {
            this.getClass().addTraits(traits);
        }
    };

    /**
     * Return "$_traits" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getTraits = function()
    {
        return this.getData().$_traits;
    };


    // Registering extension

    Subclass.Module.onInit(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();