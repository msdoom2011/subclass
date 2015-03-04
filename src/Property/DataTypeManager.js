/**
 * @class
 * @constructor
 * @description
 *
 * The class which contains definitions of global data types.
 * It is standard data types like "string", "number", "boolean", "object", "map" etc.
 *
 * Also it is possible to define custom data types based on standard ones.
 * It is convenient in cases when you want to use the same property definition in many places.
 *
 * The profit of global data types in ability to check does your value fit to the global data type.
 * Also
 *
 * @throws {Error}
 *      Throws error if specified invalid property manager instance
 *
 * @param {Subclass.Property.PropertyManager} propertyManager
 *      The instance of property manager
 */
Subclass.Property.DataTypeManager = (function()
{
    function DataTypeManager(propertyManager)
    {
        if (!propertyManager || !(propertyManager instanceof Subclass.Property.PropertyManager)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the instance of property manager')
                .received(propertyManager)
                .expected('an instance of class "Subclass.Property.PropertyManager"')
                .apply()
            ;
        }

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
            $this.initializeTypes();
        });
    }

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    DataTypeManager.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Validates data type definitions
     *
     * @param {Object.<Object>} definitions
     * @throws {Error}
     */
    DataTypeManager.prototype.validateTypeDefinitions = function(definitions)
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
    DataTypeManager.prototype.addTypeDefinitions = function(definitions)
    {
        this.validateTypeDefinitions(definitions);

        for (var typeName in definitions) {
            if (definitions.hasOwnProperty(typeName)) {
                this._typeDefinitions[typeName] = definitions[typeName];
            }
        }
    };

    DataTypeManager.prototype.initialize = function()
    {
        var propertyManager = this.getPropertyManager();
        var module = propertyManager.getModule();

        if (module.isRoot()) {
            var propertyTypes = propertyManager.constructor.getPropertyTypes();
            var defaultTypeDefinitions = {};

            for (var typeName in propertyTypes) {
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
    };

    /**
    * Initializing defined custom property types
    */
    DataTypeManager.prototype.initializeTypes = function()
    {
        var typeDefinitions = this.getTypeDefinitions();
        //var propertyManager = this.getPropertyManager();
        //var module = propertyManager.getModule();
        //var typeName;

        // Adding default data types to the root module

        //if (module.isRoot()) {
        //    var propertyTypes = propertyManager.constructor.getPropertyTypes();
        //    var defaultTypeDefinitions = {};
        //
        //    for (typeName in propertyTypes) {
        //        if (!propertyTypes.hasOwnProperty(typeName)) {
        //            continue;
        //        }
        //        var defaultPropertyDefinition = propertyTypes[typeName].getEmptyDefinition();
        //
        //        if (defaultPropertyDefinition) {
        //            defaultTypeDefinitions[typeName] = defaultPropertyDefinition;
        //        }
        //    }
        //    this._typeDefinitions = Subclass.Tools.extendDeep(
        //        defaultTypeDefinitions,
        //        this._typeDefinitions
        //    );
        //}

        // Initializing type definitions

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
     * @param {boolean} [privateDefinitions = false]
     *      If passed true it returns type definitions only from current module
     *      without type definitions from its plug-ins
     *
     * @returns {Object}
     */
    DataTypeManager.prototype.getTypeDefinitions = function(privateDefinitions)
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
            var moduleDataTypeManager = module.getPropertyManager().getDataTypeManager();
            var moduleDefinitions = moduleDataTypeManager.getTypeDefinitions();

            Subclass.Tools.extend(typeDefinitions, moduleDefinitions);
        });

        return typeDefinitions;
    };

    /**
     * Returns definition of data type
     *
     * @param {string} typeName
     * @returns {Object}
     * @throws {Error}
     */
    DataTypeManager.prototype.getTypeDefinition = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypeDefinitions()[typeName];
    };

    /**
     * Returns data types
     *
     * @param {boolean} [privateTypes = false]
     *      If passed true it returns data types only from current module
     *      without data types from its plug-ins
     *
     * @returns {Object}
     */
    DataTypeManager.prototype.getTypes = function(privateTypes)
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
            var moduleDataTypeManager = module.getPropertyManager().getDataTypeManager();
            var moduleDataTypes = moduleDataTypeManager.getTypes();

            Subclass.Tools.extend(dataTypes, moduleDataTypes);
        });

        return dataTypes;
    };

    /**
     * Returns data type instance
     *
     * @param {string} typeName
     * @returns {PropertyType}
     */
    DataTypeManager.prototype.getType = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypes()[typeName];
    };

    /**
     * Checks if specified data type exists
     *
     * @param {string} typeName
     * @returns {boolean}
     */
    DataTypeManager.prototype.issetType = function(typeName)
    {
        return !!this.getTypeDefinitions()[typeName];
    };

    return DataTypeManager;
})();