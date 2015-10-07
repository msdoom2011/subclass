/**
 * @class
 * @constructor
 * @description
 *
 * The class that is used for holding information about event listener.
 *
 * @throws {Error}
 *      Throws error if:<br />
 *      - priority is not a number (any data type except number);<br />
 *      - callback is not a function.
 *
 * @param {number} [priority=0]
 *      A number which tells when current listener will be invoked
 *      relative to other registered listeners in this particular event instance
 *
 * @param {Function} callback
 *      A callback function which will be invoked when the event will trigger
 *
 */
Subclass.Event.EventListener = (function()
{
    /**
     * @alias Subclass.Event.EventListener
     */
    function EventListener(priority, callback)
    {
        if (typeof priority == 'function') {
            callback = priority;
            priority = 0;
        }
        if (typeof priority != 'number') {
            Subclass.Error.create('InvalidArgument')
                .argument("the priority of event listener", false)
                .received(priority)
                .expected('a number')
                .apply()
            ;
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }

        /**
         * Priority of event listener.
         * The higher the number the sooner current listener will be called
         *
         * @type {number}
         * @private
         */
        this._priority = priority;

        /**
         * Event listener callback
         *
         * @type {Function}
         * @private
         */
        this._callback = callback;
    }

    EventListener.prototype = {

        /**
         * Returns event listener priority
         *
         * @method getPriority
         * @memberOf Subclass.Event.EventListener.prototype
         *
         * @returns {number}
         */
        getPriority: function()
        {
            return this._priority;
        },

        /**
         * Returns event listener callback
         *
         * @method getCallback
         * @memberOf Subclass.Event.EventListener.prototype
         *
         * @returns {Function}
         */
        getCallback: function()
        {
            return this._callback;
        }
    };

    return EventListener;

})();