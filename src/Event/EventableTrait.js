/**
 * @class
 * @name Subclass.Event.EventableTrait
 * @implements {Subclass.Event.EventableInterface}
 */
Subclass.Class.ClassManager.registerClass('Trait', 'Subclass/Event/EventableTrait', {

    $_properties: {

        /**
         * Registered events
         *
         * @type {Object}
         * @example
         *
         * events: {
         *      eventName: [
         *          {
         *              priority: {number},
         *              callback: {function}
         *          },
         *          ...
         *      ],
         *      ...
         * }
         */
        events: {
            type: 'objectCollection',
            nullable: false,
            proto: {
                type: 'arrayCollection',
                nullable: false,
                proto: {
                    type: "map",
                    schema: {
                        priority: { type: "number" },
                        callback: { type: "function" },
                        uniqueHash: { type: "object", default: {} }
                    }
                }
            }
        }
    },

    /**
     * @method registerEvent
     * @memberOf Subclass.Event.EventableTrait.prototype
     *
     * @inheritDoc
     */
    registerEvent: function(eventName)
    {
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('event name', false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        this.getEvents().addItem(eventName);

        return this;
    },

    /**
     * @method invokeEvent
     * @memberOf Subclass.Event.EventableTrait.prototype
     *
     * @inheritDoc
     */
    invokeEvent: function(eventName)
    {
        if (!this.getEvents().issetItem(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var eventListeners = this.getEvents().getItem(eventName);
        var eventListenerArgs = [];
        var priorities = [];
        var $this = this;

        for (var i = 1; i < arguments.length; i++) {
            eventListenerArgs.push(arguments[i]);
        }

        eventListeners.eachItem(function(eventListener, key) {
            priorities.push(eventListener.priority);
            eventListener.uniqueHash[uniqueFieldName] = false;
        });

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        for (i = 0; i < priorities.length; i++) {
            eventListeners.eachItem(function(eventListener) {
                if (!eventListener.uniqueHash[uniqueFieldName] && eventListener.priority == priorities[i]) {
                    eventListener.uniqueHash[uniqueFieldName] = true;

                    if (eventListener.callback.apply($this, eventListenerArgs) === false) {
                        return false;
                    }
                }
            });
        }
        eventListeners.eachItem(function(eventListener) {
            delete eventListener.uniqueHash[uniqueFieldName];
        });

        return this;
    },

    /**
     * @method addEventListener
     * @memberOf Subclass.Event.EventableTrait.prototype
     *
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
                .argument('listener in event "' + eventName + '"', false)
                .received(listener)
                .expected('a function')
                .apply()
            ;
        }
        if (!this.getEvents().issetItem(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        if (!priority && typeof priority != 'number') {
            priority = this.getEvents().getItem(eventName).getLength();
        }

        var eventListener = {
            priority: priority,
            callback: listener
        };

        this.getEvents().getItem(eventName).addItem(eventListener);

        return this;
    },

    /**
     * @method removeEventListener
     * @memberOf Subclass.Event.EventableTrait.prototype
     *
     * @inheritDoc
     */
    removeEventListener: function(eventName, listener)
    {
        this.getEvents().eachItem(function(value, key) {
            var listenerIndex;

            value.eachItem(function(item, index) {
                if (item.callback == listener) {
                    listenerIndex = index;
                    return false;
                }
            });
            if (listenerIndex) {
                value.removeItem(listenerIndex);
                return false;
            }
        });
    }
});
