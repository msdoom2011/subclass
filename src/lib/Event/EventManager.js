/**
 * @namespace
 */
Subclass.Event = {};

/**
 * @class
 */
Subclass.Event.EventManager = (function()
{
    /**
     * @param {Subclass.Module.Module} module
     * @constructor
     */
    function EventManager(module)
    {
        /**
         * An instance of subclass module
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

        /**
         * A collection of events
         *
         * @type {Object.<Subclass.Event.Event>}
         * @private
         */
        this._events = {};
    }

    /**
     * Registers new event with specified name
     *
     * @param {string} eventName
     * @param {Object} context
     * @returns {Subclass.Event.EventManager}
     */
    EventManager.prototype.registerEvent = function(eventName, context)
    {
        if (this.issetEvent(eventName)) {
            throw new Error('Event with name "' + eventName + '" already exists.');
        }
        this._events[eventName] = new Subclass.Event.Event(eventName, context);

        return this;
    };

    /**
     * Returns event instance
     *
     * @param {string} eventName
     * @returns {Subclass.Event.Event}
     */
    EventManager.prototype.getEvent = function(eventName)
    {
        if (!this.issetEvent(eventName)) {
            throw new Error('Trying to get non existent event.');
        }
        return this._events[eventName];
    };

    /**
     * Checks whether event with specified name exists
     *
     * @param {string} eventName
     * @returns {boolean}
     */
    EventManager.prototype.issetEvent = function(eventName)
    {
        return !!this._events[eventName];
    };

    return EventManager;

})();