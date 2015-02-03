/**
 * @class
 * @constructor
 * @description
 *
 * Instance of current class is an object of event which holds
 * information about its name, context and listeners, can manipulate
 * by listeners (add, get, remove) and perform registered listener
 * callbacks in order according to its priorities.
 *
 * @throws {Error}
 *      Throws error if:<br />
 *      - was specified invalid event manager argument;<br />
 *      - was missed event name or it's not a string.
 *
 * @param {Subclass.Event.EventManager} eventManager
 *      Instance of event manager
 *
 * @param {string} eventName
 *      The name of the creating event
 *
 * @param {Object} [context={}]
 *      An any object which link on it will be held
 *      in "this" variable inside every registered
 *      listener of current event.
 */
Subclass.Event.Event = (function()
{
    /**
     * @alias Subclass.Event.Event
     */
    function Event(eventManager, eventName, context)
    {
        if (!eventManager || !(eventManager instanceof Subclass.Event.EventManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument("event manager", false)
                .received(eventManager)
                .expected('an instance of "Subclass.Event.EventManager"')
                .apply()
            ;
        }
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("name of event", false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        if (!context) {
            context = {};
        }

        /**
         * Event manager instance
         *
         * @type {Subclass.Event.EventManager}
         * @private
         */
        this._eventManager = eventManager;

        /**
         * Name of the event
         *
         * @type {string}
         * @private
         */
        this._name = eventName;

        /**
         * Context of the event listeners
         * (i.e. what will inside "this" variable inside of event listeners)
         *
         * @type {Object}
         * @private
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
     * @method getEventManager
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {Subclass.Event.EventManager}
     */
    Event.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns name of event
     *
     * @method getName
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {string}
     */
    Event.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns event context for event listeners
     *
     * @method getContext
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {Object}
     */
    Event.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Registers new listener to the event.<br /><br />
     * Creates instance of {@link Subclass.Event.EventListener}
     *
     * @method addListener
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {(number|Function)} [priority]
     *      Event listener invoke priority
     *
     * @param {Function} callback
     *      Event listener callback function which will be invoked when event triggers.
     *
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.addListener = function(priority, callback)
    {
        var listener = new Subclass.Event.EventListener(priority, callback);
        this._listeners.push(listener);

        return this;
    };

    /**
     * Removes specified event listener by its callback function
     *
     * @method removeListener
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
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
     * Returns event listener by specified callback function
     *
     * @method getListenerByCallback
     * @memberOf Subclass.Event.Event.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not a function callback
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
     * @returns {(Subclass.Event.EventListener|null)}
     */
    Event.prototype.getListenerByCallback = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("callback")
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
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
     * Returns all registered event listeners
     *
     * @method getListeners
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {boolean} [privateListeners = false]
     *      If passed true it returns event listeners only from event instance from current module
     *      without listeners from its plug-in module events with the same name.
     *
     * @returns {Object.<Subclass.Event.EventListener>}
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
     * @method hasListeners
     * @memberOf Subclass.Event.Event.prototype
     *
     * @return {boolean}
     */
    Event.prototype.hasListeners = function()
    {
        return !!this.getListeners().length;
    };

    /**
     * Invokes all registered event listeners at order of descending its priorities.
     * The greater priority - the earlier event listener will invoked.<br /><br />
     *
     * Will be invoked all listener callback functions from all modules (from current
     * module and its plug-ins) of the event with name of current event.<br /><br />
     *
     * Each event listener callback function will receive as arguments all arguments from current method call.
     * If listener callback function returns false then it will bring to stop propagation of event.
     *
     * @method trigger
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param [arguments]
     *      Any number of any needed arguments
     *
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.trigger = function()
    {
        var listeners = this.getListeners();

        return this._processTrigger(listeners, arguments)
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
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param [arguments]
     *      Any number of any needed arguments
     *
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.triggerPrivate = function()
    {
        var listeners = this.getListeners(true);

        return this._processTrigger(listeners, arguments);
    };

    /**
     * Invokes event listeners
     *
     * @method _processTriggger
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {Array.<Subclass.Event.EventListener>} listeners
     *      An array of event listeners
     *
     * @param {Array} listenerArgs
     *      Arguments which will be transferred to each even listener callback function
     *
     * @returns {Subclass.Event.Event}
     * @private
     * @ignore
     */
    Event.prototype._processTrigger = function(listeners, listenerArgs)
    {
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var priorities = [];

        // Preparing event listeners

        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            priorities.push(listener.getPriority());
            listener[uniqueFieldName] = false;
        }

        // Sorting priorities in descending order

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        // Invoking event listener callback function in order with priorities

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

        // Removing helper fields from listeners

        for (i = 0; i < listeners.length; i++) {
            listener = listeners[i];
            delete listener[uniqueFieldName];
        }

        return this;
    };

    return Event;

})();