/**
 * @class
 * @constructor
 * @name Subclass.Event.EventableTrait
 * @extends {Subclass.Event.EventableInterface}
 */
Subclass.ClassManager.register('Trait', 'Subclass/Event/EventableTrait', {

    /**
     * Collection of registered events
     *
     * @type {Object}
     * @example
     *
     * events: {
     *      eventName: [
     *          {
     *              priority: {number},
     *              callback: {function},
     *              hash: {Object}
     *          },
     *          ...
     *      ],
     *      ...
     * }
     */
    _events: {},

    /**
     * Returns collection of registered events
     *
     * @returns {Object}
     */
    getEvents: function()
    {
        return this._events;
    },

    /**
     * @inheritDoc
     */
    registerEvent: function(eventName)
    {
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('name of event', false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        this.getEvents()[eventName] = [];

        return this;
    },

    /**
     * @inheritDoc
     */
    triggerEvent: function(eventName)
    {
        if (!this.getEvents().hasOwnProperty(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var eventListeners = this.getEvents()[eventName];
        var eventListenerArgs = [];
        var priorities = [];
        var $this = this;

        for (var i = 1; i < arguments.length; i++) {
            eventListenerArgs.push(arguments[i]);
        }

        for (i = 0; i < eventListeners.length; i++) {
            var eventListener = eventListeners[i];
            priorities.push(eventListener.priority);
            eventListener.hash[uniqueFieldName] = false;
        }

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        for (i = 0; i < priorities.length; i++) {
            for (var j = 0; j < eventListeners.length; j++) {
                eventListener = eventListeners[j];

                if (!eventListener.hash[uniqueFieldName] && eventListener.priority == priorities[i]) {
                    eventListener.hash[uniqueFieldName] = true;

                    if (eventListener.callback.apply($this, eventListenerArgs) === false) {
                        return false;
                    }
                }
            }
        }
        for (i = 0; i < eventListeners.length; i++) {
            delete eventListeners[i].hash[uniqueFieldName];
        }

        return this;
    },

    /**
     * @inheritDoc
     */
    addEventListener: function(eventName, priority, listener)
    {
        if (typeof priority == 'function') {
            listener = priority;
            priority = null;
        }
        if (!listener || typeof listener != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the listener in event "' + eventName + '"', false)
                .received(listener)
                .expected('a function')
                .apply()
            ;
        }
        if (!this.getEvents().hasOwnProperty(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        if (!priority && typeof priority != 'number') {
            priority = this.getEvents()[eventName].length;
        }

        var eventListener = {
            priority: priority,
            callback: listener,
            hash: {}
        };

        this.getEvents()[eventName].push(eventListener);

        return this;
    },

    /**
     * @inheritDoc
     */
    removeEventListener: function(eventName, listener)
    {
        var events = this.getEvents();

        for (var evtName in events) {
            if (!events.hasOwnProperty(evtName)) {
                continue;
            }
            var listeners = events[evtName];
            var listenerIndex;

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].callback == listener) {
                    listenerIndex = i;
                    break;
                }
            }
            if (listenerIndex) {
                listeners.splice(listenerIndex, 1);
                break;
            }
        }

        return this;
    }
});
