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
            var constructorProto = {};

            if (constructor.$parent) {
                var parentConstructor = this.buildClassConstructor(constructor.$parent);
                constructorProto = Object.create(parentConstructor.prototype);

                if (constructor.$mixins) {
                    for (var i = 0; i < constructor.$mixins.length; i++) {
                        Subclass.Tools.extend(
                            constructorProto,
                            constructor.$mixins[i].prototype
                        );
                    }
                }
            } else if (constructor.$mixins) {
                for (var j = 0; j < constructor.$mixins.length; j++) {
                    Subclass.Tools.extend(constructorProto, constructor.$mixins[j].prototype);
                }
            }

            constructor.prototype = Subclass.Tools.extend(
                constructorProto,
                constructor.prototype
            );

            Object.defineProperty(constructor.prototype, "constructor", {
                enumerable: false,
                configurable: true,
                value: constructor
            });

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

            constructor = this.buildClassConstructor(constructor);
            var properties = getPropertiesFromMixins(constructor);
            var instance = new (constructor.bind.apply(constructor, arguments))();

            ===============================!!!!!!!!

            if (instance.getType) {
                console.log(instance.getName());
                console.log(instance instanceof Subclass.Class.ClassType);
                console.log('----------');
            }

            //var instanceProperties = {};

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName) && !instance.hasOwnProperty(propName)) {
                    instance[propName] = properties[propName];
                }
            }

            return instance;
        }
    });

    if (!Function.prototype.bind) {
        Object.defineProperty(Function.prototype, 'bind', {
            enumerable: false,
            configurable: true,
            value: function (oThis)
            {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function() {},
                    fBound = function() {
                        return fToBind.apply(this instanceof fNOP
                                ? this
                                : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();

                return fBound;
            }
        });
    }

    return Subclass.Tools;

})();