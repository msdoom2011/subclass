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
         * Stack of classes that are loading at the moment
         *
         * @type {Array}
         * @private
         */
        this._loadStack = {};

        /**
         * Checks whether the loading process continues
         *
         * @type {boolean}
         * @private
         */
        this._loading = false;

        /**
         * Reports that loading was paused
         *
         * @type {boolean}
         * @private
         */
        this._loadingPause = false;

        /**
         * Reports that loading is locked
         *
         * @type {boolean}
         * @private
         */
        this._loadingLocked = true;

        /**
         * Collection of registered classes
         *
         * @type {Object.<Subclass.Class.ClassType>}
         * @private
         */
        this._classes = {};

        /**
         * The timeout after which the ready callback will be called
         *
         * @type {(*|null)}
         * @private
         */
        this._loadingEndTimeout = null;

        /**
         * The timeout after which the classes in load stack will start loading
         *
         * @type {(*|null)}
         * @private
         */
        this._addToLoadStackTimeout = null;
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

        // Unlock loading of module files after the module was created

        eventManager.getEvent('onModuleInit').addListener(function() {
            if ($this.getModule().isRoot()) {
                $this.unlockLoading();
            }
        });

        // Checking for classes with the same name in module (and its plug-ins)
        // and unlocking loading files of plug-in modules after the files
        // of current module (to which the current one instance of class manager belongs) were fully loaded

        eventManager.getEvent('onLoadingEnd').addListener(100, function() {
            var moduleManager = module.getModuleManager();

            $this.checkForClones();

            moduleManager.eachModule(function(module) {
                module.getClassManager().unlockLoading();
            });
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
     * Locks the process of loading files with new classes
     *
     * @method lockLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.lockLoading = function()
    {
        this._loadingLocked = true;
    };

    /**
     * Unlocks and starts the process of loading files with new classes
     *
     * @method unlockLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.unlockLoading = function()
    {
        if (this.getModule().getConfigManager().hasFiles()) {
            return;
        }
        if (!this.isLoadingLocked()) {
            return;
        }
        this._loadingLocked = false;
        this.startLoading();
        this.completeLoading();
    };

    /**
     * Reports whether the process of loading files with new classes is locked
     *
     * @method isLoadingLocked
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isLoadingLocked = function()
    {
        return this._loadingLocked;
    };

    /**
     * Starts the process of loading files with new classes
     *
     * @method startLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.startLoading = function()
    {
        if (this.isLoadingLocked()) {
            return;
        }
        this._loading = true;
        this._loadingPause = false;

        this.processLoadStack();
    };

    /**
     * Pauses the process of loading files with new classes
     *
     * @method pauseLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.pauseLoading = function()
    {
        clearTimeout(this._loadingEndTimeout);
        this._loadingPause = true;
    };

    /**
     * Reports whether the process of loading files with new classes was paused
     *
     * @method isLoadingPaused
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isLoadingPaused = function()
    {
        return this._loadingPause;
    };

    /**
     * Tries to complete the process of loading files with new classes.
     * If it was completed then will be triggered the appropriate event.
     *
     * @method completeLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.completeLoading = function()
    {
        if (!this.isLoading()) {
            return;
        }
        clearTimeout(this._loadingEndTimeout);
        var $this = this;

        if (
            !this.isLoadingPaused()
            && this.isLoadStackEmpty()
        ) {
            this._loadingEndTimeout = setTimeout(function() {
                $this.getModule().getEventManager().getEvent('onLoadingEnd').triggerPrivate();
                $this._loading = false;
            }, 10);
        }
    };

    /**
     * Checks whether the loading process continues
     *
     * @method isLoading
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isLoading = function()
    {
        return this._loading;
    };

    /**
     * Adds the new class to load stack
     *
     * @method addToLoadStack
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     *      The name of class. It should be compatible with the file path where
     *      it is located relative to "rootPath" configuration option of module.
     */
    ClassManager.prototype.addToLoadStack = function(className)
    {
        var moduleConfigs = this.getModule().getConfigManager();
        var $this = this;

        if (this.isInLoadStack(className) || this.issetClass(className)) {
            return;
        }
        this._loadStack[className] = true;
        clearTimeout(this._addToLoadStackTimeout);

        this._addToLoadStackTimeout = setTimeout(function() {
            if (!$this.isLoadingLocked()) {
                $this.startLoading();
            }
        }, 10);
    };

    /**
     * Processes the classes from load stack
     *
     * @method processLoadStack
     * @memberOf Subclass.Class.ClassManager.prototype
     */
    ClassManager.prototype.processLoadStack = function()
    {
        for (var className in this._loadStack) {
            if (
                !this._loadStack.hasOwnProperty(className)
                || typeof this._loadStack[className] != 'boolean'
            ) {
                continue;
            }
            if (this.issetClass(className)) {
                this.removeFromLoadStack(className);
            }

            var xmlhttp = this.loadClass(className);

            if (xmlhttp) {
                this._loadStack[className] = xmlhttp;
            }
        }
    };

    /**
     * Removes specified class from the load stack
     *
     * @method removeFromLoadStack
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     *      The name of class
     */
    ClassManager.prototype.removeFromLoadStack = function(className)
    {
        if (!this._loadStack.hasOwnProperty(className)) {
            return;
        }
        if (typeof this._loadStack[className] != 'boolean') {
            this._loadStack[className].abort();
        }
        delete this._loadStack[className];
    };

    /**
     * Checks whether the specified class is in load stack
     *
     * @method isInLoadStack
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} className
     *      The name of class
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isInLoadStack = function(className)
    {
        return this._loadStack[className] && typeof this._loadStack[className] != 'boolean';
    };

    /**
     * Checks whether the load stack is empty
     *
     * @method isLoadStackEmpty
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isLoadStackEmpty = function()
    {
        return !Object.keys(this._loadStack).length;
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
     * Loads the new class by its name
     *
     * @method loadClass
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @throws {Error}
     * @param {string} className
     * @param {Function} [callback]
     * @returns {(XMLHttpRequest|null)}
     */
    ClassManager.prototype.loadClass = function(className, callback)
    {
        if (className && typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (this.issetClass(className)) {
            return null;
        }
        if (this.isInLoadStack(className)) {
            return null;
        }

        this.pauseLoading();

        var moduleConfigs = this.getModule().getConfigManager();
        var rootPath = moduleConfigs.getRootPath();
        var classPath = rootPath + className + '.js';
        var $this = this;

        return Subclass.Tools.loadJS(classPath, function() {
            if (!$this.issetClass(className)) {
                Subclass.Error.create('The class "' + className + '" was not loaded.');
            }
            if (callback) {
                callback($this.getClass(className));
            }
        });
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
        this.removeFromLoadStack(className);

        if (this.isLoadStackEmpty()) {
            this.startLoading();
            this.completeLoading();
        }

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

