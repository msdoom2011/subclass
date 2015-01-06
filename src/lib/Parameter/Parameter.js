/**
 * @class
 */
Subclass.Parameter.Parameter = (function()
{
    /**
     * @param parameterName
     * @param parameterValue
     * @constructor
     */
    function Parameter(parameterName, parameterValue)
    {
        /**
         * Parameter name
         *
         * @type {string}
         */
        this._name = parameterName;

        /**
         * Parameter value
         *
         * @type {*}
         */
        this._value = parameterValue;
    }

    /**
     * Returns parameter name
     *
     * @returns {string}
     */
    Parameter.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns parameter value
     *
     * @returns {*}
     */
    Parameter.prototype.getValue = function()
    {
        return this._value;
    };

    /**
     * Sets parameter value
     *
     * @param {*} value
     */
    Parameter.prototype.setValue = function(value)
    {
        this._parameter = value;
    };

    return Parameter;

})();