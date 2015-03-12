/**
 * @class
 * @extends {Subclass.Event.Event}
 */
Subclass.ModuleEvent = function()
{
    function ModuleEvent(eventManager, eventName, context)
    {
        ModuleEvent.$parent.apply(this, arguments);

        if (!eventManager || !(eventManager instanceof Subclass.Event.EventManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the event manager instance", false)
                .received(eventManager)
                .expected('an instance of "Subclass.Event.EventManager"')
                .apply()
            ;
        }

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         * @private
         */
        this._eventManager = eventManager;
    }

    ModuleEvent.$parent = Subclass.Event.Event;

    /**
     * Returns event manager instance
     *
     * @method getEventManager
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @returns {Subclass.Event.EventManager}
     */
    ModuleEvent.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns all registered event listeners
     *
     * @method getListeners
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @param {boolean} [privateListeners = false]
     *      If passed true it returns event listeners only from event instance from current module
     *      without listeners from its plug-in module events with the same name.
     *
     * @returns {Object.<Subclass.Event.EventListener>}
     */
    ModuleEvent.prototype.getListeners = function(privateListeners)
    {
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var listeners = [];
        var $this = this;

        if (privateListeners !== true) {
            privateListeners = false;
        }
        if (privateListeners) {
            return this._listeners;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(listeners, $this._listeners);
                return;
            }
            var moduleEventManager = module.getEventManager();
            var moduleEventListeners = moduleEventManager.getEvent($this.getName()).getListeners();

            Subclass.Tools.extend(listeners, moduleEventListeners);
        });

        return Subclass.Tools.unique(listeners);
    };

    /**
     * Returns event listener by specified callback function
     *
     * @method getListenerByCallback
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not a function callback
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
     * @returns {(Subclass.Event.EventListener|null)}
     */
    ModuleEvent.prototype.getListenerByCallback = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var listener = null;
        var $this = this;

        moduleStorage.eachModule(function(module) {
            var moduleEventManager = module.getEventManager();
            var moduleEvent = moduleEventManager.getEvent($this.getName());
            var listeners = moduleEvent.getListeners(true);

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].getCallback() == callback) {
                    listener = listeners[i];
                    return false;
                }
            }
        });

        return listener;
    };

    /**
     * @inheritDoc
     */
    ModuleEvent.prototype.removeListener = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var $this = this;

        moduleStorage.eachModule(function(module) {
            var moduleEventManager = module.getEventManager();
            var moduleEvent = moduleEventManager.getEvent($this.getName());
            var listeners = moduleEvent.getListeners(true);
            var listenerIndex = listeners.indexOf(callback);

            if (listenerIndex >= 0) {
                listeners.splice(listenerIndex, 1);
            }
        });

        return this;
    };

    /**
     * Invokes event listeners only from module to which event with specified name belongs to.<br /><br />
     *
     * Will be invoked all listener callback functions only from
     * current module (without plug-ins) event.<br /><br />
     *
     * Each event listener callback function will receive as arguments all arguments from current method call.
     * If listener callback function returns false then it will bring to stop propagation of event.
     *
     * @method triggerPrivate
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @param [arguments]
     *      Any number of any needed arguments
     *
     * @returns {Subclass.Event.Event}
     */
    ModuleEvent.prototype.triggerPrivate = function()
    {
        var listeners = this.getListeners(true);

        return this._processTrigger(listeners, arguments);
    };

    return ModuleEvent;
}();