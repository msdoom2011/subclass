/**
 * @class
 * @constructor
 */
Subclass.EventManager = function()
{
    function EventManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the module instance', false)
                .received(module)
                .expected('the instance of class "Subclass.Module"')
                .apply()
            ;
        }
        this._module = module;
    }

    EventManager.$mixins = [Subclass.Event.EventableMixin];

    /**
    * Returns instance of module
    *
    * @method getModule
    * @memberOf Subclass.EventManager.prototype
    *
    * @returns {*}
    */
    EventManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
    * Returns all registered services
    *
    * @method getEvents
    * @memberOf Subclass.EventManager.prototype
    *
    * @param {boolean} [privateEvents=false]
    *      If passed true it returns events only from current module
    *      without events from it plug-in modules.
    *
    * @returns {Object.<Subclass.Event.Event>}
    */
    EventManager.prototype.getEvents = function(privateEvents)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var events = {};
        var $this = this;

        if (privateEvents !== true) {
            privateEvents = false;
        }
        if (privateEvents) {
            return this._events;
        }

        moduleStorage.eachModule(true, function(module) {
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
    * @inheritDoc
    */
    EventManager.prototype.registerEvent = function(eventName)
    {
        if (this.issetEvent(eventName, true)) {
            Subclass.Error.create('Event with name "' + eventName + '" already exists.');
        }
        this._events[eventName] = Subclass.Tools.createClassInstance(Subclass.ModuleEvent,
            this,
            eventName,
            this.getModule()
        );

        return this;
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
    EventManager.prototype.issetEvent = function(eventName, privateEvents)
    {
        return !!this.getEvents(privateEvents)[eventName];
    };

    return EventManager;
}();