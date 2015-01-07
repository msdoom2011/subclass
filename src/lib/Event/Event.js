/**
 * @class
 */
Subclass.Event.Event = (function()
{
    /**
     * @param {Subclass.Event.EventManager} eventManager
     * @param {string} eventName
     * @param {Object} context
     * @constructor
     */
    function Event(eventManager, eventName, context)
    {
        if (!eventManager || !(eventManager instanceof Subclass.Event.EventManager)) {
            throw new Error('Invalid eventManager argumetn. It must be instance of "Subclass.Event.EventManager".');
        }
        if (!eventName) {
            throw new Error('Missed required argument "name" in Subclass.Event.Event constructor.');
        }
        if (!context) {
            context = {};
        }

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         */
        this._eventManager = eventManager;

        /**
         * Name of the event
         *
         * @type {string}
         */
        this._name = eventName;

        /**
         * Context of the event listeners
         * (i.e. what will inside "this" variable inside of event listeners)
         *
         * @type {Object}
         */
        this._context = context;

        /**
         * Array of event listeners
         *
         * @type {Array.<Subclass.Event.EventListener>}
         * @private
         */
        this._listeners = [];
    }

    /**
     * Returns event manager instance
     *
     * @returns {Subclass.Event.EventManager}
     */
    Event.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns event name
     *
     * @returns {string}
     */
    Event.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns event listeners context
     *
     * @returns {Object}
     */
    Event.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Adds new event listener
     *
     * @param {(number|Function)} [priority]
     * @param {Function} [callback]
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.addListener = function(priority, callback)
    {
        var listener = new Subclass.Event.EventListener(priority, callback);
        this._listeners.push(listener);

        return this;
    };

    /**
     * Removes specified event listener by its callback
     *
     * @param {Function} callback
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.removeListener = function(callback)
    {
        var listener = this.getListenerByCallback(callback);

        if (!listener) {
            return this;
        }

        var listeners = this.getListeners();
        var listenerIndex = listeners.indexOf(listener);

        if (listenerIndex >= 0) {
            listeners.splice(listenerIndex, 1);
        }

        return this;
    };

    /**
     * Returns event listener by specified callback
     *
     * @param {Function} callback
     * @returns {(Subclass.Event.EventListener|null)}
     */
    Event.prototype.getListenerByCallback = function(callback)
    {
        var mainModule = this.getEventManager().getModule();
        var moduleManager = mainModule.getModuleManager();
        var listener = null;
        var $this = this;

        moduleManager.eachModule(function(module) {
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
     * Returns all registered services
     *
     * @param {boolean} [privateListeners = false]
     *      If passed true it returns event listeners only from current module event
     *      without listeners from its dependency module events with the same name.
     *
     * @returns {Object.<Function>}
     */
    Event.prototype.getListeners = function(privateListeners)
    {
        var mainModule = this.getEventManager().getModule();
        var moduleManager = mainModule.getModuleManager();
        var listeners = [];
        var $this = this;

        if (privateListeners !== true) {
            privateListeners = false;
        }
        if (privateListeners) {
            return this._listeners;
        }

        moduleManager.eachModule(function(module) {
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
     * Checks whether current event contains any listeners
     *
     * @return {boolean}
     */
    Event.prototype.hasListeners = function()
    {
        return !!this.getListeners().length;
    };

    /**
     * Invokes event listeners
     *
     * @param [arguments] - Any number of arguments
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.trigger = function()
    {
        var listeners = this.getListeners();

        return this._processTrigger(listeners, arguments)
    };

    /**
     * Invokes event listeners only from module to which event with specified name belongs to
     *
     * @param [arguments] - Any number of arguments
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.triggerPrivate = function()
    {
        var listeners = this.getListeners(true);

        return this._processTrigger(listeners, arguments);
    };

    /**
     * Processes event listeners
     *
     * @param {Array.<Subclass.Event.EventListener>} listeners
     * @param {Array} listenerArgs
     * @returns {Subclass.Event.Event}
     * @private
     */
    Event.prototype._processTrigger = function(listeners, listenerArgs)
    {
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var priorities = [];

        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            priorities.push(listener.getPriority());
            listener[uniqueFieldName] = false;
        }

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        for (i = 0; i < priorities.length; i++) {
            for (var j = 0; j < listeners.length; j++) {
                listener = listeners[j];

                if (!listener[uniqueFieldName] && listener.getPriority() == priorities[i]) {
                    listener[uniqueFieldName] = true;

                    if (listener.getCallback().apply(listener, listenerArgs) === false) {
                        break;
                    }
                }
            }
        }

        for (i = 0; i < listeners.length; i++) {
            listener = listeners[i];
            delete listener[uniqueFieldName];
        }

        return this;
    };

    return Event;

})();