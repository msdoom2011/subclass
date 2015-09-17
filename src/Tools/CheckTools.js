Subclass.Tools.CheckTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Checks if passed value is empty
         *
         * @method isEmpty
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's empty
         *
         * @returns {boolean}
         */
        isEmpty: function(value)
        {
            return (
                !value
                || (this.isObject(value) && Object.keys(value).length == 0)
                || (this.isArray(value) && value.length == 0)
            );
        },

        /**
         * Checks if passed value undefined
         *
         * @method isUndef
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's undefined
         *
         * @returns {boolean}
         */
        isUndef: function(value)
        {
            return value === undefined;
        },

        /**
         * Checks if passed value is undefined or null
         *
         * @method isUndefOrNull
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's undefined or null
         *
         * @returns {boolean}
         */
        isUndefOrNull: function(value)
        {
            return this.isUndef(value) || value === null;
        },

        /**
         * Checks if passed value is null
         *
         * @method isNull
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's null
         *
         * @returns {boolean}
         */
        isNull: function(value)
        {
            return value === null;
        },

        /**
         * Checks if passed value is object (but not an array or a null)
         *
         * @method isObject
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's object
         *      and is not a null at the same time
         *
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
         * @method isPlainObject
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a plain object
         *
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
         * @method isArray
         * @memberOf Subclass.Tools
         * @static
         *
         * @param value
         *      The value you want to check if it's an array
         *
         * @returns {boolean}
         */
        isArray: function(value)
        {
            return Array.isArray(value);
        },

        /**
         * Checks if passed value is a boolean
         *
         * @method isBoolean
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a boolean
         *
         * @returns {boolean}
         */
        isBoolean: function(value)
        {
            return typeof value == 'boolean';
        },

        /**
         * Checks if passed value is string
         *
         * @method isString
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a string
         *
         * @returns {boolean}
         */
        isString: function(value)
        {
            return typeof value == 'string';
        },

        /**
         * Checks if passed value is number
         *
         * @method isNumber
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a number
         *
         * @returns {boolean}
         */
        isNumber: function(value)
        {
            return typeof value == 'number';
        },

        /**
         * Checks if passed value is even number
         *
         * @method isNumberEven
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's an even number
         *
         * @returns {boolean}
         */
        isNumberEven: function(value)
        {
            if (!this.isNumber(value)) {
                Subclass.Error.create('Trying to check whether is even the not number value.');
            }
            return value % 2 == 0;
        },

        /**
         * Checks if specified string can be converted to number
         *
         * @method isNumeric
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} numeric
         *      The value you want to check if it can be converted to number
         *
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