/**
 * @class
 */
Subclass.PropertyManager.CustomTypesManager = (function()
{
    /**
     * @param {PropertyManager} propertyManager
     * @constructor
     */
    function CustomTypesManager(propertyManager)
    {
        /**
         * @type {PropertyManager}
         * @private
         */
        this._propertyManager = propertyManager;

        /**
         * @type {(Object.<Object>|{})}
         * @private
         */
        this._typeDefinitions = {};

        /**
         * @type {(Object.<PropertyType>|{})}
         * @private
         */
        this._types = {};
    }

    /**
     * Returns property manager instance
     *
     * @returns {PropertyManager}
     */
    CustomTypesManager.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Sets custom types definitions
     *
     * @param {Object.<Object>} definitions
     * @throws {Error}
     */
    CustomTypesManager.prototype.validateTypeDefinitions = function(definitions)
    {
        try {
            if (!Subclass.Tools.isPlainObject(definitions)) {
                throw 'error';
            }
            for (var typeName in definitions) {
                if (!definitions.hasOwnProperty(typeName)) {
                    continue;
                }
                if (!Subclass.Tools.isPlainObject(definitions[typeName])) {
                    throw 'error';
                }
            }

        } catch (e) {
            if (e == 'error') {
                throw new Error('Invalid argument "definitions" in method "setTypeDefinitions" in class "CustomTypesManager". ' +
                    'It must be a plain object that contains another plain objects.');
            }
            throw e;
        }
    };

    /**
     * Sets custom types definitions
     *
     * @param {Object.<Object>} definitions
     */
    CustomTypesManager.prototype.setTypeDefinitions = function(definitions)
    {
        this.validateTypeDefinitions(definitions);

        this._typeDefinitions = definitions;
        this.initialize();
    };

    /**
     * Adds new type definitions
     *
     * @param {Object.<Object>} definitions
     */
    CustomTypesManager.prototype.addTypeDefinitions = function(definitions)
    {
        this.validateTypeDefinitions(definitions);

        for (var typeName in definitions) {
            if (!definitions.hasOwnProperty(typeName)) {
                continue;
            }
            var typeDefinition = definitions[typeName];

            this._typeDefinitions[typeName] = typeDefinition;
            this._types[typeName] = this.getPropertyManager().createProperty(
                typeName,
                Subclass.Tools.copy(typeDefinition)
            );
        }
    };

    /**
     * Initializing defined custom property types
     */
    CustomTypesManager.prototype.initialize = function()
    {
        var typeDefinitions = this.getTypeDefinitions();

        for (var typeName in typeDefinitions) {
            if (!typeDefinitions.hasOwnProperty(typeName)) {
                continue;
            }
            var typeDefinition = typeDefinitions[typeName];

            this._types[typeName] = this.getPropertyManager().createProperty(
                typeName,
                Subclass.Tools.copy(typeDefinition)
            );
        }
    };

    /**
     * Returns definitions of custom types
     *
     * @returns {Object.<Object>}
     */
    CustomTypesManager.prototype.getTypeDefinitions = function()
    {
        return this._typeDefinitions;
    };

    /**
     * Returns definition of custom property type
     *
     * @param {string} typeName
     * @returns {Object}
     * @throws {Error}
     */
    CustomTypesManager.prototype.getTypeDefinition = function(typeName)
    {
        if (!this.issetType(typeName)) {
            throw new Error('Trying to get non existent custom property type "' + typeName + '".');
        }
        return this._typeDefinitions[typeName];
    };

    /**
     * Returns custom property type instance
     *
     * @param {string} typeName
     * @returns {PropertyType}
     */
    CustomTypesManager.prototype.getType = function(typeName)
    {
        if (!this.issetType(typeName)) {
            throw new Error('Trying to get non existent custom property type "' + typeName + '".');
        }
        return this._types[typeName];
    };

    /**
     * Checks if specified custom property type is exists
     *
     * @param {string} typeName
     * @returns {boolean}
     */
    CustomTypesManager.prototype.issetType = function(typeName)
    {
        return !!this._typeDefinitions[typeName];
    };

    return CustomTypesManager;
})();