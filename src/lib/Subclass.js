window.Subclass = (function()
{
    /**
     * Collection of registered modules
     *
     * @type {{}}
     * @private
     */
    var _modules = {};

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
            return _modules[moduleName] = new Subclass.Module.Module(
                moduleName,
                moduleDependencies,
                moduleConfigs
            );
        },

        /**
         * Returns subclass module
         *
         * @param {string} moduleName
         */
        getModule: function(moduleName)
        {
            if (!this.issetModule(moduleName)) {
                throw new Error('Trying to get non existent module "' + moduleName + '".');
            }
            return _modules[moduleName];
        },

        /**
         * Checks whether module with passed name exists
         *
         * @param {string} moduleName
         */
        issetModule: function(moduleName)
        {
            return !!_modules[moduleName];
        }
    };
})();

/**
 * @TODO добавить возможность подключать к одному модулю другие модули
 */