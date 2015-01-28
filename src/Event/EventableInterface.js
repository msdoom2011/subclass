/**
 * @class
 */
Subclass.Class.ClassManager.registerClass('Interface', 'Subclass/Event/EventableInterface',
{
    /**
     * Registers new event
     *
     * @param {string} eventName
     * @returns {*}
     */
    registerEvent: function(eventName) {},

    /**
     * Invokes event listeners
     *
     * @param {string} eventName
     * @param [arguments]
     * @return self
     */
    invokeEvent: function(eventName) {},

    /**
     * Adds new listener to event
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
     * @param {string} eventName
     * @param {function} listener
     */
    removeEventListener: function(eventName, listener) {}
});
