/**
 * @class
 * @constructor
 * @description
 *
 * This class contains all needed API to manipulation with module
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

        /**
         * Module api events
         *
         * @type {Array}
         * @private
         */
        this._events = [];


        // Initialization operations

        this.registerEvent('onInitialize');
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    }

    ModuleAPI.$parent = Subclass.Extendable;

    ModuleAPI.$mixins = [Subclass.Event.EventableMixin];

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
     * The same as the {@link Subclass.ClassManager#get}
     *
     * @method getClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getClass = function()
    {
        return this.getModule().getClassManager().get.apply(
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
        return this.getModule().getClassManager().isset.apply(
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
        return this.getModule().getClassManager().build.apply(
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
        return this.getModule().getClassManager().alter.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#copy}
     *
     * @method copyClass
     * @memberOf Subclass.ModuleAPI.prototype
     *
     * @returns {Subclass.Class.ClassType}
     */
    ModuleAPI.prototype.copyClass = function()
    {
        return this.getModule().getClassManager().copy.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.Module#onSetup}
     *
     * @method onSetup
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onSetup = function()
    {
        return this.getModule().onSetup.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#triggerOnSetup}
     *
     * @method triggerOnSetup
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.triggerOnSetup = function()
    {
        return this.getModule().triggerOnSetup.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isSetupped}
     *
     * @method isSetupped
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isSetupped = function()
    {
        return this.getModule().isSetupped.apply(this.getModule(), arguments);
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
     * The same as the {@link Subclass.Module#setSettings}
     *
     * @method setSettings
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.setSettings = function()
    {
        return this.getModule().setSettings.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getSettingsManager}
     *
     * @method getSettingsManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getSettingsManager = function()
    {
        return this.getModule().getSettingsManager.apply(this.getModule(), arguments);
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

    /**
     * The same as the {@link Subclass.Module#getModuleStorage}
     *
     * @method getModuleStorage
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getModuleStorage = function()
    {
        return this.getModule().getModuleStorage.apply(this.getModule(), arguments);
    };

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