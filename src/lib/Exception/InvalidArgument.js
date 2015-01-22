/**
 * @param {string} argName
 * @param {*} argValue
 * @param {string} neededType
 */
Subclass.Exception.InvalidArgument = function(argName, argValue, neededType)
{
    var message = 'Specified invalid argument "' + argName + '" value. ';
    message += 'It must be ' + neededType + '. ';
    message += Subclass.Exception.generateValueType(argValue);

    throw new Error(message);
};