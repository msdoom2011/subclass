/**
 * @namespace
 */
Subclass.Parameter = {};

Subclass.Parameter.ParameterManager = (function()
{
    function ParameterManager(module)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            throw new Error('Invalid module argument. It must be instance of "Subclass.Module.Module" class.');
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
     * @returns {Subclass.Module.Module}
     */
    ParameterManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns registered parameters
     *
     * @param {boolean} [privateParameters = false]
     *      If passed true it returns parameters only from current module
     *      without parameters from its dependencies
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

            Subclass.Tools.extend(parameters, moduleParameters);
        });

        return parameters;
    };

    /**
     * Registers new parameter
     *
     * @param {string} paramName
     * @param {*} paramValue
     */
    ParameterManager.prototype.registerParameter = function(paramName, paramValue)
    {
        this._parameters[paramName] = new Subclass.Parameter.Parameter(paramName, paramValue);
    };

    /**
     * Sets parameter value
     *
     * @param {string} paramName
     * @param {*} paramValue
     */
    ParameterManager.prototype.setParameter = function(paramName, paramValue)
    {
        if (!this.issetProperty(paramName)) {
            throw new Error('Parameter with name "' + paramName + '" is not exists.');
        }
        this._parameters[paramName].setValue(paramValue);
    };

    /**
     * Returns parameter value
     *
     * @param {string} paramName
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
     * @param {boolean} privateParameters
     * @param {string} paramName
     * @returns {boolean}
     */
    ParameterManager.prototype.issetParameter = function(paramName, privateParameters)
    {
        return !!this.getParameters(privateParameters)[paramName];
    };

    return ParameterManager;

})();