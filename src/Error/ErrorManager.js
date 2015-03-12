Subclass.Error = function()
{
    return {

        /**
         * Collection with constructor functions of registered error types
         *
         * @memberOf Subclass.Error
         * @type {Object}
         */
        _types: {},

        /**
         * Creates error object instance.
         *
         * @method create
         * @memberOf Subclass.Error
         * @static
         *
         * @param {string} type
         *      The error type. If type was not registered it will be
         *      interpreted as a message text
         */
        create: function(type)
        {
            if (!this.issetType(type)) {
                var message = type;
                return (new Subclass.Error.ErrorBase(message)).apply();
            }
            return Subclass.Tools.createClassInstance(this.getType(type));
        },

        /**
         * Registers new error type
         *
         * @method registerType
         * @memberOf Subclass.Error
         * @static
         *
         * @param {string} typeName
         *      The name of error type
         *
         * @param {Function} typeConstructor
         *      The constructor function of error type
         */
        registerType: function(typeName, typeConstructor)
        {
            if (!typeName || typeof typeName != 'string') {
                throw new Error(
                    'Specified invalid name of registering error type. ' +
                    'It must be a string'
                );
            }
            if (!typeConstructor || typeof typeConstructor != 'function') {
                throw new Error(
                    'Specified invalid constructor of registering error type. ' +
                    'It must be a function.'
                );
            }
            if (this.issetType(typeName)) {
                throw new Error(
                    'Can\'t register error type "' + typeName + '". ' +
                    'It\'s already exists'
                );
            }

            this._types[typeName] = typeConstructor;
        },

        /**
         * Returns constructor of early registered error type
         *
         * @method getType
         * @memberOf Subclass.Error
         * @static
         *
         * @param {string} typeName
         *      The name of error type
         *
         * @returns {Function}
         *      The error type constructor function
         */
        getType: function(typeName)
        {
            if (!this.issetType(typeName)) {
                throw new Error('Trying to get not registered error type constructor.');
            }
            return this._types[typeName];
        },

        /**
         * Checks whether the error type with specified name was registered
         *
         * @method issetType
         * @memberOf Subclass.Error
         * @static
         *
         * @param {string} typeName
         *      The name of error type
         *
         * @returns {boolean}
         */
        issetType: function(typeName)
        {
            return !!this._types[typeName];
        }
    };
}();

Subclass.Error.ErrorManager = Subclass.Error;