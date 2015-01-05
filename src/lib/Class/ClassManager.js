/**
 * @namespace
 */
Subclass.Class = {};

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
        this._loadStack = [];

        /**
         * Checks whether the loading process continues
         *
         * @type {boolean}
         * @private
         */
        this._loading = false;

        /**
         * Collection of registered classes
         *
         * @type {Object.<Subclass.Class.ClassTypeInterface>}
         * @private
         */
        this._classes = {};

        /**
         * The timeout after which ready callback will be called
         *
         * @type {(Function|null)}
         * @private
         */
        this._loadingEndTimeout = null;


        // Initializing

        this.getModule().getEventManager()
            .registerEvent('onLoadingEnd', this)
            .registerEvent('onRegisterClass', this)
        ;

        // Registering basic classes

        for (var classTypeName in _classes) {
            if (!_classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            for (var className in _classes[classTypeName]) {
                if (!_classes[classTypeName].hasOwnProperty(className)) {
                    continue;
                }
                var classDefinition = _classes[classTypeName][className];

                this.addClass(
                    classTypeName,
                    className,
                    classDefinition
                );
            }
        }
    }

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
     * Sets loading process start
     */
    ClassManager.prototype.startLoading = function()
    {
        this._loading = true;
    };

    /**
     * Sets loading process complete
     */
    ClassManager.prototype.completeLoading = function()
    {
        clearTimeout(this._loadingEndTimeout);
        var $this = this;

        this._loadingEndTimeout = setTimeout(function() {
            $this.getModule().getEventManager().getEvent('onLoadingEnd').invoke();
            $this._loading = false;
        }, 10);
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
        var moduleConfigs = this.getModule().getConfigs();

        if (!moduleConfigs.isAutoloadEnabled() || this.isInLoadStack(className)) {
            return;
        }
        var xmlhttp = this.loadClass(className);
        this.startLoading();

        if (xmlhttp) {
            this._loadStack[className] = xmlhttp;
        }
    };

    /**
     * Removes specified class from load stack
     *
     * @param {string} className
     */
    ClassManager.prototype.removeFromLoadStack = function(className)
    {
        if (!this.isInLoadStack(className)) {
            return;
        }
        this._loadStack[className].abort();
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
        return !!this._loadStack[className];
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
     * Loads new class by its name
     *
     * @param className
     * @returns {(XMLHttpRequest|null)}
     * @throws {Error}
     */
    ClassManager.prototype.loadClass = function(className)
    {
        if (this.issetClass(className)) {
            return null;
        }
        if (this.isInLoadStack(className)) {
            return null;
        }

        clearTimeout(this.getModule()._readyCallbackCallTimeout);

        var moduleConfigs = this.getModule().getConfigs();
        var rootPath = moduleConfigs.getRootPath();
        var classPath = rootPath + "/" + className + '.js';
        var $this = this;

        if (!rootPath) {
            throw new Error('Root path of the project was not specified!');
        }

        var xmlhttp = new XMLHttpRequest();
        var documentScripts = document.querySelectorAll('script');
        var currentScript;

        for (var i = 0; i < documentScripts.length; i++) {
            if (documentScripts[i].src.match(/\/subclass(\.min)*\.js/i)) {
                currentScript = documentScripts[i];
            }
        }
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
                            throw new Error('Loading class "' + className + '" failed.');
                        }
                    }
                } else {
                    throw new Error('Loading class "' + className + '" failed.');
                }
            } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                throw new Error('Loading class "' + className + '" failed.');
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
     * @returns {Subclass.Class.ClassTypeInterface} class
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
                throw new Error('Class type factory must be instance of "ClassType" class.');
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
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ClassManager.prototype.addClass = function(classTypeName, className, classDefinition)
    {
        if (!classTypeName) {
            throw new Error('Trying to register class without specifying class type.');
        }
        if (!Subclass.Class.ClassManager.issetClassType(classTypeName)) {
            throw new Error('Trying to register class of unknown class type "' + classTypeName + '".');
        }
        if (!className || typeof className != 'string') {
            throw new Error('Trying to register class with wrong name "' + className + '".');
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            throw new Error('Trying to register class with empty or not valid class definition.');
        }
        if (this.issetClass(className)) {
            throw new Error('Trying to redefine already existed class "' + className + '".');
        }

        var classTypeConstructor = Subclass.Class.ClassManager.getClassType(classTypeName);
        var classInstance = this.createClass(classTypeConstructor, className, classDefinition);

        if (!this._classes[classTypeName]) {
            this._classes[classTypeName] = {};
        }
        this._classes[classTypeName][className] = classInstance;

        this.getModule().getEventManager().getEvent('onRegisterClass').invoke(classInstance);
        this.removeFromLoadStack(className);

        if (this.isLoadStackEmpty()) {
            this.completeLoading();
        }

        return classInstance;
    };

    /**
     * Returns class
     *
     * @param {string} className
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ClassManager.prototype.getClass = function(className)
    {
        if (!this.issetClass(className)) {
            throw new Error('Trying to call to none existed class "' + className + '".');
        }

        for (var classTypeName in this._classes) {
            if (!this._classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            if (!!this._classes[classTypeName][className]) {
                return this._classes[classTypeName][className];
            }
        }
    };

    /**
     * Checks if class with passed name was ever registered
     *
     * @param {string} className
     * @returns {boolean}
     */
    ClassManager.prototype.issetClass = function(className)
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
     * @returns {Subclass.Class.ClassTypeInterface}
     */
    ClassManager.prototype.buildClass = function(classType)
    {
        return this.createClassBuilder(classType);
    };

    /**
     * Modifies existed class definition
     *
     * @param {string} className A name of the class
     * @returns {Subclass.Class.ClassTypeInterface}
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
                classBuilderConstructor = this.getClass(className).constructor.getClassBuilderClass();
            } else {
                classBuilderConstructor = Subclass.Class.ClassManager.getClassType(classType).getClassBuilderClass();
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

            if (!(inst instanceof Subclass.Class.ClassTypeBuilder)) {
                throw new Error('Class builder must be instance of "Subclass.Class.ClassTypeBuilder" class.');
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
    var _classes = {};

    /**
     * @type {Object.<function>}
     * @private
     */
    var _classTypes = {};

    return {

        /**
         * Creates instance of Subclass.Class.ClassManager
         *
         * @param {Subclass.Module.Module} module
         * @returns {ClassManager}
         */
        create: function(module)
        {
            return new ClassManager(module);
        },

        /**
         * Registers new class
         *
         * @param {string} classTypeName
         * @param {string} className
         * @param {Object} classDefinition
         */
        registerClass: function(classTypeName, className, classDefinition)
        {
            if (this.issetClass(className)) {
                throw new Error('Class "' + className + '" is already registered.');
            }
            if (!_classes[classTypeName]) {
                _classes[classTypeName] = {};
            }
            _classes[classTypeName][className] = classDefinition;
        },

        /**
         * Checks whether class with passed name was ever registered
         *
         * @param {string} className
         * @returns {boolean}
         */
        issetClass: function(className)
        {
            for (var classTypeName in _classes) {
                if (!_classes.hasOwnProperty(classTypeName)) {
                    continue;
                }
                if (!!_classes[classTypeName][className]) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Registers new type of classes
         *
         * @param {function} classTypeConstructor
         */
        registerClassType: function(classTypeConstructor)
        {
            var classTypeName = classTypeConstructor.getClassTypeName();

            _classTypes[classTypeName] = classTypeConstructor;

            /**
             * Registering new config
             *
             * @param {string} className
             * @param {Object} classDefinition
             */
            Subclass.Module.Module.prototype["register" + classTypeName] = function (className, classDefinition)
            {
                return this.getClassManager().addClass(
                    classTypeConstructor.getClassTypeName(),
                    className,
                    classDefinition
                );
            };
        },

        /**
         * Returns class type constructor
         *
         * @param classTypeName
         * @returns {Function}
         */
        getClassType: function(classTypeName)
        {
            if (!this.issetClassType(classTypeName)) {
                throw new Error('Trying to get non existed class type factory "' + classTypeName + '".');
            }
            return _classTypes[classTypeName];
        },

        /**
         * Checks if exists specified class type
         *
         * @param {string} classTypeName
         * @returns {boolean}
         */
        issetClassType: function(classTypeName)
        {
            return !!_classTypes[classTypeName];
        },

        /**
         * Return names of all registered class types
         *
         * @returns {Array}
         */
        getClassTypes: function()
        {
            return Object.keys(_classTypes);
        }
    };
})();

