/**
 * @param {string} argName
 * @param {*} argValue
 * @param {string} neededType
 */
Subclass.Exception.EmptyArgument = function(argName, argValue, neededType)
{
    var message = 'Specified empty value for "' + argName + '" argument. ';
        message += 'It must be ' + neededType + '. ';

    if (argValue === null) {
        message += 'Null was received instead.';

    } else if (argValue === undefined) {
        message += 'Undefined was received instead.';

    } else if (isNaN(argValue)) {
        message += 'NaN was received instead.';
    }

    throw new Error(message);
};