/**
 * @namespace
 */
Subclass.Event = {};

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
    function Event(eventName, context)
    {
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the event name", false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        if (!context) {
            context = {};
        }

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

        /**
         * Default event listener which invokes in the least
         *
         * @type {null|function}
         * @private
         */
        this._defaultListener = null;
    }

    Event.prototype = {

        /**
         * Returns name of event
         *
         * @method getName
         * @memberOf Subclass.Event.Event.prototype
         *
         * @returns {string}
         */
        getName: function()
        {
            return this._name;
        },

        /**
         * Returns event context for event listeners
         *
         * @method getContext
         * @memberOf Subclass.Event.Event.prototype
         *
         * @returns {Object}
         */
        getContext: function()
        {
            return this._context;
        },

        /**
         * Sets default event listener which will be invoked in the least
         *
         * @param {function} listener
         * @returns {Subclass.Event.Event}
         */
        setDefaultListener: function(listener)
        {
            if (typeof listener != 'function') {
                Subclass.Error.create('InvalidArgument')
                    .argument('the default event listener', false)
                    .expected('a function')
                    .received(listener)
                    .apply()
                ;
            }
            this._defaultListener = listener;

            return this;
        },

        /**
         * Returns default event listener
         *
         * @returns {null|Function}
         */
        getDefaultListener: function()
        {
            return this._defaultListener;
        },

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
        addListener: function(priority, callback)
        {
            var listener = Subclass.Tools.createClassInstance(Subclass.Event.EventListener,
                priority,
                callback
            );
            this._listeners.push(listener);

            return this;
        },

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
        removeListener: function(callback)
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
        },

        /**
         * Removes all listeners
         */
        removeListeners: function()
        {
            this._listeners = [];
        },

        /**
         * Returns all registered event listeners
         *
         * @method getListeners
         * @memberOf Subclass.Event.Event.prototype
         *
         * @returns {Object.<Subclass.Event.EventListener>}
         */
        getListeners: function()
        {
            return this._listeners;
        },

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
        getListenerByCallback: function(callback)
        {
            if (!callback || typeof callback != 'Function') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the callback", false)
                    .received(callback)
                    .expected('a function')
                    .apply()
                ;
            }
            var listeners = this.getListeners();

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].getCallback() == callback) {
                    return listeners[i];
                }
            }
            return null;
        },

        /**
         * Checks whether current event contains any listeners
         *
         * @method hasListeners
         * @memberOf Subclass.Event.Event.prototype
         *
         * @return {boolean}
         */
        hasListeners: function()
        {
            return !!this.getListeners().length;
        },

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
         * @returns {Subclass.Event.EventData}
         */
        trigger: function()
        {
            var listeners = this.getListeners();

            return this._processTrigger(listeners, arguments);
        },

        /**
         * Invokes event listeners
         *
         * @method _processTriggger
         *
         * @param {Array.<Subclass.Event.EventListener>} listeners
         *      An array of event listeners
         *
         * @param {Array} listenerArgs
         *      Arguments which will be transferred to each even listener callback function
         *
         * @returns {Subclass.Event.EventData}
         * @private
         * @ignore
         */
        _processTrigger: function(listeners, listenerArgs)
        {
            var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
            var eventData = Subclass.Tools.createClassInstance(Subclass.Event.EventData, this, this.getContext());
            var context = this.getContext();
            var args = [eventData];
            var priorities = [];

            for (var k = 0; k < listenerArgs.length; k++) {
                args.push(listenerArgs[k]);
            }

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

            loop: for (i = 0; i < priorities.length; i++) {
                for (var j = 0; j < listeners.length; j++) {
                    listener = listeners[j];

                    if (!listener[uniqueFieldName] && listener.getPriority() == priorities[i]) {
                        listener[uniqueFieldName] = true;

                        var result = listener.getCallback().apply(context, args);
                        eventData.addResult(result);

                        if (eventData.isPropagationStopped()) {
                            break loop;
                        }
                    }
                }
            }

            // Invoking default event listener

            if (
                this.getDefaultListener()
                && !eventData.isPropagationStopped()
                && !eventData.isDefaultPrevented()
            ) {
                this.getDefaultListener().apply(context, args);
            }

            // Removing helper fields from listeners

            for (i = 0; i < listeners.length; i++) {
                listener = listeners[i];
                delete listener[uniqueFieldName];
            }

            return eventData;
        }
    };

    return Event;

})();