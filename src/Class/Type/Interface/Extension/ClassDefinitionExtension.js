/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Interface.Extension.ClassDefinitionExtension = function() {

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
             * Array of interfaces names
             *
             * @type {string[]}
             */
            data.$_implements = [];

            /**
             * Checks if current class implements specified interface
             *
             * @param {string} interfaceName
             * @returns {boolean}
             */
            data.isImplements = function (interfaceName)
            {
                return this.$_class.isImplements(interfaceName);
            };
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var interfaces = this.getImplements();

            if (interfaces && this.validateImplements(interfaces)) {
                for (var i = 0; i < interfaces.length; i++) {
                    classManager.loadClass(interfaces[i]);
                }
            }
        });
    };

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * Validates "$_implements" attribute value
     *
     * @param {*} interfaces
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateImplements = function(interfaces)
    {
        try {
            if (interfaces && !Array.isArray(interfaces)) {
                throw 'error';
            }
            if (interfaces) {
                for (var i = 0; i < interfaces.length; i++) {
                    if (typeof interfaces[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_implements')
                    .className(this.getClass().getName())
                    .received(interfaces)
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
     * Sets "$_implements" attribute value
     *
     * @param {string[]} interfaces
     *
     *      List of the interfaces witch current one will implement.
     *
     *      Example: [
     *         "Namespace/Of/Interface1",
     *         "Namespace/Of/Interface2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setImplements = function(interfaces)
    {
        this.validateImplements(interfaces);
        this.getData().$_implements = interfaces || [];

        if (interfaces) {
            this.getClass().addInterfaces(interfaces);
        }
    };

    /**
     * Return "$_implements" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getImplements = function()
    {
        return this.getData().$_implements;
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