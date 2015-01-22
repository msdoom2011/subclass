/**
 * @param {string} optName
 * @param {*} optValue
 * @param {Subclass.Class.ClassType} classInst
 * @param {string} neededType
 */
Subclass.Class.Error.InvalidOption = function(optName, optValue, classInst, neededType)
{
    var message = 'Invalid value of option "' + optName + '" ';
    message += 'in definition of class "' + classInst.getName() + '". ';
    message += 'It must be ' + neededType + '. ';
    message += Subclass.Exception.generateValueType(optValue);

    throw new Error(message);
};
