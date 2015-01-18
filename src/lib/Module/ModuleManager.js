/**
 * @class
 * @constructor
 * @description
 *
 * Class that manages all plug-in and a root modules.<br /><br />
 *
 * The goal of manager is hold links to all module plug-ins and sort out them
 * and a root module by specific callback function in order
 * as they were attached to the root module.
 *
 * @param {Subclass.Module.Module} module
 *      An instance of module
 *
 * @param {string[]} dependencyModuleNames
 *      Array of plug-in module names
 */
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
        this._modules = this._processModules(dependencyModuleNames);
        this._modules.unshift(module);
    }

    /**
     * Returns main module instance (the module to
     * which belongs current instance of module manager)
     *
     * @method getMainModule
     * @memberOf Subclass.Module.ModuleManager.prototype
     * @returns {Subclass.Module.Module}
     */
    ModuleManager.prototype.getMainModule = function()
    {
        return this._module;
    };

    /**
     * Returns array with all module instances (including main module)
     *
     * @method getModules
     * @memberOf Subclass.Module.ModuleManager.prototype
     * @returns {Array.<Subclass.Module.Module>}
     */
    ModuleManager.prototype.getModules = function()
    {
        return this._modules;
    };

    /**
     * Normalizes dependency modules
     *
     * @method _processModules
     *
     * @throws {Error}
     *      Throws error if specified in dependencies module that is not a plugin.
     *
     * @param {string[]} moduleNames
     *      Array of module names. Each module should be marked as a plugin
     *      (by the "plugin" or "pluginOf" configuration parameters)
     *
     * @returns {Array.<Subclass.Module.Module>}
     * @private
     */
    ModuleManager.prototype._processModules = function(moduleNames)
    {
        var mainModule = this.getMainModule();
        var modules = [];

        for (var i = 0; i < moduleNames.length; i++) {
            var childModule = Subclass.getModule(moduleNames[i]).getModule();
            var childModuleConfigs = childModule.getConfigManager();

            if (!childModuleConfigs.isPlugin()) {
                throw new Error('Specified in dependencies module "' + moduleNames[i] + '" that is not a plugin.');
            }
            childModule.setParent(mainModule);
            modules.push(childModule);
        }

        return modules;
    };

    /**
     * Adds new dependency module
     *
     * @param {string} moduleName
     *      The name of dependency module
     */
    ModuleManager.prototype.addDependency = function(moduleName)
    {
        var processedModule = this._processModules([moduleName]);
        this._modules.push(processedModule[0]);
    };

    /**
     * Returns all module dependencies (plug-in modules)
     *
     * @method getDependencies
     * @memberOf Subclass.Module.ModuleManager.prototype
     * @returns {Array.<Subclass.Module.Module>}
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
     * Sorts out each module by specified callback
     *
     * @method eachModule
     * @memberOf Subclass.Module.ModuleManager.prototype
     *
     * @param {boolean} [reverse]
     *      Optional parameter which allows to sort out modules in a reverse order
     *
     * @param {Function} callback
     *      Callback function which will perform each module in the sor ordering process.<br /><br />
     *
     *      Function will receive two arguments:<br />
     *      - the first one is an instance of module;<br />
     *      - the second one is a module name.<br /><br />
     *
     *      If callback function returns false, the sorting out will break.
     *
     * @example
     * ...
     *
     * var moduleManager = moduleInst.getModuleManager();
     *
     * moduleManager.eachModule(function(module, moduleName) {
     *     // some manipulations
     *     ...
     *
     *     if (moduleName == 'app') {  // or any other condition
     *         return false;           // breaks sort ordering. The rest modules
     *                                 // will not processed by this function
     *     }
     * });
     * ...
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
            if (callback(modules[i], modules[i].getName()) === false) {
                break;
            }
        }
    };

    return ModuleManager;

})();