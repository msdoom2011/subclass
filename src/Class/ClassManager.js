/**
 * @namespace
 */
Subclass.Class = {};

/**
 * @namespace
 */
Subclass.Class.Error = {};

/**
 * @namespace
 */
Subclass.Class.Type = {};

/**
 * @class
 * @constructor
 * @description
 *
 * Allows to manipulate by classes: register new, load and get already registered classes.
 *
 * @throws {Error}
 *      Throws error if specified invalid module instance
 *
 * @param {Subclass.Module.Module} module
 *      The module instance
 */
Subclass.Class.ClassManager = (function()
{
    function ClassManager(module)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the module instance')
                .received(module)
                .expected('an instance of Subclass.Module.Module class')
                .apply()
            ;
        }

        /**
         * Instance of Subclass module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * Collection of registered classes
         *
         * @type {Object.<Subclass.Class.ClassType>}
         * @private
         */
        this._classes = {};

        /**
         * The instance of class load manager
         *
         * @type {Subclass.Class.ClassLoader}
         * @private
         */
        this._loader = new Subclass.Class.ClassLoader(this);
    }

    /**
     * Initializes class manager
     *
     * @method initialize
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var $this = this;

        // Registering basic classes for the root module

        if (module.isRoot()) {
            var defaultClasses = ClassManager.getClasses();

            for (var classTypeName in defaultClasses) {
                if (!defaultClasses.hasOwnProperty(classTypeName)) {
                    continue;
                }
                for (var className in defaultClasses[classTypeName]) {
                    if (
                        !defaultClasses[classTypeName].hasOwnProperty(className)
                        || this.issetClass(className)
                    ) {
                        continue;
                    }
                    var classDefinition = defaultClasses[classTypeName][className];

                    this.addClass(
                        classTypeName,
                        className,
                        classDefinition
                    );
                }
            }
        }

        // Adding event listeners

        var eventManager = module.getEventManager();

        // Checking for classes with the same name in module (and its plug-ins)

        eventManager.getEvent('onLoadingEnd').addListener(100, function() {
            $this.checkForClones();
        });

        // Checking for classes with the same name in module (and its plug-ins)
        // after the new plug-in module was added

        eventManager.getEvent('onAddPlugin').addListener(function() {
            $this.checkForClones();
        });
    };

    /**
     * Returns the module instance
     *
     * @method getModule
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {Subclass.Module.Module}
     *      The module instance
     */
    ClassManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns the instance of class loader
     *
     * @method getLoader
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {Subclass.Class.ClassLoader|*}
     */
    ClassManager.prototype.getLoader = function()
    {
        return this._loader;
    };

    /**
     * Return all registered classes
     *
     * @method getClasses
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {boolean} [privateClasses=false]
     *      If it's true it returns classes only from current module
     *      without classes from its plug-ins
     *
     * @param {boolean} [withParentClasses=true]
     *      Should or not will be returned the classes from the parent
     *      modules (it is actual if the current module is a plug-in)
     *
     * @returns {Object.<Subclass.Class.ClassType>}
     */
    ClassManager.prototype.getClasses = function(privateClasses, withParentClasses)
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var classes = {};
        var $this = this;

        if (privateClasses !== true) {
            privateClasses = false;
        }
        if (withParentClasses !== false) {
            withParentClasses = true;
        }

        // Returning classes from current module (without its plug-ins)
        // with classes from its parent modules

        if (privateClasses && withParentClasses) {
            if (mainModule.hasParent()) {
                var parentModule = mainModule.getParent();
                var parentClasses = parentModule.getClassManager().getClasses(true);

                Subclass.Tools.extend(classes, parentClasses);
            }
            return Subclass.Tools.extend(classes, this._classes);

        // Returning classes from current module (without its plug-ins)

        } else if (privateClasses) {
            return this._classes;
        }

        // Adding classes from plug-in modules to result of searching

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(classes, $this.getClasses(true, withParentClasses));
                return;
            }
            var moduleClassManager = module.getClassManager();
            var moduleClasses = moduleClassManager.getClasses(false, withParentClasses);

            Subclass.Tools.extend(classes, moduleClasses);
        });

        return classes;
    };

    /**
     * Returns module names where is defined class with specified name.<br /><br />
     *
     * It is especially actual if class with specified name is defined
     * at once in several modules. So it's convenient to use for searching
     * classes with the same name defined in multiple modules.
     *
     * @method getClassLocations
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     * @returns {string[]}
     */
    ClassManager.prototype.getClassLocations = function(className)
    {
        var moduleManager = this.getModule().getModuleManager();
        var locations = [];

        moduleManager.eachModule(function(module) {
            var classManager = module.getClassManager();

            if (classManager.issetClass(className, true)) {
                locations.push(module.getName());
            }
            if (module.hasPlugins()) {
                var pluginModuleManager = module.getModuleManager();
                var plugins = pluginModuleManager.getPlugins();

                for (var i = 0; i < plugins.length; i++) {
                    var subPlugin = plugins[i];
                    var subPluginManager = subPlugin.getClassManager();
                    var subPluginLocations = subPluginManager.getClassLocations(className);

                    locations.concat(subPluginLocations);
                }
            }
        });

        return locations;
    };

    /**
     * The same as the {@link Subclass.Class.ClassLoader#loadClass}
     */
    ClassManager.prototype.loadClass = function()
    {
        var classLoader = this.getLoader();

        classLoader.loadClass.apply(classLoader, arguments);
    };

    /**
     * Creates class instance
     *
     * @method createClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {(ClassType|function)} classConstructor
     *      Class constructor of specific class type
     *
     * @param {string} className
     *      A name of the future class
     *
     * @param {Object} classDefinition
     *      A definition of the creating class
     *
     * @returns {Subclass.Class.ClassType} class
     */
    ClassManager.prototype.createClass = function(classConstructor, className, classDefinition)
    {
        var createInstance = true;

        if (arguments[3] === false) {
            createInstance = false;
        }

        if (classConstructor.$parent) {
            var parentClassConstructor = this.createClass(
                classConstructor.$parent,
                className,
                classDefinition,
                false
            );

            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            classConstructorProto = Subclass.Tools.extend(
                classConstructorProto,
                classConstructor.prototype
            );

            classConstructor.prototype = classConstructorProto;
            classConstructor.prototype.constructor = classConstructor;
        }

        if (createInstance) {
            var inst = new classConstructor(this, className, classDefinition);

            if (!(inst instanceof Subclass.Class.ClassType)) {
                Subclass.Error.create(
                    'The class type factory must be instance of "Subclass.Class.ClassType" class.'
                );
            }
            return inst;
        }

        return classConstructor;
    };

    /**
     * Adds a new class
     *
     * @method addClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} classTypeName
     * @param {string} className
     * @param {object} classDefinition
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.addClass = function(classTypeName, className, classDefinition)
    {
        if (!classTypeName) {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'without specifying class type.'
            );
        }
        if (!Subclass.Class.ClassManager.issetClassType(classTypeName)) {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'of unknown class type "' + classTypeName + '".'
            );
        }
        if (!className || typeof className != 'string') {
            Subclass.Error.create(
                'Trying to register the class with wrong name "' + className + '".'
            );
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'with empty or not valid class definition.'
            );
        }
        if (this.issetClass(className)) {
            Subclass.Error.create(
                'Trying to redefine already existed class "' + className + '".'
            );
        }

        var classTypeConstructor = Subclass.Class.ClassManager.getClassType(classTypeName);
        var classInstance = this.createClass(classTypeConstructor, className, classDefinition);

        this._classes[className] = classInstance;
        this.getLoader().setClassLoaded(className);

        return classInstance;
    };

    /**
     * Returns class
     *
     * @method getClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.getClass = function(className)
    {
        if (!this.issetClass(className)) {
            Subclass.Error.create('Trying to call to none existed class "' + className + '".');
        }
        var classInst = this.getClasses()[className];

        if (classInst.createConstructorOnGet()) {
            classInst.getConstructor();
        }

        return classInst;
    };

    /**
     * Checks if class with passed name was ever registered
     *
     * @method issetClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     * @param {boolean} [privateClasses]
     * @returns {boolean}
     */
    ClassManager.prototype.issetClass = function(className, privateClasses)
    {
        var withParentClasses = true;

        if (privateClasses === true) {
            withParentClasses = false;
        }
        return !!this.getClasses(privateClasses, withParentClasses)[className];
    };

    /**
     * Validates whether there are classes with the same names in the module and its plug-ins
     *
     * @method checkForClones
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @throws {Error}
     */
    ClassManager.prototype.checkForClones = function()
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var $this = this;
        var classes = {};

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(classes, $this._classes);
                return;
            }
            var moduleClassManager = module.getClassManager();
            var moduleClasses = moduleClassManager.getClasses(false, false);

            for (var className in moduleClasses) {
                if (
                    !moduleClasses.hasOwnProperty(className)
                    || ClassManager.issetClass(className)
                ) {
                    continue;
                }
                if (classes[className]) {
                    var classLocations = $this.getClassLocations(className);

                    Subclass.Error.create(
                        'Multiple class definition detected. Class "' + className + '" defined ' +
                        'in modules: "' + classLocations.join('", "') + '".'
                    );
                }
                classes[className] = 1;
            }
        });
    };

    /**
     * Checks whether class manager contains any class
     *
     * @method isEmpty
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isEmpty = function()
    {
        return Subclass.Tools.isEmpty(this._classes);
    };

    /**
     * Builds new class of specified class type
     *
     * @method buildClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} classType Type of class, i.e. 'Class', 'AbstractClass', 'Config', 'Interface', 'Trait'
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.buildClass = function(classType)
    {
        return this.createClassBuilder(classType);
    };

    /**
     * Modifies existed class definition
     *
     * @method alterClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className A name of the class
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.alterClass = function(className)
    {
        return this.createClassBuilder(null, className);
    };

    /**
     * Creates instance of class builder
     *
     * @method createClassBuilder
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} classType It can be name of class type or name of class which you want to alter.
     * @param {string} [className]
     */
    ClassManager.prototype.createClassBuilder = function(classType, className)
    {
        var classBuilderConstructor = null;
        var createInstance = true;

        if (!arguments[2]) {
            if (className && !this.issetClass(className)) {
                Subclass.Error.create(
                    'Can\'t alter definition of class "' + className + '". ' +
                    'It does not exists.'
                );
            }
            if (className) {
                classBuilderConstructor = this.getClass(className).constructor.getBuilderClass();
            } else {
                classBuilderConstructor = Subclass.Class.ClassManager.getClassType(classType).getBuilderClass();
            }
        } else {
            classBuilderConstructor = arguments[2];
        }
        if (arguments[3] === false) {
            createInstance = false;
        }

        if (classBuilderConstructor.$parent) {
            var parentClassBuilderConstructor = this.createClassBuilder(
                classType,
                className,
                classBuilderConstructor.$parent,
                false
            );

            var classBuilderConstructorProto = Object.create(parentClassBuilderConstructor.prototype);

            classBuilderConstructorProto = Subclass.Tools.extend(
                classBuilderConstructorProto,
                classBuilderConstructor.prototype
            );

            classBuilderConstructor.prototype = classBuilderConstructorProto;
            classBuilderConstructor.prototype.constructor = classBuilderConstructor;
        }

        if (createInstance) {
            var inst = new classBuilderConstructor(this, classType, className);

            if (!(inst instanceof Subclass.Class.ClassBuilder)) {
                Subclass.Error.create(
                    'The class builder must be instance ' +
                    'of "Subclass.Class.ClassBuilder" class.'
                );
            }
            return inst;
        }

        return classBuilderConstructor;
    };


    //============================== Class Manager API ================================

    /**
     * Classes that will be added to class manager instance immediately after its creation
     *
     * @type {Object.<Object>}
     * @private
     */
    ClassManager._classes = {};

    /**
     * @type {Object.<function>}
     * @private
     */
    ClassManager._classTypes = {};

    /**
     * Returns all registered default classes
     *
     * @method getClasses
     * @memberOf Subclass.Class.ClassManager
     *
     * @returns {Object.<Object>}
     */
    ClassManager.getClasses = function()
    {
        return this._classes;
    };

    /**
     * Registers new class
     *
     * @method registerClass
     * @memberOf Subclass.Class.ClassManager
     *
     * @param {string} classTypeName
     * @param {string} className
     * @param {Object} classDefinition
     */
    ClassManager.registerClass = function(classTypeName, className, classDefinition)
    {
        if (this.issetClass(className)) {
            Subclass.Error.create('The class "' + className + '" is already registered.');
        }
        if (!this._classes[classTypeName]) {
            this._classes[classTypeName] = {};
        }
        this._classes[classTypeName][className] = classDefinition;
    };

    /**
     * Checks whether class with passed name was ever registered
     *
     * @method issetClass
     * @memberOf Subclass.Class.ClassManager
     *
     * @param {string} className
     * @returns {boolean}
     */
    ClassManager.issetClass = function(className)
    {
        for (var classTypeName in this._classes) {
            if (!this._classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            if (!!this._classes[classTypeName][className]) {
                return true;
            }
        }
        return false;
    };

    /**
     * Registers new type of classes
     *
     * @method registerClassType
     * @memberOf Subclass.Class.ClassManager
     *
     * @param {function} classTypeConstructor
     */
    ClassManager.registerClassType = function(classTypeConstructor)
    {
        var classTypeName = classTypeConstructor.getClassTypeName();

        this._classTypes[classTypeName] = classTypeConstructor;

        /**
         * Registering new config
         *
         * @param {string} className
         * @param {Object} classDefinition
         */
        Subclass.Module.ModuleAPI.prototype["register" + classTypeName] = function (className, classDefinition)
        {
            return this.getModule().getClassManager().addClass(
                classTypeConstructor.getClassTypeName(),
                className,
                classDefinition
            );
        };
    };

    /**
     * Returns class type constructor
     *
     * @method getClassType
     * @memberOf Subclass.Class.ClassManager
     *
     * @param classTypeName
     * @returns {Function}
     */
    ClassManager.getClassType = function(classTypeName)
    {
        if (!this.issetClassType(classTypeName)) {
            Subclass.Error.create('Trying to get non existed class type factory "' + classTypeName + '".');
        }
        return this._classTypes[classTypeName];
    };

    /**
     * Checks if exists specified class type
     *
     * @method issetClassType
     * @memberOf Subclass.Class.ClassManager
     *
     * @param {string} classTypeName
     * @returns {boolean}
     */
    ClassManager.issetClassType = function(classTypeName)
    {
        return !!this._classTypes[classTypeName];
    };

    /**
     * Return names of all registered class types
     *
     * @method getClassType
     * @memberOf Subclass.Class.ClassManager
     *
     * @returns {Array}
     */
    ClassManager.getClassTypes = function()
    {
        return Object.keys(this._classTypes);
    };

    return ClassManager;

})();

