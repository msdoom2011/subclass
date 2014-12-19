; Subclass.Tools = (function()
{
    return {

        /**
         * Extends target object or array with source object or array without recursion.
         *
         * Every property in the source object or array will replace
         * already existed property with the same name in the target object or array.
         *
         * @param {(Object|Array)} target
         * @param {(Object|Array)} source
         * @param {boolean} [withInheritedProps]
         * @returns {(Object|Array)}
         */
        extend: function (target, source, withInheritedProps)
        {
            if (withInheritedProps !== true) {
                withInheritedProps = false;
            }
            if (typeof target != 'object' && source != 'object') {
                return target;
            }
            if (
                (!Array.isArray(target) && Array.isArray(source))
                || (Array.isArray(target) && !Array.isArray(source))
            ) {
                return target;
            }
            if (Array.isArray(target)) {
                for (var i = 0; i < source.length; i++) {
                    target.push(source[i]);
                }
            } else {
                for (var propName in source) {
                    if (!withInheritedProps && !source.hasOwnProperty(propName)) {
                        continue;
                    }
                    target[propName] = source[propName];
                }
            }
            return target;
        },

        extendDeep: function extendDeep (target, source, mergeArrays, withInheritedProps)
        {
            if (withInheritedProps !== true) {
                withInheritedProps = false;
            }
            if (
                !mergeArrays
                || (
                    typeof mergeArrays != "boolean"
                    && typeof mergeArrays != "function"
                )
            ) {
                mergeArrays = false;
            }

            var comparator = false;

            if (typeof mergeArrays == 'function') {
                comparator = mergeArrays;
                mergeArrays = true;
            }

            // Handle case when target is a string or something
            if (typeof target != "object" && typeof target != 'function') {
                target = {};
            }

            function isEqual(target, element)
            {
                for (var i = 0; i < target.length; i++) {
                    if (comparator(target[i], element)) {
                        return true;
                    }
                }
                return false;
            }

            // Extend the base object
            for (var propName in source) {
                var sourceItemIsArray;

                if (!withInheritedProps && !source.hasOwnProperty(propName)) {
                    continue;
                }

                // Prevent never-ending loop
                if (target === source[propName]) {
                    continue;
                }

                // Recourse if we're merging plain objects or arrays
                if (
                    source[propName]
                    && (
                        this.isPlainObject(source[propName])
                        || (
                            mergeArrays
                            && (sourceItemIsArray = Array.isArray(source[propName]))
                        )
                    )
                ) {
                    var clone;

                    if (sourceItemIsArray && mergeArrays) {
                        sourceItemIsArray = false;
                        clone = [];

                        if (target[propName] && Array.isArray(target[propName])) {
                            for (var k = 0; k < source[propName].length; k++) {
                                if (
                                    !comparator
                                    || (
                                        typeof comparator == 'function'
                                        && !isEqual(target[propName], source[propName][k])
                                    )
                                ) {
                                    target[propName].push(source[propName][k]);
                                }
                            }
                            continue;
                        }

                    } else {
                        clone = target[propName] && this.isPlainObject(target[propName])
                            ? target[propName]
                            : {}
                        ;
                    }

                    // Never move original objects, clone them
                    target[propName] = extendDeep.call(
                        this,
                        clone,
                        source[propName],
                        comparator || mergeArrays,
                        withInheritedProps
                    );

                    // Don't bring in undefined values
                } else if (source[propName] !== undefined) {
                    target[propName] = source[propName];
                }
            }

            // Return the modified object
            return target;
        },

        copy: function (object)
        {
            var newObj;

            if (
                typeof object == 'object'
                && (
                    this.isPlainObject(object)
                    || Array.isArray(object)
                )
            ) {
                newObj = Object.create(Object.getPrototypeOf(object));
                newObj = this.extendDeep(newObj, object, true);

            } else {
                newObj = object;
            }
            return newObj;
        },

        isPlainObject: function (obj)
        {
            if (
                typeof obj != "object"
                || obj.nodeType
                || obj == window
            ) {
                return false;
            }
            return !(
                obj.constructor
                && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")
            );
        },

        convertNumberToString: function(number)
        {
            var inputNumber = number;

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
            parts[0] = parts[0].replace(/\b(?=(\d{3})+(?!\d))/g, ",");

            return parts.join(".");
        },

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
            if (!isNaN(parseFloat(temp))) { // && !temp.match(/\.+\-\.+/)) {
                return parseFloat(temp);
            }
            return false;
        },

        isNumeric: function(numericString)
        {
            var number = this.convertStringToNumber(numericString);
            return number !== false;
        },

        getNumberSuffix: function(numericString)
        {
            if (typeof numericString == 'number' || !numericString) {
                return "";
            }
            var result = numericString.match(/[^0-9]+$/);

            if (result && result.length) {
                return result[0];
            }
            return "";
        }
    };
})();