/**
 * @class
 * @name Subclass
 * @description The basic class for creating new application based on SubclassJS framework.
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
         * Creates new subclass module.
         *
         * @param {string} moduleName
         *      A name of the future module
         *
         * @param {string[]} [moduleDependencies = []]
         *      The names of the modules that you want to include into current module
         *
         * @param {Object} [moduleConfigs = {}]
         *      A configuration of the creating module
         *
         * @returns {Subclass.Module.ModuleAPI}
         * @static
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

            // Creating instance of module

            var module = new Subclass.Module.Module(
                moduleName,
                moduleDependencies,
                moduleConfigs
            );
            _modules.push(module);

            return module.getAPI();
        },

        /**
         * Returns public API for the module with specified name
         *
         * @param {string} moduleName
         *      A module name that you want to get
         *
         * @returns {Subclass.Module.ModuleAPI}
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