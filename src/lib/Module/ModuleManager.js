Subclass.Module.ModuleManager = (function()
{
    function ModuleManager(module, dependencyModuleNames)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            throw new Error(
                'Specified invalid module argument. It must be instance ' +
                'of "Subclass.Module.Module".'
            );
        }
        if (dependencyModuleNames && !Array.isArray(dependencyModuleNames)) {
            throw new Error(
                'Specified invalid dependency modules argument. ' +
                'It must be array names of injecting modules.'
            );
        } else if (!dependencyModuleNames) {
            dependencyModuleNames = [];
        }

        /**
         * Main module instance
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

        /**
         * Collection with current module and its dependency modules
         *
         * @type {Array.<Subclass.Module.Module>}
         */
        this._modules = this.processModules(dependencyModuleNames);
        this._modules.unshift(module);
    }

    /**
     * Returns main module instance
     *
     * @returns {Subclass.Module.Module}
     */
    ModuleManager.prototype.getMainModule = function()
    {
        return this._module;
    };

    /**
     * Returns all modules including main module
     *
     * @returns {Array.<Subclass.Module.Module>}
     */
    ModuleManager.prototype.getModules = function()
    {
        return this._modules;
    };

    /**
     * Normalizes dependency modules
     *
     * @param {string[]} moduleNames
     * @returns {Array.<Subclass.Module.Module>}
     */
    ModuleManager.prototype.processModules = function(moduleNames)
    {
        var mainModule = this.getMainModule();
        var modules = [];

        for (var i = 0; i < moduleNames.length; i++) {
            var childModule = Subclass.getModule(moduleNames[i]);
                childModule.setParent(mainModule);

            modules.push(childModule);
        }

        return modules;
    };

    /**
     * Returns all main module dependencies
     *
     * @returns {Array}
     */
    ModuleManager.prototype.getDependencies = function()
    {
        var modules = this.getModules();
        var modulesCopy = [];

        for (var i = 0; i < modules.length; i++) {
            if (i > 0) {
                modulesCopy.push(modules[i]);
            }
        }
        return modulesCopy;
    };

    /**
     * Sorting out each module by specified callback
     *
     * @param {boolean} [reverse]
     * @param {Function} callback
     */
    ModuleManager.prototype.eachModule = function(reverse, callback)
    {
        if (typeof reverse == 'function') {
            callback = reverse;
            reverse = false;
        }
        var modules = Subclass.Tools.extend([], this.getModules());

        if (reverse) {
            modules.reverse();
        }

        for (var i = 0; i < modules.length; i++) {
            if (callback(modules[i]) === false) {
                break;
            }
        }
    };

    return ModuleManager;

})();