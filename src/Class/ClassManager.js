/**
 * @namespace
 */
Subclass.Class = {};

/**
 * @namespace
 */
Subclass.Class.Error = {};

/**
 * @class
 */
Subclass.Class.ClassManager = (function()
{
    /**
     * @param {Subclass.Module.Module} module
     * @constructor
     */
    function ClassManager(module)
    {
        /**
         * Instance of Subclass module
         *
         * @type {Subclass.Module.Module}
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
         * @type {null}
         * @private
         */
        this._loadingEndTimeout = null;

        /**
         * The timeout after which the classes in load stack will start loading
         *
         * @type {null}
         * @private
         */
        this._addToLoadStackTimeout = null;
    }

    ClassManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var $this = this;

        module.getEventManager()
            .registerEvent('onLoadingEnd', this)
        ;

        // Registering basic classes

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

        // Adding event listeners

        var eventManager = module.getEventManager();

        eventManager.getEvent('onInit').addListener(function() {
            if ($this.getModule().isRoot()) {
                $this.unlockLoading();
            }
        });

        eventManager.getEvent('onLoadingEnd').addListener(100, function() {
            var mainModule = module;
            var moduleManager = module.getModuleManager();
            var classes = {};

            Разблокировка загрузки файлов плагинов происходит до того, как плагины были добавлены


            moduleManager.eachModule(function(module) {
                if (module == mainModule) {
                    Subclass.Tools.extend(classes, $this._classes);
                    return;
                }
                var moduleClassManager = module.getClassManager();
                var moduleClasses = moduleClassManager.getClasses(false, false);

                moduleClassManager.unlockLoading();

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
        });
    };

    /**
     * Returns module instance
     *
     * @returns {Subclass.Module.Module}
     */
    ClassManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Locks loading process
     */
    ClassManager.prototype.lockLoading = function()
    {
        this._loadingLocked = true;
    };

    /**
     * Unlocks loading process
     */
    ClassManager.prototype.unlockLoading = function()
    {
        this._loadingLocked = false;
        this.startLoading();
        this.completeLoading();
    };

    /**
     * Reports whether the loading process is locked
     *
     * @returns {boolean|*}
     */
    ClassManager.prototype.isLoadingLocked = function()
    {
        return this._loadingLocked;
    };

    /**
     * Sets loading process start
     */
    ClassManager.prototype.startLoading = function()
    {
        if (this.isLoadingLocked()) {
            return;
        }
        this._loading = true;
        this._loadingPause = false;

        if (this.getModule().getName() == 'appPlugin1') {
            console.log('started');
        }

        this.processLoadStack();
    };

    /**
     * Clears loading end timeout
     */
    ClassManager.prototype.pauseLoading = function()
    {
        if (this.getModule().getName() == 'appPlugin1') {
            console.log('stopped');
        }
        clearTimeout(this._loadingEndTimeout);
        this._loadingPause = true;
    };

    /**
     * Reports that class loading was paused
     *
     * @returns {boolean|*}
     */
    ClassManager.prototype.isLoadingPaused = function()
    {
        return this._loadingPause;
    };

    /**
     * Sets loading process complete
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

        //if (!this.isLoadingPaused() && this.isLoadStackEmpty()) {
        //    this._loadingEndTimeout = setTimeout(function() {
        //        var plugins = $this.getModule().getModuleManager().getPlugins();
        //
        //        for (var i = 0; i < plugins.length; i++) {
        //            var pluginClassManager = plugins[i].getClassManager();
        //
        //            if (!pluginClassManager.isLoadingLocked()) {
        //                pluginClassManager.unlockLoading();
        //            }
        //        }
        //        if (!$this.getModule().getModuleManager().hasLazyModules()) {
        //            $this.getModule().getEventManager().getEvent('onLoadingEnd').triggerPrivate();
        //            $this._loading = false;
        //        }
        //    }, 10);
        //}
    };

    /**
     * Checks whether the loading process continues
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isLoading = function()
    {
        return this._loading;
    };

    /**
     * Adds specified class to load stack
     *
     * @param {string} className
     */
    ClassManager.prototype.addToLoadStack = function(className)
    {
        var moduleConfigs = this.getModule().getConfigManager();
        var $this = this;

        if (!moduleConfigs.isAutoloadEnabled() || this.isInLoadStack(className)) {
            return;
        }
        if (this.issetClass(className)) {
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
     * Removes specified class from load stack
     *
     * @param {string} className
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
     * Checks if specified class is in load stack
     *
     * @param {string} className
     * @returns {boolean}
     */
    ClassManager.prototype.isInLoadStack = function(className)
    {
        return this._loadStack[className] && typeof this._loadStack[className] != 'boolean';
    };

    /**
     * Checks if load stack is empty
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
     * @param {boolean} [privateClasses = false]
     *      If passed true it returns classes only from current module
     *      without classes from its plug-ins
     *
     * @param {boolean} [withParentClasses = true]
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
        if (privateClasses && withParentClasses) {
            if (mainModule.hasParent()) {
                var parentModule = mainModule.getParent();
                var parentClasses = parentModule.getClassManager().getClasses(true);

                Subclass.Tools.extend(classes, parentClasses);
            }
            return Subclass.Tools.extend(classes, this._classes);

        } else if (privateClasses) {
            return this._classes;
        }

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
     * Returns module names where defined class with specified name
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

            if (classManager.issetClass(className)) {
                locations.push(module.getName());
            }
        });

        return locations;
    };

    /**
     * Loads new class by its name
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
                .argument("name of class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("callback")
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

        if (!rootPath) {
            Subclass.Error.create('The root path of the project was not specified!');
        }

        var xmlhttp = new XMLHttpRequest();
        var documentScripts = document.querySelectorAll('script');
        var currentScript = documentScripts[documentScripts.length - 1];

        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var script = document.createElement('script');
                script.setAttribute("type", "text/javascript");
                script.text = xmlhttp.responseText;

                if (script.text) {
                    if (currentScript) {
                        currentScript.parentNode.insertBefore(
                            script,
                            currentScript.nextSibling
                        );
                        if (!$this.issetClass(className)) {
                            Subclass.Error.create('Loading class "' + className + '" failed.');
                        }
                        if (callback) {
                            callback($this.getClass(className));
                        }
                    }
                } else {
                    Subclass.Error.create('Loading class "' + className + '" failed.');
                }
            } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                Subclass.Error.create('Loading class "' + className + '" failed.');
            }
        };

        xmlhttp.open("GET", classPath, true);
        xmlhttp.send();

        return xmlhttp;
    };

    /**
     * Creates class instance
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
     * @param {string} className
     * @returns {boolean}
     */
    ClassManager.prototype.issetClass = function(className)
    {
        return !!this.getClasses()[className];
    };

    /**
     * Checks whether class manager contains any class
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
     * @param {string} classType It can be name of class type or name of class which you want to alter.
     * @param {string} [className]
     */
    ClassManager.prototype.createClassBuilder = function(classType, className)
    {
        var classBuilderConstructor = null;
        var createInstance = true;

        if (!arguments[2]) {
            if (className && this.issetClass(className)) {
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
     * @returns {Object.<Object>}
     */
    ClassManager.getClasses = function()
    {
        return this._classes;
    };

    /**
     * Registers new class
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
     * @returns {Array}
     */
    ClassManager.getClassTypes = function()
    {
        return Object.keys(this._classTypes);
    };

    return ClassManager;

})();

