Subclass.Tools.CheckTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Builds the class constructor. It setups the inheritance of class constructor.<br /><br />
         *
         * You can specify two properties directly in constructor function:<br />
         * - $parent - constructor of parent class;<br />
         * - $mixins - array of constructors which method and properties will be added to current constructor.
         *
         * @param {Function} constructor
         *      The class constructor function
         *
         * @returns {Function}
         */
        buildClassConstructor: function(constructor)
        {
            var constructorProto;

            if (constructor.$parent) {
                var parentConstructor = this.buildClassConstructor(constructor.$parent);
                constructorProto = Object.create(parentConstructor.prototype);

                if (constructor.$mixins) {
                    for (var i = 0; i < constructor.$mixins.length; i++) {
                        Subclass.Tools.extend(
                            constructorProto,
                            constructor.$mixins[i]
                        );
                    }
                }
                constructorProto = Subclass.Tools.extend(
                    constructorProto,
                    constructor.prototype
                );
                constructor.prototype = constructorProto;

                Object.defineProperty(constructor.prototype, "constructor", {
                    enumerable: false,
                    configurable: true,
                    value: constructor
                });

            } else if (constructor.$mixins) {
                for (var j = 0; j < constructor.$mixins.length; j++) {
                    constructorProto = Subclass.Tools.extend({}, constructor.$mixins[i]);
                }
                constructor.prototype = Subclass.Tools.extend(
                    constructorProto,
                    constructor.prototype
                );
            }
            return constructor;
        },

        /**
         * Builds constructor and creates the instance of specified constructor after it was built
         *
         * @param {Function} constructor
         * @param [arguments]
         */
        createClassInstance: function(constructor)
        {
            function getPropertiesFromMixins(constructor)
            {
                var properties = {};

                if (constructor.$parent) {
                    Subclass.Tools.extend(
                        properties,
                        getPropertiesFromMixins(constructor.$parent)
                    );
                }
                if (constructor.$mixins) {
                    for (var i = 0; i < constructor.$mixins.length; i++) {
                        var mixinProperties = constructor.$mixins[i]();
                        Subclass.Tools.extend(properties, mixinProperties);
                    }
                }
                return properties;
            }

            var properties = getPropertiesFromMixins(constructor);
            var instance = new (constructor.bind.apply(constructor, arguments))();
            var instanceProperties = {};

            for (var propName in instance) {
                if (instance.hasOwnProperty(propName)) {
                    instanceProperties[propName] = instance[propName];
                }
            }
            Subclass.Tools.extend(instanceProperties, properties);
            Subclass.Tools.extend(instance, instanceProperties);

            return instance;
        }
    });

    return Subclass.Tools;

})();