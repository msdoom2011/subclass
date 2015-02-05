/**
 * @interface
 * @name Subclass.Event.EventableInterface
 */
Subclass.Class.ClassManager.registerClass('Interface', 'Subclass/Event/EventableInterface',
{
    /**
     * Registers new event
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     * @returns {*}
     */
    registerEvent: function(eventName) {},

    /**
     * Invokes event listeners
     *
     * @method invokeEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     * @param [arguments]
     * @return self
     */
    invokeEvent: function(eventName) {},

    /**
     * Adds new listener to event
     *
     * @method addEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     * @param {Function} listener
     * @param {number} [priority]
     * @returns self
     */
    addEventListener: function(eventName, priority, listener) {},

    /**
     * Removes specified event listener
     *
     * @method removeEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     * @param {function} listener
     */
    removeEventListener: function(eventName, listener) {}
});
