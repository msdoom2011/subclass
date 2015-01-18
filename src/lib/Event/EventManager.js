/**
 * @namespace
 */
Subclass.Event = {};

/**
 * @class
 * @constructor
 * @description
 *
 * Instance of current class allows to manipulate events:<br />
 * - register new events;<br />
 * - receive events;<br />
 * - check whether is interesting event exists.
 *
 * @param {Subclass.Module.Module} module
 *      A module instance
 */
Subclass.Event.EventManager = (function()
{
    /**
     * @alias Subclass.Event.EventManager
     */
    function EventManager(module)
    {
        /**
         * An instance of subclass module
         *
         * @type {Subclass.Module.Module}
         * @private
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
     * Returns module instance (the module to which current instance
     * of event manager belongs)
     *
     * @method getModule
     * @memberOf Subclass.Event.EventManager.prototype
     * @returns {Subclass.Module.Module}
     */
    EventManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns all registered services
     *
     * @method getEvents
     * @memberOf Subclass.Event.EventManager.prototype
     *
     * @param {boolean} [privateEvents=false]
     *      If passed true it returns events only from current module
     *      without events from it dependency (plug-in) modules .
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
     * Registers new event with specified name.<br />
     * It's required step for further using every event.<br /><br />
     *
     * Creates instance of {@link Subclass.Event.Event}
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventManager.prototype
     *
     * @throws {Error}
     *      Throws if trying to register event with already existent event
     *
     * @param {string} eventName
     *      A name of creating event
     *
     * @param {Object} [context]
     *      An any object which link on it will be held
     *      in "this" variable inside every registered
     *      listener of current event.
     *
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
     * Returns registered event instance.
     *
     * @method getEvent
     * @memberOf Subclass.Event.EventManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to get event that was not registered
     *
     * @param {string} eventName
     *      The name of event you want to get
     *
     * @returns {Subclass.Event.Event}
     */
    EventManager.prototype.getEvent = function(eventName)
    {
        if (!this.issetEvent(eventName)) {
            throw new Error('Trying to get non existent event "' + eventName + '".');
        }
        return this.getEvents()[eventName];
    };

    /**
     * Checks whether event with specified name was registered
     *
     * @method issetEvent
     * @memberOf Subclass.Event.EventManager.prototype
     *
     * @param {string} eventName
     *      The name of interesting event
     *
     * @param {boolean} [privateEvents]
     *      Checks whether is event with specified name was registered
     *      specificly in this module without checking in plug-in modules.
     *
     * @returns {boolean}
     */
    EventManager.prototype.issetEvent = function(eventName, privateEvents)
    {
        return !!this.getEvents(privateEvents)[eventName];
    };

    return EventManager;

})();