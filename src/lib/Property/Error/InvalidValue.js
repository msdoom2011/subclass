/**
 * @param {Subclass.Property.PropertyType} property
 * @param {*} value
 * @param {string} neededType
 */
Subclass.Property.Error.InvalidValue = function(property, value, neededType)
{
    var message = 'Specified invalid value of property ' + property + '. ';
    message += 'It must be ' + neededType + '. ';
    message += Subclass.Exception.generateValueType(value);

    throw new Error(message);
};