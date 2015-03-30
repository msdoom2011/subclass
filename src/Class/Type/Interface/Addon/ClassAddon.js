/**
 * @namespace
 */
Subclass.Class.Type.Interface.Addon = {};

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Interface.Addon.ClassAddon = function() {

    function ClassAddon(classInst)
    {
        ClassAddon.$parent.apply(this, arguments);
    }

    Subclass.Class.ClassTypeAddon.addStaticMethods.call(this);

    ClassAddon.$parent = Subclass.Class.ClassTypeAddon;

    ClassAddon.initialize = function(classInst)
    {
        this.$parent.initialize.apply(this, arguments);

        // Defining interfaces storage

        classInst.getEvent('onCreate').addListener(function(evt)
        {
            /**
             * List of interfaces class names
             *
             * @type {Array<Subclass.Class.Interface.Interface>}
             * @private
             */
            this._interfaces = [];
        });

        // Added ability to return interfaces in class parents list

        classInst.getEvent('onGetClassParents').addListener(function(evt, classes, grouping)
        {
            var interfaces = this.getInterfaces(true);

            function addClassName(classes, className)
            {
                if (classes.indexOf(className) < 0) {
                    classes.push(className);
                }
            }

            for (var i = 0; i < interfaces.length; i++) {
                var classInst = interfaces[i];
                var className = classInst.getName();

                if (grouping) {
                    var classType = classInst.getType();

                    if (!classes.hasOwnProperty(classType)) {
                        classes[classType] = [];
                    }
                    addClassName(classes[classType], className);

                } else {
                    addClassName(classes, className);
                }
            }
        });

        // Added ability to check if current class is instance of class with specified name if it's interface

        classInst.getEvent('onIsInstanceOf').addListener(function(evt, className)
        {
            if (
                this.isImplements
                && this.isImplements(className)
            ) {
                evt.stopPropagation();
                return true;
            }
            return false;
        });
    };

    var Class = Subclass.Class.Type.Class.Class;

    /**
     * Adds interfaces
     *
     * @param {Object} interfaces
     */
    Class.prototype.addInterfaces = function(interfaces)
    {
        if (!interfaces || !Array.isArray(interfaces)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the traits list', false)
                .expected('an array')
                .received(interfaces)
                .apply()
            ;
        }
        for (var i = 0; i < interfaces.length; i++) {
            this.addInterface(interfaces[i]);
        }
    };

    /**
     * Returns interface names list
     *
     * @throws {Error}
     *
     * @param {boolean} [withInherited=false]
     *      Whether the inherited interfaces should be returned
     *
     * @returns {Array<Subclass.Class.Interface.Interface>}
     */
    Class.prototype.getInterfaces = function(withInherited)
    {
        //if (!Subclass.ClassManager.issetClassType('Interface')) {
        //    Subclass.Error.create('NotExistentMethod')
        //        .method('getInterfaces')
        //        .apply()
        //    ;
        //}
        //return this._interfaces;

        if (withInherited !== true) {
            return this._interfaces;
        }
        var classManager = this.getClassManager();
        var interfaces = Subclass.Tools.copy(this._interfaces);

        for (var i = 0; i < interfaces.length; i++) {
            var interfaceParents = interfaces[i].getClassParents();

            for (var j = 0; j < interfaceParents.length; j++) {
                interfaces.push(classManager.getClass(interfaceParents[j]));
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.getInterfaces) {
                interfaces = interfaces.concat(parent.getInterfaces(withInherited))
            }
        }
        return interfaces;
    };

    /**
     * Adds new interface
     *
     * @param {string} interfaceName
     * @throws {Error}
     */
    Class.prototype.addInterface = function (interfaceName)
    {
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        var interfaceClass = this.getClassManager().getClass(interfaceName);
        interfaceClass.addChildClass(this.getName());

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Can\'t implement no interface "' + interfaceName + '" ' +
                'in class "' + this.getName() + '".'
            );
        }

        var interfaceClassConstructor = interfaceClass.getConstructor();
        var interfaceClassConstructorProto = interfaceClassConstructor.prototype;
        //var interfaceClassProperties = interfaceClass.getClassDefinitionProperties();
        var abstractMethods = {};

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Trying add to "$_implements" option ' +
                'the new class "' + interfaceName + '" that is not an interface.'
            );
        }

        // Add interface properties

        //for (var propName in interfaceClassProperties) {
        //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
        //        continue;
        //    }
        //    this.addProperty(
        //        propName,
        //        interfaceClassProperties[propName]
        //    );
        //}

        // Add all interface prototype properties (with inherited)

        loop: for (var methodName in interfaceClassConstructorProto) {
            if (typeof interfaceClassConstructorProto[methodName] != 'function') {
                continue;
            }
            //for (propName in interfaceClassProperties) {
            //    if (!interfaceClassProperties.hasOwnProperty(propName)) {
            //        continue;
            //    }
            //    var setterName = Subclass.Tools.generateSetterName(propName);
            //    var getterName = Subclass.Tools.generateGetterName(propName);
            //
            //    if (methodName == setterName || methodName == getterName) {
            //        continue loop;
            //    }
            //}
            abstractMethods[methodName] = interfaceClassConstructorProto[methodName];
        }
        this.addAbstractMethods(abstractMethods);
        this.getInterfaces().push(interfaceClass);
        //this.getInterfaces().push(interfaceName);
    };

    /**
     * Checks if current class implements specified interface
     *
     * @param interfaceName
     * @returns {*}
     * @throws {Error}
     */
    Class.prototype.isImplements = function (interfaceName)
    {
        //if (!Subclass.ClassManager.issetClassType('Interface')) {
        //    Subclass.Error.create('NotExistentMethod')
        //        .method('isImplements')
        //        .apply()
        //    ;
        //}
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        //var classManager = this.getClassManager();
        var interfaces = this.getInterfaces();

        if (interfaces && interfaces.indexOf(interfaceName) >= 0) {
            return true;

        } else {
            for (var i = 0; i < interfaces.length; i++) {
                if (interfaces[i].isInstanceOf(interfaceName)) {
                    return true;
                }
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.isImplements) {
                return parent.isImplements(interfaceName);
            }
        }
        return false;
    };

    Class.registerAddon(ClassAddon);

    return ClassAddon;
}();