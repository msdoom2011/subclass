window.Subclass = (function()
{
    /**
     * Collection of registered modules
     *
     * @type {{}}
     * @private
     */
    var _modules = [];

    return {

        /**
         * Creates new subclass module.
         *
         * @param {string} moduleName
         * @param {string[]} [moduleDependencies]
         * @param {Object} [moduleConfigs]
         * @returns {Subclass.Module.Module}
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
            for (var i = 0; i < _modules.length; i++) {
                var registeredModuleName = _modules[i].getName();
                var pluginOf = _modules[i].getConfigManager().getPluginOf();

                if (pluginOf == moduleName) {
                    moduleDependencies.push(registeredModuleName);
                }
            }

            moduleDependencies = Subclass.Tools.unique(moduleDependencies);

            var module = new Subclass.Module.Module(
                moduleName,
                moduleDependencies,
                moduleConfigs
            );
            _modules.push(module);

            return module.getAPI();
        },

        /**
         * Returns subclass module API instance
         *
         * @param {string} moduleName
         * @returns {Subclass.Module.ModuleAPI}
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
            //return _modules[moduleName].getAPI();
        },

        /**
         * Checks whether module with specified name exists
         *
         * @param {string} moduleName
         * @returns {boolean}
         */
        issetModule: function(moduleName)
        {
            //return !!_modules[moduleName];

            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i].getName() == moduleName) {
                    return true;
                }
            }
            return false;
        }
    };
})();