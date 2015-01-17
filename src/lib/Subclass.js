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
     * @type {Array.<Subclass.Module.Module>}
     * @private
     */
    var _modules = [];

    return {

        /**
         * Creates new subclass module.<br /><br />
         *
         * Creates instance of {@link Subclass.Module.Module}
         *
         * @param {string} moduleName
         *      A name of the future module
         *
         * @param {Array} [moduleDependencies]
         *      The names of the modules that you want to include to the current module
         *      or if dependency modules are not loaded at the moment it should be
         *      objects like: { name: "depModuleName", file: "file/of/module.js" }
         *
         * @param {Object} [moduleConfigs = {}]
         *      A configuration of the creating module
         *
         * @returns {Subclass.Module.ModuleAPI}
         * @memberOf Subclass
         * @static
         *
         * @example
         * ...
         *
         * // The simplest way to create module
         * var app = Subclass.createModule("app");
         *
         * // Creating module with configuration and without dependencies
         * var app = Subclass.createModule("app", {
         *      // Optional module configuration
         * });
         *
         * // Creating module with dependencies which are loaded to the document at the moment
         * var app = Subclass.createModule("app", ["plugin1", "plugin2"], {
         *      // Optional module configuration
         * });
         *
         * // Creating module with dependencies which are not loaded to the document at the moment
         * var app = Subclass.createModule("app", [
         *      {
         *          name: "plugin1",
         *          file: "file/of/plugin1.js"
         *      }, {
         *          name: "plugin2",
         *          files: [
         *              "path/to/file_1/of/plugin2.js",
         *              "path/to/file_2/of/plugin2.js"
         *          ]
         *      }
         * ], {
         *      // Optional module configuration
         * });
         *
         * // Creating module with loaded and not loaded dependencies to the document at the moment
         * var app = Subclass.createModule("app", [
         *      plugin1,
         *      plugin2,
         *      {
         *          name: "plugin3",
         *          file: "path/to/file/of/plugin3.js"
         *      }, {
         *          name: "plugin4",
         *          files: [
         *              "path/to/file_1/of/plugin4.js",
         *              "path/to/file_2/of/plugin4.js"
         *          ]
         *      }
         * ], {
         *      // Optional module configuration
         * });
         */
        createModule: function(moduleName, moduleDependencies, moduleConfigs)
        {
            if (Subclass.Tools.isPlainObject(moduleDependencies)) {
                moduleConfigs = moduleDependencies;
                moduleDependencies = [];
            }
            if (!moduleDependencies) {
                moduleDependencies = [];
            }

            // If for registering module exists plugins

            for (var i = 0; i < _modules.length; i++) {
                var registeredModuleName = _modules[i].getName();
                var pluginOf = _modules[i].getConfigManager().getPluginOf();

                if (pluginOf == moduleName) {
                    moduleDependencies.push(registeredModuleName);
                }
            }

            moduleDependencies = Subclass.Tools.unique(moduleDependencies);
            //var deleteDependencies = [];
            //var dependencyFiles = {};

            //function addDependencyFile(depModuleName, fileName) {
            //    if (!dependencyFiles[depModuleName]) {
            //        dependencyFiles[depModuleName] = [];
            //    }
            //    dependencyFiles[depModuleName].push(fileName);
            //}
            //
            //function throwInvalidDependencyDef(optName, optType) {
            //    throw new Error(
            //        'Specified invalid dependency module definition while creating module "' + moduleName + '". ' +
            //        'The required option "' + optName + '" was missed or is not ' + optType + '.'
            //    );
            //}
            //
            //for (i = 0; i < moduleDependencies.length; i++) {
            //    if (Subclass.Tools.isPlainObject(moduleDependencies[i])) {
            //        var moduleDef = moduleDependencies[i];
            //        deleteDependencies.push(i);
            //
            //        if (!moduleDef.name || typeof moduleDef.name != 'string') {
            //            throwInvalidDependencyDef('name', 'a string');
            //
            //        } else if (Subclass.issetModule(moduleDef.name)) {
            //            continue;
            //        }
            //        if ((!moduleDef.files || !Array.isArray(moduleDef.files)) && !moduleDef.hasOwnProperty('file')) {
            //            throwInvalidDependencyDef('files', 'an array with strings');
            //        }
            //        if ((!moduleDef.file || typeof moduleDef.file != 'string') && !moduleDef.hasOwnProperty('files')) {
            //            throwInvalidDependencyDef('file', 'a string');
            //        }
            //        if (moduleDef.files) {
            //            for (i = 0; i < moduleDef.files.length; i++) {
            //                addDependencyFile(moduleDef.name, moduleDef.files[i]);
            //            }
            //        }
            //        if (moduleDef.file) {
            //            addDependencyFile(moduleDef.name, moduleDef.file);
            //        }
            //    }
            //}
            //
            //deleteDependencies.sort();
            //
            //for (i = 0; i < deleteDependencies.length; i++) {
            //    var index = deleteDependencies[i];
            //    moduleDependencies.splice(index - i, 1);
            //}
            //
            //dependencyFiles = Subclass.Tools.unique(dependencyFiles);

            // Creating instance of module

            var module = new Subclass.Module.Module(
                moduleName,
                moduleDependencies,
                moduleConfigs
            );
            _modules.push(module);

            //if (dependencyFiles.length) {
            //    for (var depModuleName in dependencyFiles) {
            //        if (!dependencyFiles.hasOwnProperty(depModuleName)) {
            //            continue;
            //        }
            //        var depModuleFiles = dependencyFiles[depModuleName];
            //
            //        (function(moduleName, moduleFiles) {
            //            Subclass.Tools.loadJS(moduleFiles.shift(), function loadCallback()
            //            {
            //                if (Subclass.Tools.isEmpty(moduleFiles)) {
            //                    //module.addPlugin(moduleName);
            //
            //                } else {
            //                    return Subclass.Tools.loadJS(
            //                        moduleFiles.shift(),
            //                        loadCallback
            //                    );
            //                }
            //            });
            //        })(depModuleName, depModuleFiles);
            //    }
            //}

            return module.getAPI();
        },

        /**
         * Returns public API for the module with specified name
         *
         * @param {string} moduleName
         *      A name of module which you want to receive
         *
         * @returns {Subclass.Module.ModuleAPI}
         * @memberOf Subclass
         * @static
         */
        getModule: function(moduleName)
        {
            if (!this.issetModule(moduleName)) {
                throw new Error('Trying to get non existent module "' + moduleName + '".');
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