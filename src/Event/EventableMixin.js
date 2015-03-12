/**
 * @mixin
 * @description
 *
 * Adds new functionality to class which allows it to manipulate events:<br />
 * - register new events;<br />
 * - receive events;<br />
 * - check whether is interesting event exists.
 */
Subclass.Event.EventableMixin = (function()
{
    /**
     * @alias Subclass.Event.EventableMixin
     */
    function EventableMixin()
    {
        return {
            /**
             * A collection of events
             *
             * @type {Object.<Subclass.Event.Event>}
             * @private
             */
            _events: {}
        };
    }

    /**
     * Returns registered events
     *
     * @method getEvents
     * @memberOf Subclass.Event.EventableMixin
     *
     * @returns {Object.<Subclass.Event.Event>}
     */
    EventableMixin.prototype.getEvents = function()
    {
        return this._events;
    };

    ///**
    // * Returns all registered services
    // *
    // * @method getEvents
    // * @memberOf Subclass.Event.EventableMixin.prototype
    // *
    // * @param {boolean} [privateEvents=false]
    // *      If passed true it returns events only from current module
    // *      without events from it plug-in modules .
    // *
    // * @returns {Object.<Subclass.Event.Event>}
    // */
    //EventableMixin.prototype.getEvents = function(privateEvents)
    //{
    //    var mainModule = this.getModule();
    //    var moduleStorage = mainModule.getModuleStorage();
    //    var events = {};
    //    var $this = this;
    //
    //    if (privateEvents !== true) {
    //        privateEvents = false;
    //    }
    //    if (privateEvents) {
    //        return this._events;
    //    }
    //
    //    moduleStorage.eachModule(true, function(module) {
    //        if (module == mainModule) {
    //            Subclass.Tools.extend(events, $this._events);
    //            return;
    //        }
    //        var moduleEventManager = module.getEventManager();
    //        var moduleEvents = moduleEventManager.getEvents();
    //
    //        Subclass.Tools.extend(events, moduleEvents);
    //    });
    //
    //    return events;
    //};

    /**
     * Registers new event with specified name.<br />
     * It's required step for further using every event.<br /><br />
     *
     * Creates instance of {@link Subclass.Event.Event}
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
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
     * @returns {Subclass.Event.EventableMixin}
     */
    EventableMixin.prototype.registerEvent = function(eventName, context)
    {
        if (this.issetEvent(eventName, true)) {
            Subclass.Error.create('Event with name "' + eventName + '" already exists.');
        }
        this._events[eventName] = Subclass.Tools.createClassInstance(Subclass.Event.Event,
            this,
            eventName,
            context
        );

        return this;
    };

    /**
     * Returns registered event instance.
     *
     * @method getEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
     *
     * @throws {Error}
     *      Throws error if trying to get event that was not registered
     *
     * @param {string} eventName
     *      The name of event you want to get
     *
     * @returns {Subclass.Event.Event}
     */
    EventableMixin.prototype.getEvent = function(eventName)
    {
        if (!this.issetEvent(eventName)) {
            Subclass.Error.create('Trying to get non existent event "' + eventName + '".');
        }
        return this.getEvents()[eventName];
    };

    /**
     * Checks whether event with specified name was registered
     *
     * @method issetEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
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
    EventableMixin.prototype.issetEvent = function(eventName, privateEvents)
    {
        return !!this.getEvents(privateEvents)[eventName];
    };

    return EventableMixin;

})();