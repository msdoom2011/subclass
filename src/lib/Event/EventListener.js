/**
 * @class
 */
Subclass.Event.EventListener = (function()
{
    function EventListener(priority, callback)
    {
        if (typeof priority == 'function') {
            callback = priority;
            priority = 0;
        }
        if (typeof priority != 'number') {
            throw new Error('The priority of event listener must be a number.');
        }
        if (typeof callback != 'function') {
            throw new Error('The event listener callback must be a function.');
        }

        /**
         * Priority of event listener.
         * The higher the number the sooner current listener will be called
         *
         * @type {number}
         */
        this._priority = priority;

        /**
         * Event listener callback
         *
         * @type {Function}
         */
        this._callback = callback;
    }

    /**
     * Returns event listener priority
     *
     * @returns {number}
     */
    EventListener.prototype.getPriority = function()
    {
        return this._priority;
    };

    /**
     * Returns event listener callback
     *
     * @returns {Function}
     */
    EventListener.prototype.getCallback = function()
    {
        return this._callback;
    };

    return EventListener;

})();