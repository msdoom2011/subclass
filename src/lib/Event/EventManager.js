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
     * Return module instance
     *
     * @returns {Subclass.Module.Module}
     */
    EventManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns all registered services
     *
     * @param {boolean} [privateEvents = false]
     *      If passed true it returns events only from current module
     *      without events from its dependencies.
     *
     * @returns {Object.<Subclass.Event.Event>}
     */
    EventManager.prototype.getEvents = function(privateEvents)
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var events = {};
        var $this = this;

        if (privateEvents !== true) {
            privateEvents = false;
        }
        if (privateEvents) {
            return this._events;
        }

        moduleManager.eachModule(true, function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(events, $this._events);
                return;
            }
            var moduleEventManager = module.getEventManager();
            var moduleEvents = moduleEventManager.getEvents();

            Subclass.Tools.extend(events, moduleEvents);
        });

        return events;
    };

    /**
     * Registers new event with specified name
     *
     * @param {string} eventName
     * @param {Object} context
     * @returns {Subclass.Event.EventManager}
     */
    EventManager.prototype.registerEvent = function(eventName, context)
    {
        if (this.issetEvent(eventName, true)) {
            throw new Error('Event with name "' + eventName + '" already exists.');
        }
        this._events[eventName] = new Subclass.Event.Event(this, eventName, context);

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
        return this.getEvents()[eventName];
    };

    /**
     * Checks whether event with specified name exists
     *
     * @param {string} eventName
     * @param {boolean} privateEvents
     * @returns {boolean}
     */
    EventManager.prototype.issetEvent = function(eventName, privateEvents)
    {
        return !!this.getEvents(privateEvents)[eventName];
    };

    return EventManager;

})();