/**
 * @namespace
 */
Subclass.Exception = {

    generateValueType: function(value)
    {
        var message = "";

        if (value && typeof value == 'object' && value.$_className) {
            message += 'The instance of class "' + value.$_className + '" was received instead.';

        } else if (value && typeof value == 'object') {
            message += 'The object with type "' + value.constructor.name + '" was received instead.';

        } else {
            message += 'The value with type "' + (typeof value) + '" was received instead.';
        }

        return message;
    }

};
