/**
 * @class
 * @constructor
 * @description
 *
 * This class contains all needed API to manipulation with classes,
 * services, parameters, services, events and module configuration.
 *
 * @param {Subclass.Module} module
 *      An instance of module that will provide public API
 */
Subclass.ModuleAPI = (function()
{
    /**
     * @alias Subclass.ModuleAPI
     */
    function ModuleAPI(module)
    {
        /**
         * Module instance
         *
         * @type {Subclass.Module}
         */
        this._module = module;
    }

    /**
     * Returns module instance
     *
     * @method getModule
     * @memberOf Subclass.ModuleAPI.prototype
     *
     * @returns {Subclass.Module}
     */
    ModuleAPI.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * The same as the {@link Subclass.Module#getName}
     *
     * @method getName
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getName = function()
    {
        return this.getModule().getName.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#addPlugin}
     *
     * @method addPlugin
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.addPlugin = function()
    {
        return this.getModule().addPlugin.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.ClassManager#getClass}
     *
     * @method getClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getClass = function()
    {
        return this.getModule().getClassManager().getClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#issetClass}
     *
     * @method issetClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.issetClass = function()
    {
        return this.getModule().getClassManager().issetClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#buildClass}
     *
     * @method buildClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.buildClass = function()
    {
        return this.getModule().getClassManager().buildClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#alterClass}
     *
     * @method alterClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.alterClass = function()
    {
        return this.getModule().getClassManager().alterClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#copyClass}
     *
     * @method alterClass
     * @memberOf Subclass.ModuleAPI.prototype
     *
     * @returns {Subclass.Class.ClassType}
     */
    ModuleAPI.prototype.copyClass = function()
    {
        return this.getModule().getClassManager().copyClass.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.Module#onReady}
     *
     * @method onReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onReady = function()
    {
        return this.getModule().onReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#triggerOnReady}
     *
     * @method triggerOnReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.triggerOnReady = function()
    {
        return this.getModule().triggerOnReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isReady}
     *
     * @method isReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isReady = function()
    {
        return this.getModule().isReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#setConfigs}
     *
     * @method setConfigs
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.setConfigs = function()
    {
        return this.getModule().setConfigs.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getConfigManager}
     *
     * @method getConfigManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getConfigManager = function()
    {
        return this.getModule().getConfigManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getEventManager}
     *
     * @method getEventManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getEventManager = function()
    {
        return this.getModule().getEventManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getLoadManager}
     *
     * @method getLoadManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getLoadManager = function()
    {
        return this.getModule().getLoadManager.apply(this.getModule(), arguments);
    };
    //
    ///**
    // * The same as the {@link Subclass.Module#getPropertyManager}
    // *
    // * @method getPropertyManager
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.getPropertyManager = function()
    //{
    //    return this.getModule().getPropertyManager.apply(this.getModule(), arguments);
    //};

    /**
     * The same as the {@link Subclass.Module#getClassManager}
     *
     * @method getClassManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getClassManager = function()
    {
        return this.getModule().getClassManager.apply(this.getModule(), arguments);
    };
    //
    ///**
    // * The same as the {@link Subclass.Module#getServiceManager}
    // *
    // * @method getServiceManager
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.getServiceManager = function()
    //{
    //    return this.getModule().getServiceManager.apply(this.getModule(), arguments);
    //};
    //
    ///**
    // * The same as the {@link Subclass.Module#getParameterManager}
    // *
    // * @method getParameterManager
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.getParameterManager = function()
    //{
    //    return this.getModule().getParameterManager.apply(this.getModule(), arguments);
    //};
    //
    ///**
    // * The same as the {@link Subclass.Service.ServiceManager#registerService}
    // *
    // * @method registerService
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.registerService = function()
    //{
    //    return this.getModule().getServiceManager().registerService.apply(
    //        this.getModule().getServiceManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.ConfigManager#setServices}
    // *
    // * @method registerServices
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.registerServices = function()
    //{
    //    return this.getModule().getConfigManager().setServices.apply(
    //        this.getModule().getConfigManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.Service.ServiceManager#getService}
    // *
    // * @method getService
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.getService = function()
    //{
    //    return this.getModule().getServiceManager().getService.apply(
    //        this.getModule().getServiceManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.Parameter.ParameterManager#registerParameter}
    // *
    // * @method registerService
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.registerParameter = function()
    //{
    //    return this.getModule().getParameterManager().registerParameter.apply(
    //        this.getModule().getParameterManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.ConfigManager#setParameters}
    // *
    // * @method registerParameters
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.registerParameters = function()
    //{
    //    return this.getModule().getConfigManager().setParameters.apply(
    //        this.getModule().getConfigManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.Parameter.ParameterManager#setParameter}
    // *
    // * @method setParameter
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.setParameter = function()
    //{
    //    return this.getModule().getParameterManager().setParameter.apply(
    //        this.getModule().getParameterManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.Parameter.ParameterManager#getParameter}
    // *
    // * @method getParameter
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.getParameter = function(parameterName)
    //{
    //    return this.getModule().getParameterManager().getParameter.apply(
    //        this.getModule().getParameterManager(),
    //        arguments
    //    );
    //};
    //
    ///**
    // * The same as the {@link Subclass.ConfigManager#setDataTypes}
    // *
    // * @method registerDataTypes
    // * @memberOf Subclass.ModuleAPI.prototype
    // */
    //ModuleAPI.prototype.registerDataTypes = function()
    //{
    //    return this.getModule().getConfigManager().setDataTypes.apply(
    //        this.getModule().getConfigManager(),
    //        arguments
    //    );
    //};

    /**
     * The same as the {@link Subclass.Module#getRoot}
     *
     * @method getRootModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getRootModule = function()
    {
        return this.getModule().getRoot.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isRoot}
     *
     * @method isRootModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isRootModule = function()
    {
        return this.getModule().isRoot.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getParent}
     *
     * @method getParentModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getParentModule = function()
    {
        var parent = this.getModule().getParent.apply(this.getModule(), arguments);

        if (parent == this.getModule()) {
            parent = null;
        }
        return parent;
    };

    return ModuleAPI;

})();