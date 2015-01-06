/**
 * @class
 */
Subclass.Event.Event = (function()
{
    /**
     * @param {string} eventName
     * @param {Object} context
     * @constructor
     */
    function Event(eventName, context)
    {
        if (!eventName) {
            throw new Error('Missed required argument "name" in Subclass.Event.Event constructor.');
        }
        if (!context) {
            context = {};
        }
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
        var listeners = this.getListeners();
        var listener = new Subclass.Event.EventListener(priority, callback);
        listeners.push(listener);

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
        var listeners = this.getListeners();

        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].getCallback() == callback) {
                return listeners[i];
            }
        }
        return null;
    };

    /**
     * Checks whether is set event listener with specified callback
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    Event.prototype.issetListener = function(callback)
    {
        var listeners = this.getListeners();

        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].getCallback() == callback) {
                return true;
            }
        }
        return false;
    };

    /**
     * Returns registered event listeners
     *
     * @returns {Array.<Subclass.Event.EventListener>}
     */
    Event.prototype.getListeners = function()
    {
        return this._listeners;
    };

    /**
     * Checks whether current event contains any listeners
     *
     * @return {boolean}
     */
    Event.prototype.hasListeners = function()
    {
        return !!this._listeners.length;
    };

    /**
     * Invokes event listeners
     *
     * @param [arguments] - Any number of arguments
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.invoke = function()
    {
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var listeners = this.getListeners();
        var listenerArgs = [];
        var priorities = [];

        for (var i = 0; i < arguments.length; i++) {
            listenerArgs.push(arguments[i]);
        }

        for (i = 0; i < listeners.length; i++) {
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