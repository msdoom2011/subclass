/**
 * @class
 *
 * @param {string} optName
 * @param {*} optValue
 * @param {Subclass.Property.PropertyType} property
 * @param {string} neededType
 */
Subclass.Property.Error.InvalidOption = (function() {

    function InvalidOption(optName, optValue, property, neededType)
    {
        var message = 'Invalid value of option "' + optName + '" ';
            message += 'in definition of property ' + property + '. ';
            message += 'It must be ' + neededType + '. ';

        if (optValue && typeof optValue == 'object' && optValue.$_className) {
            message += 'The instance of class "' + optValue.$_className + '" was received instead.';

        } else if (optValue && typeof optValue == 'object') {
            message += 'The object with type "' + optValue.constructor.name + '" was received instead.';

        } else {
            message += 'The value with type "' + (typeof optValue) + '" was received instead.';
        }

        return InvalidOption.$parent.call(this, message);
    }

    InvalidOption.$parent = Error;
    InvalidOption.prototype = Object.create(Error.prototype);
    InvalidOption.prototype.constructor = InvalidOption;

    return InvalidOption;
})();