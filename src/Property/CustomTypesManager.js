/**
 * @class
 */
Subclass.Property.CustomTypesManager = (function()
{
    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @constructor
     */
    function CustomTypesManager(propertyManager)
    {
        /**
         * @type {Subclass.Property.PropertyManager}
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

        var module = this.getPropertyManager().getModule();
        var eventManager = module.getEventManager();
        var $this = this;

        eventManager.getEvent('onLoadingEnd').addListener(function() {
            $this.initialize();
        });
    }

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
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
                Subclass.Error.create('InvalidArgument')
                    .argument("the data type definitions", false)
                    .received(definitions)
                    .expected('a plain object with another plain objects')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
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
            if (definitions.hasOwnProperty(typeName)) {
                this._typeDefinitions[typeName] = definitions[typeName];
            }
        }
    };

    /**
    * Initializing defined custom property types
    */
    CustomTypesManager.prototype.initialize = function()
    {
        var typeDefinitions = this.getTypeDefinitions();
        var propertyManager = this.getPropertyManager();
        var module = propertyManager.getModule();
        var typeName;

        // Adding default data types to the root module

        if (module.isRoot()) {
            var propertyTypes = propertyManager.constructor.getPropertyTypes();
            var defaultTypeDefinitions = {};

            for (typeName in propertyTypes) {
                if (!propertyTypes.hasOwnProperty(typeName)) {
                    continue;
                }
                var defaultPropertyDefinition = propertyTypes[typeName].getEmptyDefinition();

                if (defaultPropertyDefinition) {
                    defaultTypeDefinitions[typeName] = defaultPropertyDefinition;
                }
            }
            this._typeDefinitions = Subclass.Tools.extendDeep(
                defaultTypeDefinitions,
                this._typeDefinitions
            );
        }

        // Initializing type definitions

        for (typeName in typeDefinitions) {
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
     * @param {boolean} [privateDefinitions = false]
     *      If passed true it returns type definitions only from current module
     *      without type definitions from its plug-ins
     *
     * @returns {Object}
     */
    CustomTypesManager.prototype.getTypeDefinitions = function(privateDefinitions)
    {
        var mainModule = this.getPropertyManager().getModule();
        var moduleManager = mainModule.getModuleManager();
        var typeDefinitions = {};
        var $this = this;

        if (privateDefinitions !== true) {
            privateDefinitions = false;
        }
        if (privateDefinitions) {
            return this._typeDefinitions;
        }

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(typeDefinitions, $this._typeDefinitions);
                return;
            }
            var moduleCustomTypesManager = module.getPropertyManager().getCustomTypesManager();
            var moduleDefinitions = moduleCustomTypesManager.getTypeDefinitions();

            Subclass.Tools.extend(typeDefinitions, moduleDefinitions);
        });

        return typeDefinitions;
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
            Subclass.Error.create('Trying to get non existent custom property type "' + typeName + '".');
        }
        return this.getTypeDefinitions()[typeName];
    };

    /**
     * Returns custom types
     *
     * @param {boolean} [privateTypes = false]
     *      If passed true it returns data types only from current module
     *      without data types from its plug-ins
     *
     * @returns {Object}
     */
    CustomTypesManager.prototype.getTypes = function(privateTypes)
    {
        var mainModule = this.getPropertyManager().getModule();
        var moduleManager = mainModule.getModuleManager();
        var dataTypes = {};
        var $this = this;

        if (privateTypes !== true) {
            privateTypes = false;
        }
        if (privateTypes) {
            return this._types;
        }

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(dataTypes, $this._types);
                return;
            }
            var moduleCustomTypesManager = module.getPropertyManager().getCustomTypesManager();
            var moduleDataTypes = moduleCustomTypesManager.getTypes();

            Subclass.Tools.extend(dataTypes, moduleDataTypes);
        });

        return dataTypes;
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
            Subclass.Error.create('Trying to get non existent custom property type "' + typeName + '".');
        }
        return this.getTypes()[typeName];
    };

    /**
     * Checks if specified custom property type is exists
     *
     * @param {string} typeName
     * @returns {boolean}
     */
    CustomTypesManager.prototype.issetType = function(typeName)
    {
        return !!this.getTypeDefinitions()[typeName];
    };

    return CustomTypesManager;
})();