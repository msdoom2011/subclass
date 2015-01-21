/**
 * @class
 *
 * @param {Subclass.Property.PropertyType} property
 * @param {*} value
 * @param {string} neededType
 */
Subclass.Property.Error.InvalidValue = (function() {

    function InvalidValue(property, value, neededType)
    {
        var message = 'Specified invalid value of property ' + property + '. ';
            message += 'It must be ' + neededType + '. ';

        if (value && typeof value == 'object' && value.$_className) {
            message += 'The instance of class "' + value.$_className + '" was received instead.';

        } else if (value && typeof value == 'object') {
            message += 'The object with type "' + value.constructor.name + '" was received instead.';

        } else {
            message += 'The value with type "' + (typeof value) + '" was received instead.';
        }

        return InvalidValue.$parent.call(this, message);
    }

    InvalidValue.$parent = Error;
    InvalidValue.prototype = Object.create(Error.prototype);
    InvalidValue.prototype.constructor = InvalidValue;

    return InvalidValue;
})();