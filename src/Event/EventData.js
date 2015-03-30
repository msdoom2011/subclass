Subclass.Event.EventData = function()
{
    function EventData(eventInst, target)
    {
        /**
         * Event instance
         *
         * @type {Subclass.Event.Event}
         * @private
         */
        this._event = eventInst;

        /**
         * Event executing context
         *
         * @type {*}
         * @private
         */
        this._target = target;

        /**
         * Array of event listeners results
         *
         * @type {Array.<*>}
         * @private
         */
        this._results = [];

        /**
         * Reports whether propagation stopped
         *
         * @type {boolean}
         * @private
         */
        this._stopped = false;
    }

    /**
     * Starts event propagation
     */
    EventData.prototype.startPropagation = function()
    {
        this._stopped = false;
    };

    /**
     * Stops event propagation
     */
    EventData.prototype.stopPropagation = function()
    {
        this._stopped = true;
    };

    /**
     * Reports whether event propagation stopped
     *
     * @returns {boolean}
     */
    EventData.prototype.isPropagationStopped = function()
    {
        return this._stopped;
    };

    /**
     * Adds new event listener execution result
     *
     * @param {*} result
     *      Event listener execution result
     */
    EventData.prototype.addResult = function(result)
    {
        this._results.push(result);
    };

    /**
     * Returns all results of event listeners executions
     *
     * @returns {Array.<*>}
     */
    EventData.prototype.getResults = function()
    {
        return this._results;
    };

    /**
     * Returns first result of event listeners executions
     *
     * @returns {*}
     */
    EventData.prototype.getFirstResult = function()
    {
        return this._results.length
            ? this._results[0]
            : undefined
        ;
    };

    /**
     * Returns last result of event listeners executions
     *
     * @returns {*}
     */
    EventData.prototype.getLastResult = function()
    {
        return this._results.length
            ? this._results[this._results.length - 1]
            : undefined
        ;
    };

    /**
     * Clears event listeners execution results
     */
    EventData.prototype.clearResults = function()
    {
        this._results = [];
    };

    return EventData;
}();