/**
 * @namespace
 */
Subclass.Parameter = {};

/**
 * @class
 * @constructor
 * @description
 *
 * Instance of current class is used to managing of parameters:
 * registering new parameters, setting and getting their values.
 *
 * @throws {Error}
 *      Throws error if specified not valid module instance
 *
 * @param {Subclass.Module.Module} module
 *      The module instance
 */
Subclass.Parameter.ParameterManager = (function()
{
    /**
     * @alias Subclass.Parameter.ParameterManager
     */
    function ParameterManager(module)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            throw new Error(
                'Invalid module argument. ' +
                'It must be instance of "Subclass.Module.Module" class.'
            );
        }

        /**
         * Instance of module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * Collection of parameters
         *
         * @type {Object.<Subclass.Parameter.Parameter>}
         * @private
         */
        this._parameters = {};
    }

    /**
     * Returns module instance
     *
     * @method getModule
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     * @returns {Subclass.Module.Module}
     */
    ParameterManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns collection of registered parameters
     *
     * @method getParameters
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     *
     * @param {boolean} [privateParameters=false]
     *      If specified true it returns parameters only from current module
     *      without parameters from its dependency (plug-in) modules
     *
     * @returns {Object}
     */
    ParameterManager.prototype.getParameters = function(privateParameters)
    {
        var mainModule = this.getModule();
        var moduleManager = mainModule.getModuleManager();
        var parameters = {};
        var $this = this;

        if (privateParameters !== true) {
            privateParameters = false;
        }
        if (privateParameters) {
            return this._parameters;
        }

        moduleManager.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(parameters, $this._parameters);
                return;
            }
            var moduleParameterManager = module.getParameterManager();
            var moduleParameters = moduleParameterManager.getParameters();

            Subclass.Tools.extend(
                parameters,
                moduleParameters
            );
        });

        return parameters;
    };

    /**
     * Registers new parameter.<br /><br />
     *
     * Creates instance of {@link Subclass.Parameter.Parameter}
     *
     * @method registerParameter
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to register new parameter
     *      after when module became ready.
     *
     * @param {string} paramName
     *      The name of the registered parameter
     *
     * @param {*} paramValue
     *      The value of the registered parameter
     */
    ParameterManager.prototype.registerParameter = function(paramName, paramValue)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t register new parameter when module is ready.');
        }
        this._parameters[paramName] = new Subclass.Parameter.Parameter(
            paramName,
            paramValue
        );
    };

    /**
     * Sets parameter value
     *
     * @method setParameter
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change parameter value after when module became ready;<br />
     *      - trying to set value of non registered parameter.
     *
     * @param {string} paramName
     *      The name of the parameter
     *
     * @param {*} paramValue
     *      The new value of the parameter
     */
    ParameterManager.prototype.setParameter = function(paramName, paramValue)
    {
        if (this.getModule().isReady()) {
            throw new Error('Can\'t change parameter value when module is ready.');
        }
        if (!this.issetParameter(paramName)) {
            throw new Error('Parameter with name "' + paramName + '" is not exists.');
        }
        this._parameters[paramName].setValue(paramValue);
    };

    /**
     * Returns parameter value
     *
     * @method getParameter
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to get non registered parameter
     *
     * @param {string} paramName
     *      The name of the parameter
     *
     * @return {*}
     */
    ParameterManager.prototype.getParameter = function(paramName)
    {
        if (!this.issetParameter(paramName)) {
            throw new Error('Parameter with name "' + paramName + '" is not exists.');
        }
        return this.getParameters()[paramName].getValue();
    };

    /**
     * Checks whether parameter with passed name is exists
     *
     * @method issetParameter
     * @memberOf Subclass.Parameter.ParameterManager.prototype
     *
     * @param {string} paramName
     *      The name of interesting parameter
     *
     * @param {boolean} privateParameters
     *      Should check parameter presence only in current module
     *      or also try to search in its plug-ins.
     *
     * @returns {boolean}
     */
    ParameterManager.prototype.issetParameter = function(paramName, privateParameters)
    {
        return !!this.getParameters(privateParameters)[paramName];
    };

    return ParameterManager;

})();