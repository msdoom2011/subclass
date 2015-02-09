/**
 * @interface
 * @constructor
 * @name Subclass.Event.EventableInterface
 */
Subclass.Class.ClassManager.registerClass('Interface', 'Subclass/Event/EventableInterface',
{
    /**
     * Registers the new event
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    registerEvent: function(eventName) {},

    /**
     * Invokes event listeners
     *
     * @method invokeEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param [arguments]
     *      Any number arguments you need the event listeners
     *      will receive when the event will be triggered
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    invokeEvent: function(eventName) {},

    /**
     * Adds new listener to event
     *
     * @method addEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param {number} [priority]
     *      The priority of event listener.
     *      The more higher priority - the more earlier current listener callback function will be invoked.
     *
     * @param {Function} listener
     *      The callback function which will be invoked when the event triggers
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    addEventListener: function(eventName, priority, listener) {},

    /**
     * Removes specified event listener
     *
     * @method removeEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param {function} listener
     *      The listener callback function which was subscribed to the event
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    removeEventListener: function(eventName, listener) {}
});
