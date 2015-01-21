/**
 * @class
 *
 * @param {string} argName
 * @param {*} argValue
 * @param {string} neededType
 */
Subclass.Exception.InvalidArgument = (function() {

    function InvalidArgument(argName, argValue, neededType)
    {
        var message = 'Specified invalid argument "' + argName + '" value. ';
            message += 'It must be ' + neededType + '. ';

        if (argValue && typeof argValue == 'object' && argValue.$_className) {
            message += 'The instance of class "' + argValue.$_className + '" was received instead.';

        } else if (argValue && typeof argValue == 'object') {
            message += 'The object with type "' + argValue.constructor.name + '" was received instead.';

        } else {
            message += 'The value with type "' + (typeof argValue) + '" was received instead.';
        }

        return InvalidArgument.$parent.call(this, message);
    }

    InvalidArgument.$parent = Error;
    InvalidArgument.prototype = Object.create(Error.prototype);
    InvalidArgument.prototype.constructor = InvalidArgument;

    return InvalidArgument;
})();