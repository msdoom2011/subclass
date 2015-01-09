Subclass.Tools.ConverterTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Converting number to formatted string with thousands separator (comma by default)
         *
         * @param {(number|string)} number
         *      Input parameter
         * @param {string} thousandsSeparator
         * @returns {string}
         */
        convertNumberToString: function(number, thousandsSeparator)
        {
            var inputNumber = number;

            if (!thousandsSeparator) {
                thousandsSeparator = ",";
            }
            if (typeof number == 'string') {
                number = number.replace(/(^\s+)|(\s+$)/g, '');
                number = number.replace(/(\d+)[\,\s]+(\d+)+/g, '$1$2');
            }
            if (
                number === null
                || number === undefined
                || isNaN(parseFloat(number))
                || number.toString().match(/.+\-.+/)
            ) {
                return inputNumber;
            }
            var parts = number.toString().split(".");
            parts[0] = parts[0].replace(/\b(?=(\d{3})+(?!\d))/g, thousandsSeparator);

            return parts.join(".");
        },

        /**
         * Converts string to number if it is possible or returns false otherwise.
         *
         * @param {string} string
         * @returns {(number|boolean)}
         */
        convertStringToNumber: function(string)
        {
            if (typeof string == 'number') {
                return string;
            }
            if (!string) {
                return 0;
            }
            if (
                string === null
                || string === undefined
                || isNaN(parseFloat(string))
                || string.match(/.+\-.+/)
            ) {
                return false;
            }
            var temp = string
                .replace(/[^0-9,\s]+$/, '')
                .replace(/[\,\s]+/g, '')
            ;
            if (!isNaN(parseFloat(temp))) {
                return parseFloat(temp);
            }
            return false;
        },

        /**
         * Returns suffix that is next to parsed number in passed string.
         *
         * @param {string} numeric
         * @returns {*}
         */
        getNumberSuffix: function(numeric)
        {
            if (typeof numeric == 'number' || !numeric) {
                return "";
            }
            var result = numeric.match(/[^0-9]+$/);

            if (result && result.length) {
                return result[0];
            }
            return "";
        }
    });

    return Subclass.Tools;

})();