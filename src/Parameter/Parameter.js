/**
 * @class
 * @constructor
 * @description
 *
 * Instance of current class holds information about parameter:
 * its name and value.
 *
 * @throws {Error}
 *      Throws error if parameter name was missed or is not a string
 *
 * @param {string} parameterName
 *      The name of the creating parameter
 *
 * @param {*} parameterValue
 *      The value of the creating parameter
 */
Subclass.Parameter.Parameter = (function()
{
    /**
     * @alias Subclass.Parameter.Parameter
     */
    function Parameter(parameterName, parameterValue)
    {
        if (!parameterName || typeof parameterName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of parameter", false)
                .received(parameterName)
                .expected('a string')
                .apply()
            ;
        }

        /**
         * Parameter name
         *
         * @type {string}
         * @private
         */
        this._name = parameterName;

        /**
         * Parameter value
         *
         * @type {*}
         * @private
         */
        this._value = parameterValue;
    }

    /**
     * Returns parameter name
     *
     * @method getName
     * @memberOf Subclass.Parameter.Parameter.prototype
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
     * @method getValue
     * @memberOf Subclass.Parameter.Parameter.prototype
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
     * @method setValue
     * @memberOf Subclass.Parameter.Parameter.prototype
     *
     * @param {*} value
     *      The new parameter value
     */
    Parameter.prototype.setValue = function(value)
    {
        this._value = value;
    };

    return Parameter;

})();