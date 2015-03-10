/**
 * @class
 * @global
 * @name Subclass
 * @namespace
 * @description
 *      The basic class for creating new application
 *      based on SubclassJS framework.
 */
window.Subclass = (function()
{
    /**
     * Collection of registered modules
     *
     * @type {Array.<Subclass.Module>}
     * @private
     */
    var _modules = [];

    return {

        /**
         * Creates new subclass module.<br /><br />
         *
         * Creates instance of {@link Subclass.Module}
         *
         * @param {string} moduleName
         *      A name of the future module
         *
         * @param {Array} [modulePlugins]
         *      The names of the modules that you want to include to the current module
         *      or if plug-in modules are not loaded at the moment you can specify
         *      objects like: { name: "pluginModuleName", file: "file/of/module.js" }
         *      to automatically load it during initializing module.
         *
         * @param {Object} [moduleConfigs = {}]
         *      A configuration of the creating module
         *
         * @returns {Subclass.ModuleAPI}
         * @memberOf Subclass
         * @static
         *
         * @example
         * ...
         *
         * // The simplest way to create module
         * var app = Subclass.createModule("app");
         *
         * // Creating module with configuration and without plugins
         * var app = Subclass.createModule("app", {
         *      // Optional module configuration
         * });
         *
         * // Creating module with plugins which are loaded to the document at the moment
         * var app = Subclass.createModule("app", ["plugin1", "plugin2"], {
         *      // Optional module configuration
         * });
         *
         * // Creating module with plugins which are not loaded to the document at the moment
         * var app = Subclass.createModule("app", [
         *      {
         *          name: "plugin1",
         *          file: "file/of/plugin1.js"
         *      }, {
         *          name: "plugin2",
         *          file: "file/of/plugin2.js"
         *      }
         * ], {
         *      // Optional module configuration
         * });
         *
         * // Creating module with loaded and not loaded plugins to the document at the moment
         * var app = Subclass.createModule("app", [
         *      plugin1,
         *      plugin2,
         *      {
         *          name: "plugin3",
         *          file: "path/to/file/of/plugin3.js"
         *      }, {
         *          name: "plugin4",
         *          file: "path/to/file/of/plugin4.js"
         *      }
         * ], {
         *      // Optional module configuration
         * });
         */
        createModule: function(moduleName, modulePlugins, moduleConfigs)
        {
            if (Subclass.Tools.isPlainObject(modulePlugins)) {
                moduleConfigs = modulePlugins;
                modulePlugins = [];
            }
            if (!modulePlugins) {
                modulePlugins = [];
            }

            // If for registering module exists plugins

            for (var i = 0; i < _modules.length; i++) {
                var registeredModuleName = _modules[i].getName();
                var pluginOf = _modules[i].getConfigManager().getPluginOf();

                if (pluginOf == moduleName) {
                    modulePlugins.push(registeredModuleName);
                }
            }

            modulePlugins = Subclass.Tools.unique(modulePlugins);
            var lazyPlugins = [];

            function throwInvalidPluginDef(optName, optType) {
                Subclass.Error.create(
                    'Specified invalid plug-in module definition while creating module "' + moduleName + '". ' +
                    'The required option "' + optName + '" was missed or is not ' + optType + '.'
                );
            }

            for (i = 0; i < modulePlugins.length; i++) {
                if (Subclass.Tools.isPlainObject(modulePlugins[i])) {
                    var moduleDef = modulePlugins[i];
                    lazyPlugins.push(modulePlugins[i]);

                    if (!moduleDef.name || typeof moduleDef.name != 'string') {
                        throwInvalidPluginDef('name', 'a string');

                    } else if (Subclass.issetModule(moduleDef.name)) {
                        continue;
                    }
                    if (!moduleDef.file || typeof moduleDef.file != 'string') {
                        throwInvalidPluginDef('file', 'a string');
                    }
                }
            }

            // Creating instance of module

            var module = new Subclass.Module(
                moduleName,
                modulePlugins,
                moduleConfigs
            );
            _modules.push(module);

            if (lazyPlugins.length) {
                var loadManager = module.getLoadManager();

                for (i = 0; i < lazyPlugins.length; i++) {
                    var pluginName = lazyPlugins[i].name;
                    var fileName = lazyPlugins[i].file;

                    if (!fileName.match(/^\^/)) {
                        fileName = "^" + fileName;
                    }
                    (function(fileName, pluginName) {
                        loadManager.loadFile(fileName, function () {
                            module.addPlugin(pluginName);
                        });
                    })(fileName, pluginName);
                }
            }

            return module.getAPI();
        },

        /**
         * Loads module if it wasn't loaded earlier
         *
         * @memberOf Subclass
         *
         * @param {string} moduleFileName
         * @param {Function} callback
         * @returns {XMLHttpRequest}
         */
        loadModule: function(moduleFileName, callback)
        {
            return Subclass.Tools.loadJS(moduleFileName, callback);
        },

        /**
         * Returns public API for the module with specified name
         *
         * @param {string} moduleName
         *      A name of module which you want to receive
         *
         * @returns {Subclass.ModuleAPI}
         * @memberOf Subclass
         * @static
         */
        getModule: function(moduleName)
        {
            if (!this.issetModule(moduleName)) {
                Subclass.Error.create('Trying to get non existent module "' + moduleName + '".');
            }
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i].getName() == moduleName) {
                    return _modules[i].getAPI();
                }
            }
        },

        /**
         * Checks whether module with specified name exists
         *
         * @param {string} moduleName
         *      A module name that you want to check whether it exists
         *
         * @returns {boolean}
         * @memberOf Subclass
         * @static
         */
        issetModule: function(moduleName)
        {
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i].getName() == moduleName) {
                    return true;
                }
            }
            return false;
        }
    };
})();