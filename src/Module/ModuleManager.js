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
 * @param {string[]} pluginModuleNames
 *      Array of plug-in module names
 *
 * @param {string[]} lazyModuleNames
 *      Array of plug-in module names which are in loading process at the moment
 */
Subclass.Module.ModuleManager = (function()
{
    function ModuleManager(module, pluginModuleNames)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument("module", false)
                .received(module)
                .expected('an instance of "Subclass.Module.Module"')
                .apply()
            ;
        }
        if (pluginModuleNames && !Array.isArray(pluginModuleNames)) {
            Subclass.Error.create('InvalidArgument')
                .argument("list of plug-in module names", false)
                .received(pluginModuleNames)
                .expected('an array of plug-in module names')
                .apply()
            ;
        } else if (!pluginModuleNames) {
            pluginModuleNames = [];
        }

        // Selecting lazy modules

        var lazyModuleNames = {};

        for (var i = 0, j = 0; i < pluginModuleNames.length; i++, j++) {
            if (typeof pluginModuleNames[i] == 'object') {
                lazyModuleNames[pluginModuleNames[i].name] = j;
                pluginModuleNames.splice(i, 1);
                i--;
            }
        }

        /**
         * Main module instance
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

        /**
         * Collection with current module and its plug-in modules
         *
         * @type {Array.<Subclass.Module.Module>}
         */
        this._modules = this._processModules(pluginModuleNames);
        this._modules.unshift(module);

        /**
         * The list of module names that are loading at the moment
         * When each of lazy modules will be loaded, it will be removed from current array.
         *
         * @type {string[]}
         */
        this._lazyModules = lazyModuleNames;
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
     * Returns the list of all lazy plug-in modules
     *
     * @method getLazyModules
     * @memberOf Subclass.Module.ModuleManager.prototype
     * @returns {string[]}
     */
    ModuleManager.prototype.getLazyModules = function()
    {
        return this._lazyModules;
    };

    /**
     * Checks whether module with specified name is lazy
     *
     * @mthod issetLazyModule
     * @memberOf Subclass.Module.ModuleManager.prototype
     *
     * @param {string} moduleName
     *      A name of lazy module
     *
     * @returns {boolean}
     */
    ModuleManager.prototype.issetLazyModule = function(moduleName)
    {
        return !!this.getLazyModules().hasOwnProperty(moduleName);
    };

    /**
     * Reports whether current module has lazy plug-in modules
     *
     * @returns {boolean}
     */
    ModuleManager.prototype.hasLazyModules = function()
    {
        return !!Object.keys(this.getLazyModules()).length;
    };

    ModuleManager.prototype.resolveLazyModule = function(moduleName)
    {
        if (!this.issetLazyModule(moduleName)) {
            return;
        }
        delete this.getLazyModules()[moduleName];
    };

    /**
     * Normalizes plugin modules
     *
     * @method _processModules
     *
     * @throws {Error}
     *      Throws error if specified in plugins module that is not a plugin.
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
                Subclass.Error.create(
                    'Specified in plugins module "' + moduleNames[i] + '" ' +
                    'that is not a plugin.'
                );
            }
            childModule.setParent(mainModule);
            modules.push(childModule);
        }

        return modules;
    };

    /**
     * Adds new plugin module
     *
     * @param {string} moduleName
     *      The name of plug-in module
     */
    ModuleManager.prototype.addPlugin = function(moduleName)
    {
        var processedModule = this._processModules([moduleName])[0];

        if (this.issetLazyModule(moduleName)) {
            var lazyModuleIndex = parseInt(this.getLazyModules()[moduleName]) + 1;
            this._modules.splice(lazyModuleIndex, 0, processedModule)

        } else {
            this._modules.push(processedModule);
        }
    };

    /**
     * Returns all module plug-ins
     *
     * @method getPlugins
     * @memberOf Subclass.Module.ModuleManager.prototype
     * @returns {Array.<Subclass.Module.Module>}
     */
    ModuleManager.prototype.getPlugins = function()
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