Subclass.Tools.CheckTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Checks if passed value is empty
         *
         * @param {*} value
         * @returns {boolean}
         */
        isEmpty: function(value)
        {
            return (
                !value
                || parseFloat(value) === 0
                || (this.isObject(value) && Object.keys(value).length == 0)
                || (this.isArray(value) && value.length == 0)
            );
        },

        /**
         * Checks if passed value undefined
         *
         * @param {*} value
         * @returns {boolean}
         */
        isUndef: function(value)
        {
            return value === undefined;
        },

        /**
         * Checks if passed value is undefined or null
         *
         * @param {*} value
         * @returns {boolean}
         */
        isUndefOrNull: function(value)
        {
            return this.isUndef(value) || value === null;
        },

        /**
         * Checks if passed value is null
         *
         * @param value
         * @returns {boolean}
         */
        isNull: function(value)
        {
            return value === null;
        },

        /**
         * Checks if passed value is object (but not an array)
         *
         * @param {*} value
         * @returns {boolean}
         */
        isObject: function(value)
        {
            return (
                value !== null
                && typeof value === 'object'
                && !this.isArray(value)
            );
        },

        /**
         * Checks if passed value is a plain object
         *
         * @param {*} value
         * @returns {boolean}
         */
        isPlainObject: function(value)
        {
            if (
                typeof value != "object"
                || value === null
                || value.nodeType
                || value == window
            ) {
                return false;
            }
            return !(
                value.constructor
                && !value.constructor.prototype.hasOwnProperty("isPrototypeOf")
            );
        },

        /**
         * Checks if passed value is an array
         *
         * @param value
         * @returns {boolean}
         */
        isArray: function(value)
        {
            return Array.isArray(value);
        },

        /**
         * Checks if passed value is a boolean
         *
         * @param {*} value
         * @returns {boolean}
         */
        isBoolean: function(value)
        {
            return typeof value == 'boolean';
        },

        /**
         * Checks if passed value is string
         *
         * @param {*} value
         * @returns {boolean}
         */
        isString: function(value)
        {
            return typeof value == 'string';
        },

        /**
         * Checks if passed value is number
         *
         * @param {*} value
         * @returns {boolean}
         */
        isNumber: function(value)
        {
            return typeof value == 'number';
        },

        /**
         * Checks if passed value is even number
         *
         * @param {*} value
         * @returns {boolean}
         */
        isNumberEven: function(value)
        {
            if (!this.isNumber(value)) {
                throw new Error('Trying to check is even not number value.');
            }
            return value % 2 == !1;
        },

        /**
         * Checks if specified string can be converted to number
         *
         * @param {string} numeric
         * @returns {boolean}
         */
        isNumeric: function(numeric)
        {
            var number = this.convertStringToNumber(numeric);
            return number !== false;
        }
    });

    return Subclass.Tools;

})();