/**
 * @class
 * @constructor
 * @description
 *
 * The class which holds and manages module settings.
 * It can validate, set and get settings parameters.<br /><br />
 *
 * To see the list of available setting parameters
 * look at description of {@link Subclass.Module}
 * class constructor parameters.
 *
 * @param {Subclass.Module} module
 *      The module instance
 */
Subclass.SettingsManager = function()
{
    /**
     * @alias Subclass.SettingsManager
     */
    function SettingsManager(module)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Indicates is the current module a plug-in
         *
         * @type {boolean}
         * @private
         */
        this._plugin = false;

        /**
         * Indicates that current module is a plugin and belongs to specified module
         *
         * @type {(string|null)}
         * @private
         */
        this._pluginOf = null;

        /**
         * Root path of the project
         *
         * @type {string}
         * @private
         */
        this._rootPath = "";

        /**
         * A list of files
         *
         * @type {Array}
         * @private
         */
        this._files = [];

        /**
         * List of class manager events
         *
         * @type {Object}
         * @private
         */
        this._events = {};


        // Initializing operations

        this.registerEvent('onInitialize');
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    }

    SettingsManager.$parent = Subclass.Extendable;

    SettingsManager.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Sets new module settings.
     *
     * New setting parameters will rewrite earlier ones, for example,
     * specified in module constructor or in earlier call of SettingsManager#setSettings method.
     *
     * @method setSettings
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *     Throws error when:<br />
     *     - if module is ready;<br />
     *     - specified argument is not a plain object;<br />
     *     - in settings object specified non agreed parameter.
     *
     * @param {Object} moduleSettings
     *     Object with module setting parameters
     *
     * @example
     * ...
     *
     * var moduleInst = Subclass.createModule('myApp');
     *
     * ...
     * var moduleSettings = moduleInst.getSettingsManager();
     * var parameterManager = moduleInst.getParameterManager();
     *
     * moduleSettings.setSettings({ // or easily use moduleInst.setSettings({...});
     *     rootPath: "path/to/project/root/dir",  // adds new parameter
     * });
     *
     * moduleSettings.getRootPath();               // Return "path/to/project/root/dir"
     * ...
     */
    SettingsManager.prototype.setSettings = function (moduleSettings)
    {
        var $this = this;

        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change settings in ready module.');
        }
        if (moduleSettings && !Subclass.Tools.isPlainObject(moduleSettings)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the module settings", false)
                .received(moduleSettings)
                .expected("a plain object")
                .apply()
            ;
        }
        if (moduleSettings) {
            if (moduleSettings.hasOwnProperty('pluginOf')) {
                this.setPluginOf(moduleSettings.pluginOf);
            }
            if (moduleSettings.hasOwnProperty('files')) {
                this.setFiles(moduleSettings.files);
            }

            for (var settingName in moduleSettings) {
                if (
                    !moduleSettings.hasOwnProperty(settingName)
                    || [
                        'pluginOf',
                        'files',
                        'onReady'
                    ].indexOf(settingName) >= 0
                ) {
                    continue;
                }
                var setterName = "set" + settingName[0].toUpperCase() + settingName.substr(1);

                if (!this[setterName]) {
                    Subclass.Error.create(
                        'Setting option "' + settingName + '" is not allowed ' +
                        'by the module.'
                    );
                }
                this[setterName](moduleSettings[settingName]);
            }
            if (moduleSettings.hasOwnProperty('onReady')) {
                $this.setOnReady(moduleSettings.onReady);
            }
        }
    };

    /**
     * Returns module instance to which current settings manager belongs
     *
     * @method getModule
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {Subclass.Module}
     */
    SettingsManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets a specific state would be current module a plug-in or not.
     *
     * If module is marked as a plug-in then its registered onReady callback functions
     * will be invoked only when the root module becomes ready.
     *
     * @method setPlugin
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - was specified not boolean value
     *
     * @param {boolean} isPlugin
     *      Should be current module a plugin or not
     */
    SettingsManager.prototype.setPlugin = function(isPlugin)
    {
        this.checkModuleIsReady();

        if (typeof isPlugin != 'boolean') {
            Subclass.Error.create('InvalidModuleOption')
                .option('plugin')
                .module(this.getModule().getName())
                .received(isPlugin)
                .expected('a boolean value')
                .apply()
            ;
        }
        this._plugin = isPlugin;
    };

    /**
     * Reports whether the current module is a plug-in of another module or not
     *
     * @method getPlugin
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {boolean}
     */
    SettingsManager.prototype.getPlugin = function()
    {
        return this._plugin;
    };

    /**
     * @method isPlugin
     * @memberOf Subclass.SettingsManager.prototype
     * @alias Subclass.SettingsManager#getPlugin
     */
    SettingsManager.prototype.isPlugin = SettingsManager.prototype.getPlugin;

    /**
     * Marks current module that it should be a plug-in of the module with specified name.
     *
     * If was specified name of parent module then the module setting parameter
     * "plugin" will forcibly set to true.
     *
     * @method setPluginOf
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if specified argument is not string or null
     *
     * @param {string} parentModuleName
     *      A name of the parent module
     */
    SettingsManager.prototype.setPluginOf = function(parentModuleName)
    {
        this.checkModuleIsReady();

        if (parentModuleName !== null && typeof parentModuleName != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('pluginOf')
                .module(this.getModule().getName())
                .received(parentModuleName)
                .expected('a string (name of another module that is not marked as a plugin)')
                .apply()
            ;
        }
        this._pluginOf = parentModuleName;
        this.setPlugin(true);
    };

    /**
     * Returns name of the parent module if current one is a plug-in of the specified module
     *
     * @method getPluginOf
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {(string|null)}
     */
    SettingsManager.prototype.getPluginOf = function()
    {
        return this._pluginOf;
    };

    /**
     * Sets root directory path of the project.
     *
     * @method setRootPath
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not string argument value
     *
     * @param {string} rootPath
     *      A path to the project root directory
     *
     * @example
     *
     * ...
     * var moduleSettings = moduleInst.getSettingsManager();
     *     moduleSettings.setRootPath("path/to/the/directory/root");
     * ...
     */
    SettingsManager.prototype.setRootPath = function(rootPath)
    {
        this.checkModuleIsReady();

        if (typeof rootPath != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('rootPath')
                .module(this.getModule().getName())
                .received(rootPath)
                .expected('a string')
                .apply()
            ;
        }
        this._rootPath = rootPath;
    };

    /**
     * Returns root directory path of the project
     *
     * @method getRootPath
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {(string|null)}
     */
    SettingsManager.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Sets and loads specified files.
     *
     * @method setFiles
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not array of strings argument value
     *
     * @param {string[]} files
     *      An array with file names which will be loaded before module
     *      will become ready. Each file name can be an absolute or relative.
     *      If file name specified with sign "^" at start it means that is an absolute path.
     *      Otherwise it is a path of file relative to "rootPath".
     *
     * @param {Function} callback
     *      The callback function which will invoked after
     *      the specified main file will loaded
     */
    SettingsManager.prototype.setFiles = function(files, callback)
    {
        this.checkModuleIsReady();

        if (!files || !Array.isArray(files)) {
            Subclass.Error.create(
                "Trying to set invalid files array in module settings set. " +
                "It must contain the names of files."
            );
        }

        var module = this.getModule();
        var loadManager = module.getLoadManager();

        for (var i = 0; i < files.length; i++) {
            loadManager.loadFile(files[i]);
        }
    };

    /**
     * Reports whether current module loads some files
     *
     * @method hasFiles
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {boolean}
     */
    SettingsManager.prototype.hasFiles = function()
    {
        return !!this._files.length;
    };

    /**
     * Sets callback function which will be invoked before all registered user application
     * parts (i.e. classes) will be set upped.
     *
     * It is a good opportunity to modify its settings using plugins of application.
     *
     * @method setOnSetup
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param callback
     */
    SettingsManager.prototype.setOnSetup = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var eventManager = this.getModule().getEventManager();
        var onSetupEvent = eventManager.getEvent('onSetup');

        onSetupEvent.addListener(callback);
    };

    /**
     * Sets callback function which will be invoked after the all classes of the module
     * will be loaded and registered.<br><br>
     *
     * It is the same as "onReady" parameter in module settings. If it was defined
     * in module settings too the new callback function will be added to the onReady
     * callbacks storage and will be invoked after other callback functions
     * which were registered earlier.<br><br>
     *
     * If there were no classes registered in module at the moment and onReady callback
     * function was not set earlier, the call of current method invokes specified callback immediately.
     *
     * @method setOnReady
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param {Function} callback
     *      Callback function which will do some initializing manipulations
     */
    SettingsManager.prototype.setOnReady = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var module = this.getModule();
        var eventManager = module.getEventManager();
        var onReadyEvent = eventManager.getEvent('onReady');

        onReadyEvent.addListener(callback);
    };

    /**
     * Ensures that the module is not ready
     *
     * @method checkModuleIsReady
     * @private
     * @ignore
     */
    SettingsManager.prototype.checkModuleIsReady = function()
    {
        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change settings in ready module.');
        }
    };

    return SettingsManager;
}();