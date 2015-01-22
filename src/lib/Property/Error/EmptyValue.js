/**
 * @param {Subclass.Property.PropertyType} property
 * @param {*} value
 * @param {string} [neededType]
 */
Subclass.Property.Error.EmptyValue = function(property, value, neededType)
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

    throw new Error(message);
};