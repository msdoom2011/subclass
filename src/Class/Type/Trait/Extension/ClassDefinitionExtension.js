/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Class.ClassExtension;

    ClassDefinitionExtension.$config = {
        classes: ["Class"]
    };

    ClassDefinitionExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getClass().getType()) < 0) {
            return false;
        }
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

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
                    classManager.load(traits[i]);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;

    Subclass.Tools.extend(ClassDefinition.prototype, {

        /**
         * Validates "$_traits" attribute value
         *
         * @param {*} traits
         * @returns {boolean}
         * @throws {Error}
         */
        validateTraits: function(traits)
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
        },

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
        setTraits: function(traits)
        {
            this.validateTraits(traits);
            this.getData().$_traits = traits || [];

            if (traits) {
                this.getClass().addTraits(traits);
            }
        },

        /**
         * Return "$_traits" attribute value
         *
         * @returns {string[]}
         */
        getTraits: function()
        {
            return this.getData().$_traits;
        }
    });


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();