/**
 * @class
 *
 * @param {Subclass.Property.PropertyType} property
 * @param {*} value
 * @param {string} [neededType]
 */
Subclass.Property.Error.EmptyValue = (function() {

    function EmptyValue(property, value, neededType)
    {
        var message = "";

        if (value === null) {
            message += 'The property ' + property + ' is not nullable.'

        } else {
            message += 'Specified empty value of property ' + property + '. ';
            message += 'It must be ' + neededType + '. ';

            if (value === undefined) {
                message += 'Undefined was received instead.';

            } else if (isNaN(value)) {
                message += 'NaN was received instead.';
            }
        }

        return EmptyValue.$parent.call(this, message);
    }

    EmptyValue.$parent = Error;
    EmptyValue.prototype = Object.create(Error.prototype);
    EmptyValue.prototype.constructor = EmptyValue;

    return EmptyValue;
})();