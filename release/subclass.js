/**
 * Subclass - v0.1.0 - 2015-10-07
 * https://github.com/msdoom2011/subclass-framework
 *
 * Copyright (c) 2015 Dmitry Osipishin | msdoom2011@gmail.com
 */
(function() {
"use strict";

/**
 * @class
 * @global
 * @name Subclass
 * @namespace
 * @description
 *      The basic class for creating new application
 *      based on Subclass framework.
 */
window.Subclass = (function()
{
    /**
     * Reports whether the Subclass was initialized
     *
     * @type {boolean}
     * @private
     */
    var _initialized = false;

    /**
     * Collection of registered modules
     *
     * @type {Array.<Subclass.Module>}
     * @private
     */
    var _modules = [];

    /**
     * Collection of registered Subclass plugins
     *
     * @type {Object.<Function>}
     * @private
     */
    var _plugins = {};


    return {

        /**
         * Creates new subclass module.<br /><br />
         *
         * Creates instance of {@link Subclass.Module}
         *
         * @param {string} moduleName
         *      A name of the future module
         *
         * @param {Array} [modulePlugins]
         *      The names of the modules that you want to include to the current module
         *      or if plug-in modules are not loaded at the moment you can specify
         *      objects like: { name: "pluginModuleName", file: "file/of/module.js" }
         *      to automatically load it during initializing module.
         *
         * @param {Object} [moduleSettings = {}]
         *      Settings of the creating module
         *
         * @returns {Subclass.ModuleAPI}
         * @memberOf Subclass
         * @static
         *
         * @example
         * ...
         *
         * // The simplest way to create module
         * var app = Subclass.createModule("app");
         *
         * // Creating module with settings and without plugins
         * var app = Subclass.createModule("app", {
         *      // Optional module settings
         * });
         *
         * // Creating module with plugins which are loaded to the document at the moment
         * var app = Subclass.createModule("app", ["plugin1", "plugin2"], {
         *      // Optional module settings
         * });
         *
         * // Creating module with plugins which are not loaded to the document at the moment
         * var app = Subclass.createModule("app", [
         *      {
         *          name: "plugin1",
         *          file: "file/of/plugin1.js"
         *      }, {
         *          name: "plugin2",
         *          file: "file/of/plugin2.js"
         *      }
         * ], {
         *      // Optional module settings
         * });
         *
         * // Creating module with loaded and not loaded plugins to the document at the moment
         * var app = Subclass.createModule("app", [
         *      plugin1,
         *      plugin2,
         *      {
         *          name: "plugin3",
         *          file: "path/to/file/of/plugin3.js"
         *      }, {
         *          name: "plugin4",
         *          file: "path/to/file/of/plugin4.js"
         *      }
         * ], {
         *      // Optional module settings
         * });
         */
        createModule: function(moduleName, modulePlugins, moduleSettings)
        {
            if (Subclass.Tools.isPlainObject(modulePlugins)) {
                moduleSettings = modulePlugins;
                modulePlugins = [];
            }
            if (!modulePlugins) {
                modulePlugins = [];
            }

            // Initializes Subclass

            this._initialize();

            // If for registering module exists plugins

            for (var i = 0; i < _modules.length; i++) {
                var registeredModuleName = _modules[i].getName();
                var pluginOf = _modules[i].getSettingsManager().getPluginOf();

                if (pluginOf == moduleName) {
                    modulePlugins.push(registeredModuleName);
                }
            }

            modulePlugins = Subclass.Tools.unique(modulePlugins);
            var lazyPlugins = [];

            function throwInvalidPluginDef(optName, optType) {
                Subclass.Error.create(
                    'Specified invalid plug-in module definition while creating module "' + moduleName + '". ' +
                    'The required option "' + optName + '" was missed or is not ' + optType + '.'
                );
            }

            for (i = 0; i < modulePlugins.length; i++) {
                if (Subclass.Tools.isPlainObject(modulePlugins[i])) {
                    var moduleDef = modulePlugins[i];
                    lazyPlugins.push(modulePlugins[i]);

                    if (!moduleDef.name || typeof moduleDef.name != 'string') {
                        throwInvalidPluginDef('name', 'a string');

                    } else if (Subclass.issetModule(moduleDef.name)) {
                        continue;
                    }
                    if (!moduleDef.file || typeof moduleDef.file != 'string') {
                        throwInvalidPluginDef('file', 'a string');
                    }
                }
            }

            // Creating instance of module

            var module = Subclass.Tools.createClassInstance(Subclass.Module,
                moduleName,
                modulePlugins,
                moduleSettings
            );
            _modules.push(module);

            if (lazyPlugins.length) {
                var loadManager = module.getLoadManager();

                for (i = 0; i < lazyPlugins.length; i++) {
                    var pluginName = lazyPlugins[i].name;
                    var fileName = lazyPlugins[i].file;

                    if (!fileName.match(/^\^/)) {
                        fileName = "^" + fileName;
                    }
                    (function(fileName, pluginName) {
                        loadManager.loadFile(fileName, function () {
                            module.addPlugin(pluginName);
                        });
                    })(fileName, pluginName);
                }
            }

            return module.getAPI();
        },

        /**
         * Loads module if it wasn't loaded earlier
         *
         * @memberOf Subclass
         *
         * @param {string} moduleFileName
         * @param {Function} callback
         * @returns {XMLHttpRequest}
         */
        loadModule: function(moduleFileName, callback)
        {
            return Subclass.Tools.loadJS(moduleFileName, callback);
        },

        /**
        * Returns public API for the module with specified name
        *
        * @param {string} moduleName
        *      A name of module which you want to receive
        *
        * @returns {Subclass.ModuleAPI}
        * @memberOf Subclass
        * @static
        */
        getModule: function(moduleName)
        {
            if (!this.issetModule(moduleName)) {
                Subclass.Error.create('Trying to get non existent module "' + moduleName + '".');
            }
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i].getName() == moduleName) {
                    return _modules[i].getAPI();
                }
            }
        },

        /**
         * Checks whether module with specified name exists
         *
         * @param {string} moduleName
         *      A module name that you want to check whether it exists
         *
         * @returns {boolean}
         * @memberOf Subclass
         * @static
         */
        issetModule: function(moduleName)
        {
            for (var i = 0; i < _modules.length; i++) {
                if (_modules[i].getName() == moduleName) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Registers new Subclass plug-in
         *
         * @method registerPlugin
         * @memberOf Subclass
         * @static
         *
         * @param {string} pluginClass
         *      The name of Subclass plug-in
         */
        registerPlugin: function(pluginClass)
        {
            if (typeof pluginClass != 'function') {
                Subclass.Error.create('InvalidArgument')
                    .argument('the Subclass plugin constructor', false)
                    .expected('a function')
                    .received(pluginClass)
                    .apply()
                ;
            }
            var pluginClassConstructor = Subclass.Tools.buildClassConstructor(pluginClass);
            var pluginName = pluginClassConstructor.getName();

            _plugins[pluginName] = pluginClassConstructor;
        },

        /**
         * Checks whether Subclass plug-in with specified name is registered
         *
         * @method issetPlugin
         * @memberOf Subclass
         *
         * @param {string} pluginName
         *      The name of Subclass plug-in
         */
        issetPlugin: function(pluginName)
        {
            return _plugins.hasOwnProperty(pluginName);
        },

        /**
         * Returns all registered Subclass plug-ins
         *
         * @method getPlugins
         * @memberOf Subclass
         *
         * @returns {Object.<Function>}
         */
        getPlugins: function()
        {
            return _plugins;
        },

        /**
         * Initializes Subclass
         *
         * @method _initialize
         * @private
         * @static
         */
        _initialize: function()
        {
            if (_initialized) {
                return;
            }
            for (var pluginName in _plugins) {
                if (!_plugins.hasOwnProperty(pluginName)) {
                    continue;
                }
                var plugin = _plugins[pluginName];
                var pluginDependencies = plugin.getDependencies();

                for (var i = 0; i < pluginDependencies.length; i++) {
                    if (!Subclass.issetPlugin(pluginDependencies[i])) {
                        Subclass.Error.create(
                            'The Subclass plug-in "' + pluginName + '" ' +
                            'requires the "' + pluginDependencies.join('", "') + '" plug-in(s) to be uploaded.'
                        );
                    }
                }
                _initialized = true;
            }
        }
    };
})();

// Source file: Extension.js

/**
 * @class
 * @constructor
 */
Subclass.Extension = function()
{
    function Extension(classInst)
    {
        // Do nothing
    }

    Extension.$parent = null;

    /**
     * Configuration of extension
     *
     * @type {Object}
     */
    Extension.$config = {
        supports: []
    };

    /**
     * Instance of any class which extends Subclass.Extendable class
     *
     * @param {Subclass.Extendable} classInst
     */
    Extension.initialize = function(classInst)
    {
        // Do some initialization operations
    };

    /**
     * Returns extension configuration
     *
     * @returns {Object}
     */
    Extension.getConfig = function()
    {
        return this.$config;
    };

    /**
     * Returns extension configuration
     *
     * @param config
     */
    Extension.setConfig = function(config)
    {
        if (!config || typeof config != 'object') {
            Subclass.Error.create("InvalidArgument")
                .argument('the class configuration object', false)
                .expected('an object')
                .received(config)
                .apply()
            ;
        }
        this.$config = config;
    };

    return Extension;
}();

// Source file: Extendable.js

Subclass.Extendable = function()
{
    function Extendable()
    {
        // Do nothing
    }

    /**
     * An array of class type extensions
     *
     * @type {Array.<Function>}
     */
    Extendable.$extensions = [];

    /**
     * Registers class extension
     *
     * @param {Function} classExtension
     *      The constructor of class extension
     */
    Extendable.registerExtension = function(classExtension)
    {
        this.$extensions.push(classExtension);
    };

    /**
     * Returns all registered extensions
     *
     * @returns {Array.<Function>}
     */
    Extendable.getExtensions = function()
    {
        return this.$extensions;
    };

    /**
     * Checks whether current extension was specified
     *
     * @param {Function} classExtension
     *      The constructor of class extension
     *
     * @returns {boolean}
     */
    Extendable.hasExtension = function(classExtension)
    {
        return this.$extensions.indexOf(classExtension) >= 0
    };

    /**
     * Clears all registered extensions
     */
    Extendable.clearExtensions = function()
    {
        this.$extensions = [];
    };

    /**
     * Initializes extensions
     */
    Extendable.prototype.initializeExtensions = function()
    {
        var extensions = this.constructor.getExtensions();

        for (var i = 0; i < extensions.length; i++) {
            extensions[i] = Subclass.Tools.buildClassConstructor(extensions[i]);
            extensions[i].initialize(this);
        }
    };

    return Extendable;
}();

// Source file: Tools/Tools.js

/**
 * @class
 * @description
 *
 * The class which contains static methods for solving different tasks.
 */
Subclass.Tools = (function()
{
    return {

        /**
         * Extends target object or array with source object or array without recursion.<br /><br />
         *
         * Every property in the source object or array will replace
         * already existed property with the same name in the target object or array.
         *
         * @method extend
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {(Object|Array)} target
         *      An object which will receive properties from source object
         *
         * @param {(Object|Array)} source
         *      An object which properties will be transferred to the target object
         *
         * @param {boolean} [withInheritedProps = false]
         *      A marker which indicates whether will be transferred
         *      inherited (from prototype) properties from source to target object
         *
         * @returns {(Object|Array)}
         *      Returns the target object after it was extended
         */
        extend: function (target, source, withInheritedProps)
        {
            if (withInheritedProps !== true) {
                withInheritedProps = false;
            }
            if (typeof target != 'object' && source != 'object') {
                return target;
            }
            if (
                (!Array.isArray(target) && Array.isArray(source))
                || (Array.isArray(target) && !Array.isArray(source))
            ) {
                return target;
            }
            if (Array.isArray(target)) {
                for (var i = 0; i < source.length; i++) {
                    target.push(source[i]);
                }
            } else {
                for (var propName in source) {
                    if (!source.hasOwnProperty(propName) && !withInheritedProps) {
                        continue;
                    }
                    if (Array.isArray(source[propName])) {
                        target[propName] = [];
                        target[propName] = target[propName].concat(source[propName]);

                    } else {
                        target[propName] = source[propName];
                    }
                }
            }
            return target;
        },

        /**
         * Copies all properties from source to target with recursion call.<br /><br />
         *
         * Every property in the source object or array will replace
         * already existed property with the same name in the target object or array.
         *
         * @method extendDeep
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {(Object|Array)} target
         *      Target object which will extended by properties from source object
         *
         * @param {(Object|Array)} source
         *      Source object which properties will added to target object
         *
         * @param {(Function|boolean)} [mergeArrays=false]
         * <pre>
         * If was passed true it means that elements from source array properties
         * will be added to according array properties in target.
         *
         * Else if it was passed false (by default) it means that array properties
         * from source object will replace array properties in target object.
         *
         * If was passed a function it means that will added all element from array
         * property in source to according array property in target if specified
         * function returns true.
         *
         * Example: function (targetArrayPropertyElement, sourceArrayPropertyElement) {
         *     return targetArrayPropertyElement.name != sourceArrayPropertyElement.name;
         * });
         * </pre>
         * @param {boolean} [withInheritedProps=false]
         *      It is needed if you want to copy inherited properties.
         *
         * @returns {*}
         *      Returns the target object after it was extended
         */
        extendDeep: function extendDeep(target, source, mergeArrays, withInheritedProps)
        {
            if (withInheritedProps !== true) {
                withInheritedProps = false;
            }
            if (
                !mergeArrays
                || (
                    typeof mergeArrays != "boolean"
                    && typeof mergeArrays != "function"
                )
            ) {
                mergeArrays = false;
            }

            var comparator = false;

            if (typeof mergeArrays == 'function') {
                comparator = mergeArrays;
                mergeArrays = true;
            }

            // Handle case when target is a string or something

            if (typeof target != "object" && typeof target != 'function') {
                target = {};
            }

            function isEqual(target, element)
            {
                for (var i = 0; i < target.length; i++) {
                    if (comparator(target[i], element)) {
                        return true;
                    }
                }
                return false;
            }

            function isPlainObject(obj)
            {
                if (
                    typeof obj != "object"
                    || obj === null
                    || obj.nodeType
                    || obj == window
                ) {
                    return false;
                }
                return !(
                    obj.constructor
                    && !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")
                );
            }

            // Extend the base object

            for (var propName in source) {
                var sourceItemIsArray;

                if (!withInheritedProps && !source.hasOwnProperty(propName)) {
                    continue;
                }

                // Prevent never-ending loop

                if (target === source[propName]) {
                    continue;
                }

                // Recourse if we're merging plain objects or arrays

                if (
                    source[propName]
                    && (
                    isPlainObject(source[propName])
                    || (
                    mergeArrays
                    && (sourceItemIsArray = Array.isArray(source[propName]))
                    )
                    )
                ) {
                    var clone;

                    // If copying array

                    if (sourceItemIsArray && mergeArrays) {
                        sourceItemIsArray = false;
                        clone = [];

                        if (target[propName] && Array.isArray(target[propName])) {
                            for (var k = 0; k < source[propName].length; k++) {
                                if (
                                    !comparator
                                    || (
                                        typeof comparator == 'function'
                                        && !isEqual(target[propName], source[propName][k])
                                    )
                                ) {
                                    target[propName].push(source[propName][k]);
                                }
                            }
                            continue;
                        }

                        // If copying non array

                    } else {
                        clone = target[propName] && isPlainObject(target[propName])
                            ? target[propName]
                            : {}
                        ;
                    }

                    // Never move original objects, clone them

                    target[propName] = extendDeep.call(
                        this,
                        clone,
                        source[propName],
                        comparator || mergeArrays,
                        withInheritedProps
                    );

                    // Don't bring in undefined values

                } else if (source[propName] !== undefined) {
                    target[propName] = source[propName];
                }
            }

            // Return the modified object

            return target;
        },

        /**
         * Returns a copy of passed object or array
         *
         * @method copy
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} arg
         *      The argument which you want to copy
         *
         * @returns {*}
         *      The copy of passed argument
         */
        copy: function (arg)
        {
            var newObj;

            if (
                arg
                && typeof arg == 'object'
                && (
                    arg.constructor == Object
                    || Array.isArray(arg)
                )
            ) {
                newObj = !Array.isArray(arg) ? Object.create(Object.getPrototypeOf(arg)) : [];
                newObj = this.extendDeep(newObj, arg, true);

            } else {
                newObj = arg;
            }
            return newObj;
        },

        /**
         * Checks whether two arguments are equals
         *
         * @method isEqual
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} arg1
         *      The left side operand
         *
         * @param {*} arg2
         *      The right side operand
         *
         * @returns {boolean}
         *      Returns true if two argument are equals
         */
        isEqual: function (arg1, arg2)
        {
            if (typeof arg1 == 'function' && typeof arg2 == 'function') {
                return true;
            }
            if (typeof arg1 !== 'object' && typeof arg2 !== 'object') {
                return arg1 === arg2;
            }
            if (typeof arg1 !== typeof arg2) {
                return false;
            }
            if ((!arg1 && arg2) || (arg1 && !arg2)) {
                return false;
            }
            if (!arg1 && !arg2) {
                return true;
            }
            if (arg1.constructor != arg2.constructor) {
                return false;
            }
            if (Array.isArray(arg1)) {
                if (arg1.length != arg2.length) {
                    return false;
                }
                for (var i = 0; i < arg1.length; i++) {
                    if (this.isEqual(arg1[i], arg2[i]) === false) {
                        return false;
                    }
                }
                return true;
            }
            if (this.isPlainObject(arg1)) {
                if (Object.keys(arg1).length != Object.keys(arg2).length) {
                    return false;
                }
                for (var propName in arg1) {
                    if (arg1.hasOwnProperty(propName)) {
                        if (this.isEqual(arg1[propName], arg2[propName]) === false) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return arg1 == arg2;
        },

        /**
         * Returns array with unique elements
         *
         * @method unique
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {Array} array
         *      The array which contains duplicate elements
         *
         * @returns {Array}
         *      Returns array which contains unique elements only.
         */
        unique: function (array)
        {
            var uniqueArray = [];

            if (!Array.isArray(array)) {
                return array;
            }
            for (var i = 0; i < array.length; i++) {
                if (uniqueArray.indexOf(array[i]) < 0) {
                    uniqueArray.push(array[i]);
                }
            }
            return uniqueArray;
        },

        /**
         * Returns all own enumerable object properties
         *
         * @method getObjectProperties
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {Object} object
         * @returns {Object}
         */
        getObjectProperties: function(object)
        {
            var props = {};

            for (var propName in object) {
                if (object.hasOwnProperty(propName)) {
                    props[propName] = object[propName];
                }
            }
            return props;
        }
    };
})();

// Source file: Tools/ConverterTools.js

Subclass.Tools.ConverterTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Converting number to formatted string with thousands separator (comma by default)
         *
         * @method convertNumberToString
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {(number|string)} number
         *      Input parameter
         *
         * @param {string} thousandsSeparator
         *      The thousands separator string
         *
         * @returns {string}
         */
        convertNumberToString: function(number, thousandsSeparator)
        {
            var inputNumber = number;

            if (!thousandsSeparator) {
                thousandsSeparator = ",";
            }
            if (typeof number == 'string') {
                number = number.replace(/(^\s+)|(\s+$)/g, '');
                number = number.replace(/(\d+)[\,\s]+(\d+)+/g, '$1$2');
            }
            if (
                number === null
                || number === undefined
                || isNaN(parseFloat(number))
                || number.toString().match(/.+\-.+/)
            ) {
                return inputNumber;
            }
            var parts = number.toString().split(".");
            parts[0] = parts[0].replace(/\b(?=(\d{3})+(?!\d))/g, thousandsSeparator);

            return parts.join(".");
        },

        /**
         * Converts string to number if it is possible or returns false otherwise.
         *
         * @method convertStringToNumber
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} string
         *      The string you want convert to number
         *
         * @returns {(number|boolean)}
         *      It the string can be converted to number it will be returned the number.
         *      Otherwise it will be returned false.
         */
        convertStringToNumber: function(string)
        {
            if (typeof string == 'number') {
                return string;
            }
            if (!string) {
                return 0;
            }
            if (
                string === null
                || string === undefined
                || isNaN(parseFloat(string))
                || string.match(/.+\-.+/)
            ) {
                return false;
            }
            var temp = string
                .replace(/[^0-9,\s]+$/, '')
                .replace(/[\,\s]+/g, '')
            ;
            if (!isNaN(parseFloat(temp))) {
                return parseFloat(temp);
            }
            return false;
        },

        /**
         * Returns suffix that is next to parsed number in passed string.
         *
         * @method getNumberSuffix
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} numeric
         *      The value that contains not numbers at the end of string.
         *
         * @returns {string}
         */
        getNumberSuffix: function(numeric)
        {
            if (typeof numeric == 'number' || !numeric) {
                return "";
            }
            var result = numeric.match(/[^0-9]+$/);

            if (result && result.length) {
                return result[0];
            }
            return "";
        },

        /**
         * Returns the number precision
         *
         * @method getNumberPrecision
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {(string|number)} numeric
         *      The numeric string or number
         *
         * @returns {number}
         */
        getNumberPrecision: function(numeric)
        {
            if (!this.isNumeric(numeric)) {
                return 0;
            }
            numeric = String(numeric);
            var result = numeric.match(/\.([0-9])+/i);

            return result ? result[1].length : 0;
        }
    });

    return Subclass.Tools;

})();

// Source file: Tools/CheckTools.js

Subclass.Tools.CheckTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Checks if passed value is empty
         *
         * @method isEmpty
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's empty
         *
         * @returns {boolean}
         */
        isEmpty: function(value)
        {
            return (
                !value
                || (this.isObject(value) && Object.keys(value).length == 0)
                || (this.isArray(value) && value.length == 0)
            );
        },

        /**
         * Checks if passed value undefined
         *
         * @method isUndef
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's undefined
         *
         * @returns {boolean}
         */
        isUndef: function(value)
        {
            return value === undefined;
        },

        /**
         * Checks if passed value is undefined or null
         *
         * @method isUndefOrNull
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's undefined or null
         *
         * @returns {boolean}
         */
        isUndefOrNull: function(value)
        {
            return this.isUndef(value) || value === null;
        },

        /**
         * Checks if passed value is null
         *
         * @method isNull
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's null
         *
         * @returns {boolean}
         */
        isNull: function(value)
        {
            return value === null;
        },

        /**
         * Checks if passed value is object (but not an array or a null)
         *
         * @method isObject
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's object
         *      and is not a null at the same time
         *
         * @returns {boolean}
         */
        isObject: function(value)
        {
            return (
                value !== null
                && typeof value === 'object'
                && !this.isArray(value)
            );
        },

        /**
         * Checks if passed value is a plain object
         *
         * @method isPlainObject
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a plain object
         *
         * @returns {boolean}
         */
        isPlainObject: function(value)
        {
            if (
                typeof value != "object"
                || value === null
                || value.nodeType
                || value == window
            ) {
                return false;
            }
            return !(
                value.constructor
                && !value.constructor.prototype.hasOwnProperty("isPrototypeOf")
            );
        },

        /**
         * Checks if passed value is an array
         *
         * @method isArray
         * @memberOf Subclass.Tools
         * @static
         *
         * @param value
         *      The value you want to check if it's an array
         *
         * @returns {boolean}
         */
        isArray: function(value)
        {
            return Array.isArray(value);
        },

        /**
         * Checks if passed value is a boolean
         *
         * @method isBoolean
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a boolean
         *
         * @returns {boolean}
         */
        isBoolean: function(value)
        {
            return typeof value == 'boolean';
        },

        /**
         * Checks if passed value is string
         *
         * @method isString
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a string
         *
         * @returns {boolean}
         */
        isString: function(value)
        {
            return typeof value == 'string';
        },

        /**
         * Checks if passed value is number
         *
         * @method isNumber
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's a number
         *
         * @returns {boolean}
         */
        isNumber: function(value)
        {
            return typeof value == 'number';
        },

        /**
         * Checks if passed value is even number
         *
         * @method isNumberEven
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {*} value
         *      The value you want to check if it's an even number
         *
         * @returns {boolean}
         */
        isNumberEven: function(value)
        {
            if (!this.isNumber(value)) {
                Subclass.Error.create('Trying to check whether is even the not number value.');
            }
            return value % 2 == 0;
        },

        /**
         * Checks if specified string can be converted to number
         *
         * @method isNumeric
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} numeric
         *      The value you want to check if it can be converted to number
         *
         * @returns {boolean}
         */
        isNumeric: function(numeric)
        {
            var number = this.convertStringToNumber(numeric);
            return number !== false;
        }
    });

    return Subclass.Tools;

})();

// Source file: Tools/ClassTools.js

Subclass.Tools.CheckTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Builds the class constructor. It setups the inheritance of class constructor.<br /><br />
         *
         * You can specify two properties directly in constructor function:<br />
         * - $parent - constructor of parent class;<br />
         * - $mixins - array of constructors which method and properties will be added to current constructor.
         *
         * @param {Function} constructor
         *      The class constructor function
         *
         * @returns {Function}
         */
        buildClassConstructor: function(constructor)
        {
            if (constructor.$built) {
                return constructor;
            }
            var constructorProto = constructor.prototype;
            var constructorProtoCopy = {};
            var constructorStatic = {};
            var constructorStaticCopy = {};

            Subclass.Tools.extend(constructorProtoCopy, Subclass.Tools.getObjectProperties(constructorProto));
            Subclass.Tools.extend(constructorStaticCopy, Subclass.Tools.getObjectProperties(constructor));

            function extendStaticProperties(target, source)
            {
                for (var staticPropName in source) {
                    if (
                        source.hasOwnProperty(staticPropName)
                        && ["$parent", "$mixins"].indexOf(staticPropName) < 0
                    ) {
                        target[staticPropName] = source[staticPropName];
                    }
                }
                return target;
            }

            function extendMixinsProto(constructorProto, mixins)
            {
                for (var i = 0; i < mixins.length; i++) {
                    Subclass.Tools.extend(constructorProto, mixins[i].prototype);
                }
            }

            function extendMixinsStatic(constructor, mixins)
            {
                for (var i = 0; i < mixins.length; i++) {
                    Subclass.Tools.extend(constructor, Subclass.Tools.getObjectProperties(mixins[i]));
                }
            }

            if (constructor.$parent) {
                var parentConstructor = this.buildClassConstructor(constructor.$parent);
                constructorProto = Object.create(parentConstructor.prototype);

                extendStaticProperties(constructorStatic, parentConstructor);

                if (constructor.$mixins) {
                    extendMixinsProto(constructorProto, constructor.$mixins);
                    extendMixinsStatic(constructor, constructor.$mixins);
                }
            } else if (constructor.$mixins) {
                extendMixinsProto(constructorProto, constructor.$mixins);
                extendMixinsStatic(constructor, constructor.$mixins);
            }

            constructor.prototype = Subclass.Tools.extend(
                constructorProto,
                constructorProtoCopy
            );
            Subclass.Tools.extend(constructorStatic, constructorStaticCopy);

            extendStaticProperties(
                constructor,
                constructorStatic
            );

            Object.defineProperty(constructor.prototype, "constructor", {
                enumerable: false,
                configurable: true,
                value: constructor
            });

            Object.defineProperty(constructor, "$built", {
                enumerable: false,
                value: true
            });

            // This piece of (shit) code is needed only for Subclass classes

            if (Subclass.Extendable && constructor.prototype instanceof Subclass.Extendable) {
                constructor.$extensions = Subclass.Tools.copy(constructor.$extensions);
            }

            return constructor;
        },

        /**
         * Builds constructor and creates the instance of specified constructor after it was built
         *
         * @param {Function} constructor
         * @param [arguments]
         */
        createClassInstance: function(constructor)
        {
            function getPropertiesFromMixins(constructor)
            {
                var properties = {};

                if (constructor.$parent) {
                    Subclass.Tools.extend(
                        properties,
                        getPropertiesFromMixins(constructor.$parent)
                    );
                }
                if (constructor.$mixins) {
                    for (var i = 0; i < constructor.$mixins.length; i++) {
                        var mixinProperties = constructor.$mixins[i]();
                        Subclass.Tools.extend(properties, mixinProperties);
                    }
                }
                return properties;
            }

            constructor = this.buildClassConstructor(constructor);
            var properties = getPropertiesFromMixins(constructor);
            var instance = new (constructor.bind.apply(constructor, arguments))();

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName) && !instance.hasOwnProperty(propName)) {
                    instance[propName] = properties[propName];
                }
            }

            return instance;
        }
    });

    if (!Function.prototype.bind) {
        Object.defineProperty(Function.prototype, 'bind', {
            enumerable: false,
            configurable: true,
            value: function (oThis)
            {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function() {},
                    fBound = function() {
                        return fToBind.apply(this instanceof fNOP
                                ? this
                                : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                fNOP.prototype = this.prototype;
                fBound.prototype = new fNOP();

                return fBound;
            }
        });
    }

    return Subclass.Tools;

})();

// Source file: Tools/LoadingTools.js

Subclass.Tools.LoadingTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Loads, embeds and invoke the java script file
         *
         * @method loadJS
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} fileName
         *      The path to the requested file
         *
         * @param {(Function|Object)} callback
         * <pre>
         * The callback function. It can be specified in two forms:
         *
         * 1. As an object.
         *    It can contains two properties (either one or even two at once):
         *
         *    before: {Function}
         *
         *    If specified "before" that means the specified callback function
         *    will be invoked after the file will loaded but before
         *    it will be invoked.
         *
         *    after: {Function}
         *
         *    If specified "after" that means the specified callback function
         *    will be invoked after the file will loaded and invoked.
         *
         * 2. As a function.
         *    If specified function, it will be invoked immediately after
         *    file was loaded and its contained JS was performed.
         *
         *    It is the same if you had specified: { "after": function() {...} }
         * </pre>
         *
         * @returns {XMLHttpRequest}
         */
        loadJS: function(fileName, callback)
        {
            var callbacks = _processLoadArguments(fileName, callback);
            var xmlhttp = new XMLHttpRequest();
            var documentScripts = document.querySelectorAll('script');
            var currentScript = documentScripts[documentScripts.length - 1];

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var script = document.createElement('script');
                    script.setAttribute("type", "text/javascript");
                    script.text = xmlhttp.responseText;

                    if (script.text) {
                        if (currentScript) {
                            if (callbacks.beforeCallback) {
                                callbacks.beforeCallback();
                            }
                            currentScript.parentNode.insertBefore(
                                script,
                                currentScript.nextSibling
                            );
                            if (callbacks.afterCallback) {
                                callbacks.afterCallback();
                            }
                        }
                    } else {
                        Subclass.Error.create('Loading file "' + fileName + '" failed.');
                    }

                } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                    Subclass.Error.create('Loading file "' + fileName + '" failed.');
                }
            };

            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();

            return xmlhttp;
        },

        /**
         * Loads and embeds css file
         *
         * @method loadCSS
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} fileName
         *      The path to the requested file
         *
         * @param {(Function|Object)} callback
         *      The callback function. See more details in {@link Subclass.Tools#loadJS}
         *
         * @returns {XMLHttpRequest}
         */
        loadCSS: function(fileName, callback)
        {
            var callbacks = _processLoadArguments(fileName, callback);
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var script = document.createElement('script');
                    script.setAttribute("type", "text/javascript");
                    script.text = xmlhttp.responseText;

                    if (script.text) {
                        if (callbacks.beforeCallback) {
                            callbacks.beforeCallback();
                        }
                        window.document.getElementsByTagName("HEAD")[0].appendChild(script);

                        if (callbacks.afterCallback) {
                            callbacks.afterCallback();
                        }
                    } else {
                        Subclass.Error.create('Loading file "' + fileName + '" failed.');
                    }
                } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                    Subclass.Error.create('Loading file "' + fileName + '" failed.');
                }
            };

            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();

            return xmlhttp;
        }
    });

    /**
     * Processes the load file arguments and returns callback functions
     *
     * @param {string} fileName
     *      The name of file. It is needed for generating user-friendly
     *      error message if something went wrong.
     *
     * @param {Function} [callback]
     *      The one ore two callback functions depending on type of
     *      specified argument.
     *
     * @returns {{
     *      afterCallback: {(Function|undefined)},
     *      beforeCallback: {(Function|undefined)}
     * }}
     * @private
     */
    function _processLoadArguments(fileName, callback)
    {
        if (!fileName || typeof fileName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of file', false)
                .received(fileName)
                .expected('a string')
                .apply()
            ;
        }
        if (
            callback
            && typeof callback != 'function'
            && !this.isPlainObject(callback)
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback when trying to load file "' + fileName + '"', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }

        var beforeCallback, afterCallback;

        if (typeof callback == 'function') {
            afterCallback = callback;
        }
        if (typeof callback == 'object') {
            beforeCallback = callback.before;
            afterCallback = callback.after;
        }

        return {
            afterCallback: afterCallback,
            beforeCallback: beforeCallback
        };
    }

    return Subclass.Tools;
})();

// Source file: Tools/PropertyTools.js

Subclass.Tools.PropertyTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Returns name of getter function for the class property with specified name
         *
         * @method generateGetterName
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateGetterName: function (propertyName)
        {
            return _generateAccessorName("get", propertyName);
        },

        /**
         * Returns name of setter function for the class property with specified name
         *
         * @method generateSetterName
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateSetterName: function (propertyName)
        {
            return _generateAccessorName("set", propertyName);
        },

        /**
         * Returns name of checker function for the class property with specified name
         *
         * @method generateCheckerName
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateCheckerName: function (propertyName)
        {
            return _generateAccessorName("is", propertyName);
        },

        /**
         * Returns name of checker function for the class property with specified name
         *
         * @method generateCheckerName
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} propertyName
         *      A name of the class typed property defined in $_properties parameter
         *
         * @returns {string}
         */
        generateValidatorName: function (propertyName)
        {
            return _generateAccessorName("validate", propertyName);
        }
    });

    /**
     * Generates class property accessor function name
     *
     * @param {string} accessorType
     *      Can be "get", "set", "is"
     *
     * @param {string} propertyName
     *      A name of the class typed property defined in $_properties parameter
     *
     * @returns {string}
     * @private
     */
    function _generateAccessorName(accessorType, propertyName)
    {
        if (['get', 'set', 'is', 'validate'].indexOf(accessorType) < 0) {
            Subclass.Error.create('Invalid accessor type! It can be only "get", "set", "is" or "validate".');
        }
        var propNameParts = propertyName.split("_");

        for (var i = 0; i < propNameParts.length; i++) {
            if (propNameParts[i] === "") {
                continue;
            }
            propNameParts[i] = propNameParts[i][0].toUpperCase() + propNameParts[i].substr(1);
        }

        return accessorType + propNameParts.join("");
    }

    return Subclass.Tools;
})();

// Source file: Error/ErrorManager.js

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
                return (Subclass.Tools.createClassInstance(Subclass.Error.ErrorBase, message)).apply();
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

/**
 * @namespace
 */
Subclass.Error.Type = {};

// Source file: Error/ErrorBase.js

/**
 * @class
 * @constructor
 * @description
 *
 * The base error class
 *
 * @param {string} [message]
 *      The error message
 */
Subclass.Error.ErrorBase = function()
{
    function ErrorBase(message)
    {
        if (!message) {
            message = undefined;
        }

        /**
         * The message of error
         *
         * @type {(string|null)}
         */
        this._message = message;
    }

    /**
     * Builds error message.
     * If error message was set it returns it.
     * Otherwise the message will be built.
     *
     * @method buildMessage
     * @memberOf Subclass.Error.prototype
     *
     * @returns {string}
     */
    ErrorBase.prototype.buildMessage = function()
    {
        if (this._message) {
            return this._message;
        }
        return "";
    };

    /**
     * Sets/returns an error message.
     *
     * If the message argument was specified it will be set the error message.
     * Otherwise it builds message by the {@link Subclass.Error#buildMessage} method and returns it.
     *
     * @method message
     * @memberOf Subclass.Error.prototype
     *
     * @param {string} [message]
     *      The error message.
     *
     * @returns {Subclass.Error}
     */
    ErrorBase.prototype.message = function(message)
    {
        if (!arguments.length) {
            return this.buildMessage();
        }
        if (message && typeof message != 'string') {
            throw new Error('Specified invalid error message. It must be a string.');
        }
        this._message = message;

        return this;
    };

    /**
     * Checks whether the message option was specified
     *
     * @method hasMessage
     * @memberOf Subclass.Error.prototype
     *
     * @returns {boolean}
     */
    ErrorBase.prototype.hasMessage = function()
    {
        return this._message !== undefined;
    };

    /**
     * Throws error
     *
     * @method apply
     * @memberOf Subclass.Error.prototype
     * @throws {Error}
     */
    ErrorBase.prototype.apply = function()
    {
        Subclass.Error.ErrorBase.validateRequiredOptions(this);
        throw new Error(this.message());
    };


    /******************************************************************/
    /************************** Static Methods ************************/
    /******************************************************************/

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {string}
     */
    ErrorBase.getName = function()
    {
        throw new Error('Not implemented method "getName".');
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error
     * @static
     *
     * @returns {Array}
     */
    ErrorBase.getRequiredOptions = function()
    {
        return [];
    };

    /**
     * Validates required error fields
     *
     * @method validateRequiredOptions
     * @private
     * @ignore
     */
    ErrorBase.validateRequiredOptions = function(errorInst)
    {
        var required = this.getRequiredOptions();
        var missed = [];

        if (required.indexOf('message') >= 0) {
            required.splice(required.indexOf('message'), 1);
        }
        for (var i = 0; i < required.length; i++) {
            var checkerName = 'has' + required[i][0].toUpperCase() + required[i].substr(1);

            if (!errorInst[checkerName]()) {
                missed.push(required[i]);
            }
        }
        if (missed.length) {
            throw new Error(
                'Can\'t build error message. ' +
                'There are not specified error options: "' + missed.join('", "') + '".'
            );
        }
    };

    return ErrorBase;

}();

/**
 * @namespace
 */
Subclass.Error.Option = {};

// Source file: Error/Option/Argument.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the argument name when creating an error instance.
 */
Subclass.Error.Option.Argument = (function()
{
    function ArgumentOption()
    {
        return {
            /**
             * The name of argument
             *
             * @type {(string|undefined)}
             */
            _argument: undefined
        };
    }

    /**
     * Sets/returns the arguments name
     *
     * @method argument
     * @memberOf Subclass.Error.Option.Argument.prototype
     *
     * @throws {Error}
     *      Throws error specified invalid name of argument
     *
     * @param {string} [argName]
     *      The name of argument
     *
     * @param {boolean} [quotes]
     *      Should the argument name be wrapped in quotes
     *
     * @returns {(Subclass.Error|string)}
     */
    ArgumentOption.prototype.argument = function(argName, quotes)
    {
        if (!arguments.length) {
            return this._argument;
        }
        if (argName && typeof argName != 'string') {
            throw new Error('Specified invalid argument name. It must be a string.');
        }
        if (quotes !== false) {
            quotes = true;
        }
        var arg = [argName];

        if (quotes) {
            arg.unshift('"');
            arg.push('"');
        }
        this._argument = arg.join("");

        return this;
    };

    /**
     * Checks whether the argument option was specified
     *
     * @method hasArgument
     * @memberOf Subclass.Error.Option.Argument.prototype
     *
     * @returns {boolean}
     */
    ArgumentOption.prototype.hasArgument = function()
    {
        return this._argument !== undefined;
    };

    return ArgumentOption;
})();

// Source file: Error/Option/ClassName.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify class name when creating an error instance.
 */
Subclass.Error.Option.ClassName = (function()
{
    function ClassNameOption()
    {
        return {
            /**
             * The name of class
             *
             * @type {(string|undefined)}
             */
            _className: undefined
        };
    }

    /**
     * Sets/returns class name
     *
     * @method className
     * @memberOf Subclass.Error.Option.ClassName.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid class name argument
     *
     * @param {string} [className]
     *      The name of class
     *
     * @returns {(Subclass.Error|string)}
     */
    ClassNameOption.prototype.className = function(className)
    {
        if (!arguments.length) {
            return this._className;
        }
        if (className && typeof className != 'string') {
            throw new Error('Specified invalid class name. It must be a string.');
        }
        this._className = className;

        return this;
    };

    /**
     * Checks whether the className option was specified
     *
     * @method hasClassName
     * @memberOf Subclass.Error.Option.ClassName.prototype
     *
     * @returns {boolean}
     */
    ClassNameOption.prototype.hasClassName = function()
    {
        return this._className !== undefined;
    };

    return ClassNameOption;
})();

// Source file: Error/Option/Expected.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify what was expected instead what was received
 */
Subclass.Error.Option.Expected = (function()
{
    function ExpectedOption()
    {
        return {
            /**
             * What you expected
             *
             * @type {(string|undefined)}
             */
            _expected: undefined
        };
    }

    /**
     * Sets/returns expected arguments value
     *
     * @method expected
     * @memberOf Subclass.Error.Option.Expected.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid string of what expected
     *
     * @param {string} [expectedValue]
     *      The string of what expected
     *
     * @returns {Subclass.Error}
     */
    ExpectedOption.prototype.expected = function(expectedValue)
    {
        if (!arguments.length) {
            return this._expected;
        }
        if (expectedValue && typeof expectedValue != 'string') {
            throw new Error('Invalid expected argument value. It must be a string');
        }
        this._expected = expectedValue;

        return this;
    };

    /**
     * Checks whether the expected option was specified
     *
     * @method hasExpected
     * @memberOf Subclass.Error.Option.Expected.prototype
     *
     * @returns {boolean}
     */
    ExpectedOption.prototype.hasExpected = function()
    {
        return this._expected !== undefined;
    };

    return ExpectedOption;
})();

// Source file: Error/Option/Method.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the method name when creating an error instance
 */
Subclass.Error.Option.Method = (function()
{
    function MethodOption()
    {
        return {
            /**
             * The name of method
             *
             * @type {(string|undefined)}
             */
            _method: undefined,

            /**
             * Indicates that current method is static
             */
            _methodStatic: false
        };
    }

    /**
     * Sets/returns method name option
     *
     * @method method
     * @memberOf Subclass.Error.Option.Method.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid name of method
     *
     * @param {string} [method]
     *      The name of method
     *
     * @param {boolean} [isStatic]
     *      Whether method is static
     *
     * @returns {Subclass.Error}
     */
    MethodOption.prototype.method = function(method, isStatic)
    {
        if (!arguments.length) {
            return this._method;
        }
        if (method && typeof method != 'string') {
            throw new Error('Specified invalid method option. It must be a string.');
        }
        this._method = method;

        if (arguments.length >= 2 && typeof isStatic != 'boolean') {
            throw new Error('Specified invalid isStatic option. It must be a boolean.')
        }
        this._methodStatic = isStatic;

        return this;
    };

    /**
     * Checks whether the method option was specified
     *
     * @method hasMethod
     * @memberOf Subclass.Error.Option.Method.prototype
     *
     * @returns {boolean}
     */
    MethodOption.prototype.hasMethod = function()
    {
        return this._method !== undefined;
    };

    /**
     * Reports whether method is static
     *
     * @method isMethodStatic
     * @memberOf Subclass.Error.Option.Method.prototype
     *
     * @return {boolean}
     */
    MethodOption.prototype.isMethodStatic = function()
    {
        return this._methodStatic;
    };

    return MethodOption;
})();

// Source file: Error/Option/Module.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify module name when creating an error instance.
 */
Subclass.Error.Option.Module = (function()
{
    function ModuleOption()
    {
        return {

            /**
             * The name of module
             *
             * @type {(string|undefined)}
             */
            _module: undefined
        };
    }

    /**
     * Sets/returns the module name
     *
     * @method module
     * @memberOf Subclass.Error.Option.Module.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid name of module
     *
     * @param {string} [module]
     *      The name of module
     *
     * @returns {(Subclass.Error|string)}
     */
    ModuleOption.prototype.module = function(module)
    {
        if (!arguments.length) {
            return this._module;
        }
        if (module && typeof module != 'string') {
            throw new Error('Specified invalid module name. It must be a string.');
        }
        this._module = module;

        return this;
    };

    /**
     * Checks whether the module option was specified
     *
     * @method hasModule
     * @memberOf Subclass.Error.Option.Module.prototype
     *
     * @returns {boolean}
     */
    ModuleOption.prototype.hasModule = function()
    {
        return this._module !== undefined;
    };

    return ModuleOption;
})();

// Source file: Error/Option/Option.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the option name when creating an error instance
 */
Subclass.Error.Option.Option = (function()
{
    function OptionOption()
    {
        return {
            /**
             * The name of option
             *
             * @type {(string|undefined)}
             */
            _option: undefined
        }
    }

    /**
     * Sets/returns option name
     *
     * @method option
     * @memberOf Subclass.Error.Option.Option.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid option name
     *
     * @param {string} [option]
     *      The name of option
     *
     * @param {boolean} [quotes]
     *      whether it is needed wrap to quotes
     *
     * @returns {Subclass.Error}
     */
    OptionOption.prototype.option = function(option, quotes)
    {
        if (!arguments.length) {
            return this._option;
        }
        if (option && typeof option != 'string') {
            throw new Error('Specified invalid option name. It must be a string.');
        }
        if (quotes !== false) {
            quotes = true;
        }
        var opt = [option];

        if (quotes) {
            opt.unshift('"');
            opt.push('"');
        }
        this._option = opt.join("");

        return this;
    };

    /**
     * Checks whether the argument option was specified
     *
     * @method hasOption
     * @memberOf Subclass.Error.Option.Option.prototype
     *
     * @returns {boolean}
     */
    OptionOption.prototype.hasOption = function()
    {
        return this._option !== undefined;
    };

    return OptionOption;
})();

// Source file: Error/Option/Received.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify what was received when creating an error instance
 */
Subclass.Error.Option.Received = (function()
{
    function ReceivedOption()
    {
        return {
            /**
             * What you received
             *
             * @type {*}
             */
            _received: undefined
        };
    }

    /**
     * Sets received argument value and returns a part of error message included received value.
     *
     * @method received
     * @memberOf Subclass.Error.Option.Received.prototype
     *
     * @param {string} [received]
     *      What was received
     *
     * @returns {(Subclass.Error|string)}
     */
    ReceivedOption.prototype.received = function(received)
    {
        if (!arguments.length) {
            var value = this._received;
            var message = "";

            if (value && typeof value == 'object' && value.$_className) {
                message += 'The instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'The object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'Null was received instead.';

            } else {
                message += 'The value with type "' + (typeof value) + '" was received instead.';
            }
            return message;
        }

        this._received = received;

        return this;
    };

    /**
     * Checks whether received option was specified
     *
     * @method hasReceived
     * @memberOf Subclass.Error.Option.Received.prototype
     *
     * @returns {boolean}
     */
    ReceivedOption.prototype.hasReceived = function()
    {
        return this._received !== undefined;
    };

    return ReceivedOption;
})();

// Source file: Error/Type/InvalidArgumentError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error.ErrorBase}
 * @mixes Subclass.Error.Option.Argument
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message which
 * is actual when was specified some invalid argument
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.Type.InvalidArgumentError = (function()
{
    function InvalidArgumentError(message)
    {
        InvalidArgumentError.$parent.call(this, message);
    }

    InvalidArgumentError.$parent = Subclass.Error.ErrorBase;

    InvalidArgumentError.$mixins = [
        Subclass.Error.Option.Argument,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {string}
     */
    InvalidArgumentError.getName = function()
    {
        return "InvalidArgument";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {Array}
     */
    InvalidArgumentError.getRequiredOptions = function()
    {
        var required = InvalidArgumentError.$parent.getRequiredOptions();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    InvalidArgumentError.prototype.buildMessage = function()
    {
        var message = InvalidArgumentError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of ' + this.argument() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidArgumentError.getName(),
        InvalidArgumentError
    );

    return InvalidArgumentError;

})();

// Source file: Error/Type/InvalidClassOptionError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.ClassName
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
 * @mixes Subclass.Error.Option.Option
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with specific message
 * when some class definition option is invalid
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.InvalidClassOptionError = (function()
{
    function InvalidClassOptionError(message)
    {
        InvalidClassOptionError.$parent.call(this, message);
    }

    InvalidClassOptionError.$parent = Subclass.Error.ErrorBase;

    InvalidClassOptionError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received,
        Subclass.Error.Option.Option
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.InvalidClassOptionError
     * @static
     *
     * @returns {string}
     */
    InvalidClassOptionError.getName = function()
    {
        return "InvalidClassOption";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidClassOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidClassOptionError.getRequiredOptions = function()
    {
        var required = InvalidClassOptionError.$parent.getRequiredOptions();

        return required.concat([
            'className',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidClassOptionError.prototype.buildMessage = function()
    {
        var message = InvalidClassOptionError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option ' + this.option() + ' ';
            message += 'in definition of class "' + this.className() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidClassOptionError.getName(),
        InvalidClassOptionError
    );

    return InvalidClassOptionError;

})();

// Source file: Error/Type/InvalidModuleOptionError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.Option
 * @mixes Subclass.Error.Option.Module
 * @mixes Subclass.Error.Option.Expected
 * @mixes Subclass.Error.Option.Received
 * @constructor
 * @description
 *
 * The error class which indicates that was specified not valid value of
 * option in module configuration. To see details about constructor
 * parameters look at {@link Subclass.Error} class constructor
 *
 * @param {string} [message]
 *      The error message
 */
Subclass.Error.InvalidModuleOptionError = (function()
{
    function InvalidModuleOptionError(message)
    {
        InvalidModuleOptionError.$parent.call(this, message);
    }

    InvalidModuleOptionError.$parent = Subclass.Error.ErrorBase;

    InvalidModuleOptionError.$mixins = [
        Subclass.Error.Option.Option,
        Subclass.Error.Option.Module,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     * @static
     *
     * @returns {string}
     */
    InvalidModuleOptionError.getName = function()
    {
        return "InvalidModuleOption";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Module.Error.InvalidModuleOptionError
     * @static
     *
     * @returns {Array}
     */
    InvalidModuleOptionError.getRequiredOptions = function()
    {
        var required = InvalidModuleOptionError.$parent.getRequiredOptions();

        return required.concat([
            'module',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidModuleOptionError.prototype.buildMessage = function()
    {
        var message = InvalidModuleOptionError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option "' + this.option() + '" ';
            message += 'in settings of module "' + this.module() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidModuleOptionError.getName(),
        InvalidModuleOptionError
    );

    return InvalidModuleOptionError;

})();

// Source file: Error/Type/MissedArgumentError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.Argument
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message
 * which is actual when some argument was missed.
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.MissedArgumentError = (function()
{
    function MissedArgumentError(message)
    {
        MissedArgumentError.$parent.call(this, message);
    }

    MissedArgumentError.$parent = Subclass.Error.ErrorBase;

    MissedArgumentError.$mixins = [
        Subclass.Error.Option.Argument
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.MissedArgumentError
     * @static
     *
     * @returns {string}
     */
    MissedArgumentError.getName = function()
    {
        return "MissedArgument";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.InvalidArgumentError
     * @static
     *
     * @returns {Array}
     */
    MissedArgumentError.getRequiredOptions = function()
    {
        var required = MissedArgumentError.$parent.getRequiredOptions();

        return required.concat(['argument']);
    };

    /**
     * @inheritDoc
     */
    MissedArgumentError.prototype.buildMessage = function()
    {
        var message = MissedArgumentError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The ' + this.argument() + ' argument is required but was missed.';
        }

        return message;
    };

    Subclass.Error.registerType(
        MissedArgumentError.getName(),
        MissedArgumentError
    );

    return MissedArgumentError;
})();

// Source file: Error/Type/NotExistentMethodError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.ClassName
 * @mixes Subclass.Error.Option.Method
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message
 * which is actual when some trying call to non existent method
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.NotExistentMethodError = (function()
{
    function NotExistentMethodError(message)
    {
        NotExistentMethodError.$parent.call(this, message);
    }

    NotExistentMethodError.$parent = Subclass.Error.ErrorBase;

    NotExistentMethodError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Method
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.NotExistentMethodError
     * @static
     *
     * @returns {string}
     */
    NotExistentMethodError.getName = function()
    {
        return "NotExistentMethod";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.NotExistentMethodError
     * @static
     *
     * @returns {Array}
     */
    NotExistentMethodError.getRequiredOptions = function()
    {
        var required = NotExistentMethodError.$parent.getRequiredOptions();

        return required.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotExistentMethodError.prototype.buildMessage = function()
    {
        var message = NotExistentMethodError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The ' + (this.isMethodStatic() ? 'static ' : '') + 'method ';
            message += '"' + this.className() + '#' + this.method() + '" does not exist.';
        }

        return message;
    };

    Subclass.Error.registerType(
        NotExistentMethodError.getName(),
        NotExistentMethodError
    );

    return NotExistentMethodError;

})();

// Source file: Error/Type/NotImplementedMethodError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 * @mixes Subclass.Error.Option.ClassName
 * @mixes Subclass.Error.Option.Method
 * @constructor
 * @description
 *
 * The instance of this class helps to build error with message
 * which is actual when the some method was not implemented.
 *
 * @param {string} [message]
 *      The custom error message
 */
Subclass.Error.NotImplementedMethodError = (function()
{
    function NotImplementedMethodError(message)
    {
        NotImplementedMethodError.$parent.call(this, message);
    }

    NotImplementedMethodError.$parent = Subclass.Error.ErrorBase;

    NotImplementedMethodError.$mixins = [
        Subclass.Error.Option.ClassName,
        Subclass.Error.Option.Method
    ];

    /**
     * Returns the name of error type
     *
     * @method getName
     * @memberOf Subclass.Error.NotImplementedMethodError
     * @static
     *
     * @returns {string}
     */
    NotImplementedMethodError.getName = function()
    {
        return "NotImplementedMethod";
    };

    /**
     * Returns required error fields
     *
     * @method getRequiredOptions
     * @memberOf Subclass.Error.NotImplementedMethodError
     * @static
     *
     * @returns {Array}
     */
    NotImplementedMethodError.getRequiredOptions = function()
    {
        var required = NotImplementedMethodError.$parent.getRequiredOptions();

        return required.concat([
            'className',
            'method'
        ]);
    };

    /**
     * @inheritDoc
     */
    NotImplementedMethodError.prototype.buildMessage = function()
    {
        var message = NotImplementedMethodError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'The ' + (this.isMethodStatic() ? 'static ' : '') + 'method ';
            message += '"' + this.className() + '#' + this.method() + '" ';
            message += 'is abstract and should be implemented.';
        }

        return message;
    };

    Subclass.Error.registerType(
        NotImplementedMethodError.getName(),
        NotImplementedMethodError
    );

    return NotImplementedMethodError;

})();

// Source file: Event/Event.js

/**
 * @namespace
 */
Subclass.Event = {};

/**
 * @class
 * @constructor
 * @description
 *
 * Instance of current class is an object of event which holds
 * information about its name, context and listeners, can manipulate
 * by listeners (add, get, remove) and perform registered listener
 * callbacks in order according to its priorities.
 *
 * @throws {Error}
 *      Throws error if:<br />
 *      - was specified invalid event manager argument;<br />
 *      - was missed event name or it's not a string.
 *
 * @param {string} eventName
 *      The name of the creating event
 *
 * @param {Object} [context={}]
 *      An any object which link on it will be held
 *      in "this" variable inside every registered
 *      listener of current event.
 */
Subclass.Event.Event = (function()
{
    /**
     * @alias Subclass.Event.Event
     */
    function Event(eventName, context)
    {
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the event name", false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        if (!context) {
            context = {};
        }

        /**
         * Name of the event
         *
         * @type {string}
         * @private
         */
        this._name = eventName;

        /**
         * Context of the event listeners
         * (i.e. what will inside "this" variable inside of event listeners)
         *
         * @type {Object}
         * @private
         */
        this._context = context;

        /**
         * Array of event listeners
         *
         * @type {Array.<Subclass.Event.EventListener>}
         * @private
         */
        this._listeners = [];

        /**
         * Default event listener which invokes in the least
         *
         * @type {null|function}
         * @private
         */
        this._defaultListener = null;
    }

    /**
     * Returns name of event
     *
     * @method getName
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {string}
     */
    Event.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns event context for event listeners
     *
     * @method getContext
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {Object}
     */
    Event.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Sets default event listener which will be invoked in the least
     *
     * @param {function} listener
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.setDefaultListener = function(listener)
    {
        if (typeof listener != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the default event listener', false)
                .expected('a function')
                .received(listener)
                .apply()
            ;
        }
        this._defaultListener = listener;

        return this;
    };

    /**
     * Returns default event listener
     *
     * @returns {null|Function}
     */
    Event.prototype.getDefaultListener = function()
    {
        return this._defaultListener;
    };

    /**
     * Registers new listener to the event.<br /><br />
     * Creates instance of {@link Subclass.Event.EventListener}
     *
     * @method addListener
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {(number|Function)} [priority]
     *      Event listener invoke priority
     *
     * @param {Function} callback
     *      Event listener callback function which will be invoked when event triggers.
     *
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.addListener = function(priority, callback)
    {
        var listener = Subclass.Tools.createClassInstance(Subclass.Event.EventListener,
            priority,
            callback
        );
        this._listeners.push(listener);

        return this;
    };

    /**
     * Removes specified event listener by its callback function
     *
     * @method removeListener
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
     * @returns {Subclass.Event.Event}
     */
    Event.prototype.removeListener = function(callback)
    {
        var listener = this.getListenerByCallback(callback);

        if (!listener) {
            return this;
        }

        var listeners = this.getListeners();
        var listenerIndex = listeners.indexOf(listener);

        if (listenerIndex >= 0) {
            listeners.splice(listenerIndex, 1);
        }

        return this;
    };

    /**
     * Returns all registered event listeners
     *
     * @method getListeners
     * @memberOf Subclass.Event.Event.prototype
     *
     * @returns {Object.<Subclass.Event.EventListener>}
     */
    Event.prototype.getListeners = function()
    {
        return this._listeners;
    };

    /**
     * Returns event listener by specified callback function
     *
     * @method getListenerByCallback
     * @memberOf Subclass.Event.Event.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not a function callback
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
     * @returns {(Subclass.Event.EventListener|null)}
     */
    Event.prototype.getListenerByCallback = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var listeners = this.getListeners();

        for (var i = 0; i < listeners.length; i++) {
            if (listeners[i].getCallback() == callback) {
                return listeners[i];
            }
        }
        return null;
    };

    /**
     * Checks whether current event contains any listeners
     *
     * @method hasListeners
     * @memberOf Subclass.Event.Event.prototype
     *
     * @return {boolean}
     */
    Event.prototype.hasListeners = function()
    {
        return !!this.getListeners().length;
    };

    /**
     * Invokes all registered event listeners at order of descending its priorities.
     * The greater priority - the earlier event listener will invoked.<br /><br />
     *
     * Will be invoked all listener callback functions from all modules (from current
     * module and its plug-ins) of the event with name of current event.<br /><br />
     *
     * Each event listener callback function will receive as arguments all arguments from current method call.
     * If listener callback function returns false then it will bring to stop propagation of event.
     *
     * @method trigger
     * @memberOf Subclass.Event.Event.prototype
     *
     * @param [arguments]
     *      Any number of any needed arguments
     *
     * @returns {Subclass.Event.EventData}
     */
    Event.prototype.trigger = function()
    {
        var listeners = this.getListeners();

        return this._processTrigger(listeners, arguments);
    };

    /**
     * Invokes event listeners
     *
     * @method _processTriggger
     *
     * @param {Array.<Subclass.Event.EventListener>} listeners
     *      An array of event listeners
     *
     * @param {Array} listenerArgs
     *      Arguments which will be transferred to each even listener callback function
     *
     * @returns {Subclass.Event.EventData}
     * @private
     * @ignore
     */
    Event.prototype._processTrigger = function(listeners, listenerArgs)
    {
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var eventData = Subclass.Tools.createClassInstance(Subclass.Event.EventData, this, this.getContext());
        var context = this.getContext();
        var args = [eventData];
        var priorities = [];

        for (var k = 0; k < listenerArgs.length; k++) {
            args.push(listenerArgs[k]);
        }

        // Preparing event listeners

        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            priorities.push(listener.getPriority());
            listener[uniqueFieldName] = false;
        }

        // Sorting priorities in descending order

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        // Invoking event listener callback function in order with priorities

        loop: for (i = 0; i < priorities.length; i++) {
            for (var j = 0; j < listeners.length; j++) {
                listener = listeners[j];

                if (!listener[uniqueFieldName] && listener.getPriority() == priorities[i]) {
                    listener[uniqueFieldName] = true;

                    var result = listener.getCallback().apply(context, args);
                    eventData.addResult(result);

                    if (eventData.isPropagationStopped()) {
                        break loop;
                    }
                }
            }
        }

        // Invoking default event listener

        if (
            this.getDefaultListener()
            && !eventData.isPropagationStopped()
            && !eventData.isDefaultPrevented()
        ) {
            this.getDefaultListener().apply(context, args);
        }

        // Removing helper fields from listeners

        for (i = 0; i < listeners.length; i++) {
            listener = listeners[i];
            delete listener[uniqueFieldName];
        }

        return eventData;
    };

    return Event;

})();

// Source file: Event/EventData.js

Subclass.Event.EventData = function()
{
    function EventData(eventInst, target)
    {
        /**
         * Event instance
         *
         * @type {Subclass.Event.Event}
         * @private
         */
        this._event = eventInst;

        /**
         * Event executing context
         *
         * @type {*}
         * @private
         */
        this._target = target;

        /**
         * Array of event listeners results
         *
         * @type {Array.<*>}
         * @private
         */
        this._results = [];

        /**
         * Reports whether propagation stopped
         *
         * @type {boolean}
         * @private
         */
        this._stopped = false;

        /**
         * Reports whether invoking default event listener prevented
         *
         * @type {boolean}
         * @private
         */
        this._defaultPrevented = false;
    }

    /**
     * Returns the event object instance
     *
     * @returns {Subclass.Event.Event}
     */
    EventData.prototype.getEvent = function()
    {
        return this._event;
    };

    /**
     * Returns the object for which current event was triggered
     * (matches with "this" variable in event listener callback function)
     *
     * @returns {Object}
     */
    EventData.prototype.getTarget = function()
    {
        return this._target;
    };

    /**
     * Starts event propagation
     */
    EventData.prototype.startPropagation = function()
    {
        this._stopped = false;
    };

    /**
     * Stops event propagation
     */
    EventData.prototype.stopPropagation = function()
    {
        this._stopped = true;
    };

    /**
     * Reports whether event propagation stopped
     *
     * @returns {boolean}
     */
    EventData.prototype.isPropagationStopped = function()
    {
        return this._stopped;
    };

    /**
     * Prevents call of default event listener
     */
    EventData.prototype.preventDefault = function()
    {
        this._defaultPrevented = true;
    };

    /**
     * Allows call of default event listener
     */
    EventData.prototype.allowDefault = function()
    {
        this._defaultPrevented = false;
    };

    /**
     * Reports whether allows call of default event listener
     *
     * @returns {boolean}
     */
    EventData.prototype.isDefaultPrevented = function()
    {
        return this._defaultPrevented;
    };

    /**
     * Adds new event listener execution result
     *
     * @param {*} result
     *      Event listener execution result
     */
    EventData.prototype.addResult = function(result)
    {
        this._results.push(result);
    };

    /**
     * Returns all results of event listeners executions
     *
     * @returns {Array.<*>}
     */
    EventData.prototype.getResults = function()
    {
        return this._results;
    };

    /**
     * Returns first result of event listeners executions
     *
     * @returns {*}
     */
    EventData.prototype.getFirstResult = function()
    {
        return this._results.length
            ? this._results[0]
            : undefined
        ;
    };

    /**
     * Returns last result of event listeners executions
     *
     * @returns {*}
     */
    EventData.prototype.getLastResult = function()
    {
        return this._results.length
            ? this._results[this._results.length - 1]
            : undefined
        ;
    };

    /**
     * Clears event listeners execution results
     */
    EventData.prototype.clearResults = function()
    {
        this._results = [];
    };

    return EventData;
}();

// Source file: Event/EventListener.js

/**
 * @class
 * @constructor
 * @description
 *
 * The class that is used for holding information about event listener.
 *
 * @throws {Error}
 *      Throws error if:<br />
 *      - priority is not a number (any data type except number);<br />
 *      - callback is not a function.
 *
 * @param {number} [priority=0]
 *      A number which tells when current listener will be invoked
 *      relative to other registered listeners in this particular event instance
 *
 * @param {Function} callback
 *      A callback function which will be invoked when the event will trigger
 *
 */
Subclass.Event.EventListener = (function()
{
    /**
     * @alias Subclass.Event.EventListener
     */
    function EventListener(priority, callback)
    {
        if (typeof priority == 'function') {
            callback = priority;
            priority = 0;
        }
        if (typeof priority != 'number') {
            Subclass.Error.create('InvalidArgument')
                .argument("the priority of event listener", false)
                .received(priority)
                .expected('a number')
                .apply()
            ;
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }

        /**
         * Priority of event listener.
         * The higher the number the sooner current listener will be called
         *
         * @type {number}
         * @private
         */
        this._priority = priority;

        /**
         * Event listener callback
         *
         * @type {Function}
         * @private
         */
        this._callback = callback;
    }

    /**
     * Returns event listener priority
     *
     * @method getPriority
     * @memberOf Subclass.Event.EventListener.prototype
     *
     * @returns {number}
     */
    EventListener.prototype.getPriority = function()
    {
        return this._priority;
    };

    /**
     * Returns event listener callback
     *
     * @method getCallback
     * @memberOf Subclass.Event.EventListener.prototype
     *
     * @returns {Function}
     */
    EventListener.prototype.getCallback = function()
    {
        return this._callback;
    };

    return EventListener;

})();

// Source file: Event/EventableMixin.js

/**
 * @mixin
 * @description
 *
 * Adds new functionality to class which allows it to manipulate events:<br />
 * - register new events;<br />
 * - receive events;<br />
 * - check whether is interesting event exists.
 */
Subclass.Event.EventableMixin = (function()
{
    /**
     * @alias Subclass.Event.EventableMixin
     */
    function EventableMixin()
    {
        return {
            /**
             * A collection of events
             *
             * @type {Object.<Subclass.Event.Event>}
             * @private
             */
            _events: {}
        };
    }

    /**
     * Returns registered events
     *
     * @method getEvents
     * @memberOf Subclass.Event.EventableMixin
     *
     * @returns {Object.<Subclass.Event.Event>}
     */
    EventableMixin.prototype.getEvents = function()
    {
        return this._events;
    };

    /**
     * Registers new event with specified name.<br />
     * It's required step for further using every event.<br /><br />
     *
     * Creates instance of {@link Subclass.Event.Event}
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
     *
     * @throws {Error}
     *      Throws if trying to register event with already existent event
     *
     * @param {string} eventName
     *      A name of creating event
     *
     * @returns {Subclass.Event.EventableMixin}
     */
    EventableMixin.prototype.registerEvent = function(eventName)
    {
        if (this.issetEvent(eventName)) {
            return this;
        }
        this._events[eventName] = Subclass.Tools.createClassInstance(Subclass.Event.Event,
            eventName,
            this
        );

        return this;
    };

    /**
     * Returns registered event instance.
     *
     * @method getEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
     *
     * @throws {Error}
     *      Throws error if trying to get event that was not registered
     *
     * @param {string} eventName
     *      The name of event you want to get
     *
     * @returns {Subclass.Event.Event}
     */
    EventableMixin.prototype.getEvent = function(eventName)
    {
        if (!this.issetEvent(eventName)) {
            Subclass.Error.create('Trying to get non existent event "' + eventName + '".');
        }
        return this.getEvents()[eventName];
    };

    /**
     * Checks whether event with specified name was registered
     *
     * @method issetEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
     *
     * @param {string} eventName
     *      The name of interesting event
     *
     * @returns {boolean}
     */
    EventableMixin.prototype.issetEvent = function(eventName)
    {
        return !!this.getEvents()[eventName];
    };

    return EventableMixin;

})();

// Source file: Module.js

/**
 * @class
 * @constructor
 * @description
 *
 * The class which allows to create Subclass module.
 * It's a structural unit that allows to split the project on multiple parts.
 * The main goal of current class is to provide extensibility of the project
 * by plug-ins (other modules which were marked as plug-ins).<br /><br />
 *
 * Using this class you can get access to module configuration, event manager,
 * load manager, class manager and make all manipulations whatever you need.
 *
 * @throws {Error}
 *      Throws if was missed or is not a string the module name
 *
 * @param {string} moduleName
 *      A name of creating module
 *
 * @param {string[]} [modulePlugins=[]]
 *      Array with names of another modules which are plugins for current one
 *
 * @param {Object} [moduleSettings={}]
 *      Module settings object. Allowed options are: <pre>
 *
 * plugin       {boolean}   opt   false  Tells that current module is
 *                                       a plugin and its onReady callback
 *                                       will be called only after this
 *                                       module will be included in main
 *                                       module.
 *
 * pluginOf     {string}    opt          Specifies parent module to which
 *                                       current one belongs to. If its sets
 *                                       in true the "plugin" option will
 *                                       atomatically sets in true.
 *
 * rootPath     {string}    opt          The path to root directory of the
 *                                       project.
 *
 * files        {string[]}  opt          Array of JS file names which you
 *                                       want to be loaded before the
 *                                       onReady callbacks will be called.
 *
 *                                       By default the path of the files
 *                                       is relative to the path specified
 *                                       in the "rootPath" option.
 *
 *                                       But also you may to specify the path
 *                                       not tied to the "rootPath" by the
 *                                       adding the symbol "^" at the start
 *                                       of the file name.
 *
 *                                       Example:
 *
 *                                       var moduleSettings = {
 *                                         rootPath: "/asserts/scripts/app/",
 *                                         files: [
 *
 *                                           // path relative to rootPath
 *                                           "app.js",
 *
 *                                           // absolute path
 *                                           "^/asserts/vendors/script.js
 *                                         ],
 *                                         ...
 *                                       };
 *
 * onSetup      {Function}  opt          Callback function that will be
 *                                       invoked before any of registered
 *                                       module content will be initialized
 *                                       (i.e. classes).
 *
 *                                       Subscribing listeners to this
 *                                       event is good opportunity to modify
 *                                       configuration of any registered
 *                                       parts of application (i.e. classes)
 *                                       by its plug-ins.
 *
 * onReady      {Function}  opt          Callback function that will be
 *                                       invoked when all module classes
 *                                       will be loaded.
 *
 * </pre>
 */
Subclass.Module = function()
{
    /**
     * @alias Subclass.Module
     */
    function Module(moduleName, modulePlugins, moduleSettings)
    {
        var $this = this;

        if (!moduleName || typeof moduleName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleName)
                .expected('a string')
                .apply()
            ;
        }
        if (!moduleSettings) {
            moduleSettings = {};
        }
        if (!modulePlugins) {
            modulePlugins = [];
        }

        /**
         * Name of the module
         *
         * @type {string}
         * @private
         */
        this._name = moduleName;

        /**
         * Parent module (if current one is a plugin relative to parent module)
         *
         * @type {(Subclass.Module|null)}
         * @private
         */
        this._parent = null;

        /**
         * Module public api
         *
         * @type {Subclass.ModuleAPI}
         * @private
         */
        this._api = Subclass.Tools.createClassInstance(Subclass.ModuleAPI, this);

        /**
         * Event manager instance
         *
         * @type {Subclass.EventManager}
         * @private
         */
        this._eventManager = Subclass.Tools.createClassInstance(Subclass.EventManager, this);

        // Registering events

        this.getEventManager()
            .registerEvent('onCreate')
            .registerEvent('onInitializeBefore')
            .registerEvent('onInitialize')
            .registerEvent('onInitializeAfter')
            .registerEvent('onSetup')
            .registerEvent('onReady')
            .registerEvent('onReadyBefore')
            .registerEvent('onReadyAfter')
            .registerEvent('onAddPlugin')
        ;

        /**
         * The load manager instance
         *
         * @type {Subclass.LoadManager}
         * @private
         */
        this._loadManager = Subclass.Tools.createClassInstance(Subclass.LoadManager, this);

        /**
         * Collection of modules
         *
         * @type {Subclass.ModuleStorage}
         * @private
         */
        this._moduleStorage = Subclass.Tools.createClassInstance(Subclass.ModuleStorage, this, modulePlugins);

        /**
         * Class manager instance
         *
         * @type {Subclass.ClassManager}
         * @private
         */
        this._classManager = Subclass.Tools.createClassInstance(Subclass.ClassManager, this);

        /**
         * Module settings
         *
         * @type {Subclass.SettingsManager}
         * @private
         */
        this._settingsManager = Subclass.Tools.createClassInstance(Subclass.SettingsManager, this);

        /**
         * Reports whether module was setupped
         *
         * @type {boolean}
         * @private
         */
        this._setupped = false;

        /**
         * Checks whether module is prepared for ready
         *
         * @type {boolean}
         * @private
         */
        this._prepared = false;

        /**
         * Tells that module is ready
         *
         * @type {boolean}
         * @private
         */
        this._ready = false;


        // Initializing module

        var eventManager = this.getEventManager();

        // Adding initialize callbacks from static scope

        for (var i = 0; i < Module._creaters.length; i++) {
            eventManager.getEvent('onCreate').addListener(Module._creaters[i]);
        }
        for (i = 0; i < Module._initializersBefore.length; i++) {
            eventManager.getEvent('onInitializeBefore').addListener(Module._initializersBefore[i]);
        }
        for (i = 0; i < Module._initializersAfter.length; i++) {
            eventManager.getEvent('onInitializeAfter').addListener(Module._initializersAfter[i]);
        }

        eventManager.getEvent('onCreate').triggerPrivate(this);
        eventManager.getEvent('onInitializeBefore').triggerPrivate(this);

        this.initializeExtensions();
        eventManager.getEvent('onInitialize').triggerPrivate(this);

        this.setSettings(moduleSettings);
        this.getClassManager().initialize();
        this.getLoadManager().initialize();

        eventManager.getEvent('onInitializeAfter').triggerPrivate(this);

        // Calling onReady callback

        eventManager.getEvent('onLoadingEnd').addListener(1000000, function(evt) {
            if ($this.isRoot()) {
                $this.setSetupped();
            }
        });
        eventManager.getEvent('onLoadingEnd').addListener(-1000000, function(evt) {
            $this.setReady();
        });
    }

    Module.$parent = Subclass.Extendable;

    /**
     * Array of function callbacks which will be invoked when module has just created
     * before initialization
     *
     * @type {Array}
     * @static
     */
    Module._creaters = [];

    /**
     * Array of function callbacks which will be invoked when module initializes
     * before module setting options was processed
     *
     * @type {Array}
     * @static
     */
    Module._initializersBefore = [];

    /**
     * Array of function callbacks which will be invoked when module
     * initializes after module setting options was processed
     *
     * @type {Array}
     * @static
     */
    Module._initializersAfter = [];

    /**
     * Adds new initializer to module
     */
    Module.onInitializeBefore = function(callback)
    {
        if (!callback || typeof callback != 'function') {
            Subclass.Error.create("InvalidArgument")
                .argument("the callback function", false)
                .expected("a function")
                .received(callback)
                .save()
            ;
        }
        if (this._initializersBefore.indexOf() < 0) {
            this._initializersBefore.push(callback);
        }
    };

    /**
     * Adds new initializer to module
     */
    Module.onCreate = function(callback)
    {
        if (!callback || typeof callback != 'function') {
            Subclass.Error.create("InvalidArgument")
                .argument("the callback function", false)
                .expected("a function")
                .received(callback)
                .save()
            ;
        }
        if (this._creaters.indexOf() < 0) {
            this._creaters.push(callback);
        }
    };

    /**
     * Adds new initializer to module
     */
    Module.onInitializeAfter = function(callback)
    {
        if (!callback || typeof callback != 'function') {
            Subclass.Error.create("InvalidArgument")
                .argument("the callback function", false)
                .expected("a function")
                .received(callback)
                .save()
            ;
        }
        if (this._initializersAfter.indexOf() < 0) {
            this._initializersAfter.push(callback);
        }
    };

    /**
     * Returns name of the module
     *
     * @method getName
     * @memberOf Subclass.Module.prototype
     *
     * @returns {string}
     */
    Module.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets parent module.<br />
     * Allows to specify that the current module is a plugin relative to the parent module
     *
     * @method setParent
     * @memberOf Subclass.Module.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not valid argument
     *
     * @param {(Subclass.Module|null)} parentModule
     *      The parent module instance
     */
    Module.prototype.setParent = function(parentModule)
    {
        if (parentModule !== null && !(parentModule instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the parent module instance", false)
                .received(parentModule)
                .expected('an instance of "Subclass.Module"')
                .apply()
            ;
        }
        this._parent = parentModule;
    };

    /**
     * Returns parent module
     *
     * @method getParent
     * @memberOf Subclass.Module.prototype
     *
     * @returns {(Subclass.Module|null)}
     */
    Module.prototype.getParent = function()
    {
        return this._parent;
    };

    /**
     * Checks whether current module belongs to another module,
     * i.e. is a plugin relative to another module
     *
     * @method hasParent
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.hasParent = function()
    {
        return !!this._parent;
    };

    /**
     * Returns the root parent module.<br /><br />
     *
     * If module is a plugin it holds a link to the parent module.
     * If parent in turn has a parent and so on, the module which is on the top
     * of the inheritance chain is called a root module.
     *
     * @method getRoot
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.getRoot = function()
    {
        return this.hasParent()
            ? this.getParent().getRoot()
            : this
        ;
    };

    /**
     * Checks whether current module is root module,
     * i.e. hasn't the parent module and isn't a plugin.
     *
     * @method isRoot
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isRoot = function()
    {
        return !this.hasParent() && !this.isPlugin();
    };

    /**
     * Checks whether current module is a plug-in.
     *
     * @method isPlugin
     * @memberOf Subclass.Module.prototype
     *
     * @returns {*}
     */
    Module.prototype.isPlugin = function()
    {
        return this.getSettingsManager().isPlugin();
    };

    /**
     * Returns the public api of the module which
     * is an instance of class Subclass.ModuleAPI
     *
     * @method getAPI
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ModuleAPI}
     */
    Module.prototype.getAPI = function()
    {
        return this._api;
    };

    /**
     * The same as the {@link Subclass.SettingsManager#setSettings}
     *
     * @method setSettings
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.setSettings = function(settings)
    {
        this.getSettingsManager().setSettings(settings);

        return this;
    };

    /**
     * Returns an instance of manager that holds and processes module settings.
     *
     * @method getSettingsManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.SettingsManager}
     */
    Module.prototype.getSettingsManager = function()
    {
        return this._settingsManager;
    };

    /**
     * Returns an instance of manager that allows to register new events,
     * subscribe listeners and triggers them at the appointed time
     *
     * @method getEventManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.EventManager}
     */
    Module.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns an instance of manager that holds and can process all plugins (modules which
     * names were specified earlier in module constructor as modulePlugins)
     * and link on this module
     *
     * @method getModuleStorage
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ModuleStorage}
     */
    Module.prototype.getModuleStorage = function()
    {
        return this._moduleStorage;
    };

    /**
     * Returns the instance of load manager
     *
     * @method getLoadManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.LoadManager}
     */
    Module.prototype.getLoadManager = function()
    {
        return this._loadManager;
    };

    /**
     * Returns class manager instance that allows to register, process, and get
     * classes of different type: Class, AbstractClass, Interface, Trait, Config
     *
     * @method getClassManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ClassManager}
     */
    Module.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * The same as the {@link Subclass.SettingsManager#setOnSetup}
     *
     * @method onSetup
     * @memberOf Subclass.Module.prototype
     *
     * @param {Function} callback
     *      The callback function
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.onSetup = function(callback)
    {
        this.getSettingsManager().setOnSetup(callback);

        return this;
    };

    /**
     * Makes module be setupped
     *
     * @method setSetupped
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setSetupped = function()
    {
        this.triggerOnSetup();
        this._setupped = true;
    };

    /**
     * Reports wheter the module was setupped
     *
     * @method isSetupped
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isSetupped = function()
    {
        return this._setupped;
    };

    /**
     * Invokes registered onSetup callback functions forcibly.<br /><br />
     *
     * If current module contains plug-ins then will be invoked onSetup callbacks
     * from current module first and then will be invoked onSetup callbacks
     * from plug-ins in order as they were added to the current module.
     *
     * @method triggerOnSetup
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.triggerOnSetup = function()
    {
        this.getEventManager().getEvent('onSetup').trigger();

        return this;
    };

    /**
     * The same as the {@link Subclass.SettingsManager#setOnReady}
     *
     * @method onReady
     * @memberOf Subclass.Module.prototype
     *
     * @param {Function} callback
     *      The callback function
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.onReady = function(callback)
    {
        if (this.isReady()) {
            callback.apply(this);
            return this;
        }
        this.getSettingsManager().setOnReady(callback);

        return this;
    };

    /**
     * Invokes registered onReady callback functions forcibly.<br /><br />
     *
     * If current module contains plug-ins then will be invoked onReady callbacks
     * from current module first and then will be invoked onReady callbacks
     * from plug-ins in order as they were added to the current module.
     *
     * @method triggerOnReady
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.triggerOnReady = function()
    {
        this.getEventManager().getEvent('onReady').trigger();

        return this;
    };

    /**
     * Sets that module is prepared
     *
     * @method setPrepared
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setPrepared = function()
    {
        this._prepared = true;
    };

    /**
     * Checks whether the module is prepared
     *
     * @method isPrepared
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isPrepared = function()
    {
        return this._prepared;
    };

    /**
     * Brings module to ready state and invokes registered onReady callback functions.
     * It can be invoked only once otherwise nothing will happen.
     *
     * @method setReady
     * @memberOf Subclass.Module.prototype
     */
    Module.prototype.setReady = function()
    {
        if (this.isReady()) {
            return;
        }
        var loadManager = this.getLoadManager();
        this.setPrepared();

        if (
            loadManager.isStackEmpty()
            && this.isPluginsReady()
        ) {
            this._ready = true;

            if (this.isPlugin() && this.hasParent()) {
                var rootModule = this.getRoot();
                var rootModuleStorage = rootModule.getModuleStorage();

                if (rootModuleStorage.issetLazyModule(this.getName())) {
                    rootModuleStorage.resolveLazyModule(this.getName());
                }
                if (!rootModule.isReady()) {
                    return rootModule.setReady();
                }
            }
            if ((
                    this.isRoot()
                ) || (
                    this.isPlugin()
                    && this.hasParent()
                    && this.getRoot().isReady()
                )
            ) {
                if (!this.isSetupped()) {
                    this.setSetupped();
                }
                this.getEventManager().getEvent('onReadyBefore').trigger();
                this.triggerOnReady();
                this.getEventManager().getEvent('onReadyAfter').trigger();
            }
        }
    };

    /**
     * Checks if current class manager instance is ready and was
     * initialized by invoking onReady registered callback functions
     *
     * @method isReady
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isReady = function()
    {
        return this._ready;
    };

    /**
     * Checks whether the all module plug-ins are ready
     *
     * @method isPluginsReady
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.isPluginsReady = function()
    {
        var moduleStorage = this.getModuleStorage();
        var plugins = moduleStorage.getPlugins();

        if (moduleStorage.hasLazyModules()) {
            return false;
        }
        for (var i = 0; i < plugins.length; i++) {
            if (
                !plugins[i].isPrepared()
                || !plugins[i].isPluginsReady()
            ) {
                return false;
            }
        }
        return true;
    };

    /**
     * Allows to add plug-in to the current module.
     * If specified the second argument it means that first
     * will be loaded the specified files and then the plug-in module
     * will be added to current module and will be invoked
     * it onReady callback functions.
     *
     * @method addPlugin
     * @memberOf Subclass.Module.prototype
     *
     * @param {string} moduleName
     *      The name of the module which you want to add to the current one as a plug-in
     *
     * @param {(Array.<Object>|string)} [moduleFile]
     *      A file name with the definition of plug-in module.
     *
     * @param {Function} [callback]
     *      The callback function which will be invoked when plug-in module becomes ready.
     *      It is actual only if the module files (the second argument) was specified.
     *      Otherwise it will never be invoked.
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.addPlugin = function(moduleName, moduleFile, callback)
    {
        var loadManager = this.getLoadManager();
        var $this = this;

        if (!moduleName || typeof moduleName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleName)
                .expected("a string")
                .apply()
            ;
        } else if (
            Subclass.issetModule(moduleName)
            && Subclass.getModule(moduleName).getParentModule()
        ) {
            Subclass.Error.create(
                'The module "' + moduleName + '" is already ' +
                'added as a plug-in to another module.'
            );
        }
        if (moduleFile && typeof moduleFile != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of module", false)
                .received(moduleFile)
                .expected("a string or be omitted")
                .apply()
            ;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (!moduleFile && callback) {
            Subclass.Error.create(
                'You can\'t specify the callback function without ' +
                'file of module "' + moduleName + '".'
            );
        }
        if (moduleFile) {
            loadManager.loadFile(moduleFile, function() {
                if (callback) {
                    var module = Subclass.getModule(moduleName).getModule();
                    var moduleEventManager = module.getEventManager();

                    moduleEventManager.getEvent('onLoadingEnd').addListener(callback);
                }
                $this.addPlugin(moduleName);
            });

            return this;
        }

        var eventManager = this.getEventManager();
        var moduleStorage = this.getModuleStorage();
            moduleStorage.addPlugin(moduleName);

        if (this.isPrepared()) {
            var pluginModule = Subclass.getModule(moduleName).getModule();
            var pluginEventManager = pluginModule.getEventManager();
            var pluginLoadManager = pluginModule.getLoadManager();

            if (pluginModule.isPrepared()) {
                eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
            } else {
                pluginLoadManager.startLoading();
                pluginEventManager.getEvent('onLoadingEnd').addListener(100000, function (evt) {
                    eventManager.getEvent('onAddPlugin').triggerPrivate(pluginModule);
                });
            }
        }

        return this;
    };

    /**
     * Checks whether current module has any plugins
     *
     * @method hasPlugins
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.hasPlugins = function()
    {
        return !!this.getModuleStorage().getPlugins().length;
    };

    return Module;

}();

// Source file: ModuleAPI.js

/**
 * @class
 * @constructor
 * @description
 *
 * This class contains all needed API to manipulation with module
 *
 * @param {Subclass.Module} module
 *      An instance of module that will provide public API
 */
Subclass.ModuleAPI = (function()
{
    /**
     * @alias Subclass.ModuleAPI
     */
    function ModuleAPI(module)
    {
        /**
         * Module instance
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Module api events
         *
         * @type {Array}
         * @private
         */
        this._events = [];


        // Initialization operations

        this.registerEvent('onInitialize');
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    }

    ModuleAPI.$parent = Subclass.Extendable;

    ModuleAPI.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Returns module instance
     *
     * @method getModule
     * @memberOf Subclass.ModuleAPI.prototype
     *
     * @returns {Subclass.Module}
     */
    ModuleAPI.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * The same as the {@link Subclass.Module#getName}
     *
     * @method getName
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getName = function()
    {
        return this.getModule().getName.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#addPlugin}
     *
     * @method addPlugin
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.addPlugin = function()
    {
        return this.getModule().addPlugin.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.ClassManager#get}
     *
     * @method getClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getClass = function()
    {
        return this.getModule().getClassManager().get.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#issetClass}
     *
     * @method issetClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.issetClass = function()
    {
        return this.getModule().getClassManager().isset.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#buildClass}
     *
     * @method buildClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.buildClass = function()
    {
        return this.getModule().getClassManager().build.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#alterClass}
     *
     * @method alterClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.alterClass = function()
    {
        return this.getModule().getClassManager().alter.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.ClassManager#copy}
     *
     * @method copyClass
     * @memberOf Subclass.ModuleAPI.prototype
     *
     * @returns {Subclass.Class.ClassType}
     */
    ModuleAPI.prototype.copyClass = function()
    {
        return this.getModule().getClassManager().copy.apply(
            this.getModule().getClassManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.Module#onSetup}
     *
     * @method onSetup
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onSetup = function()
    {
        return this.getModule().onSetup.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#triggerOnSetup}
     *
     * @method triggerOnSetup
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.triggerOnSetup = function()
    {
        return this.getModule().triggerOnSetup.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isSetupped}
     *
     * @method isSetupped
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isSetupped = function()
    {
        return this.getModule().isSetupped.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#onReady}
     *
     * @method onReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onReady = function()
    {
        return this.getModule().onReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#triggerOnReady}
     *
     * @method triggerOnReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.triggerOnReady = function()
    {
        return this.getModule().triggerOnReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isReady}
     *
     * @method isReady
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isReady = function()
    {
        return this.getModule().isReady.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#setSettings}
     *
     * @method setSettings
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.setSettings = function()
    {
        return this.getModule().setSettings.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getSettingsManager}
     *
     * @method getSettingsManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getSettingsManager = function()
    {
        return this.getModule().getSettingsManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getEventManager}
     *
     * @method getEventManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getEventManager = function()
    {
        return this.getModule().getEventManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getLoadManager}
     *
     * @method getLoadManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getLoadManager = function()
    {
        return this.getModule().getLoadManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getClassManager}
     *
     * @method getClassManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getClassManager = function()
    {
        return this.getModule().getClassManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getModuleStorage}
     *
     * @method getModuleStorage
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getModuleStorage = function()
    {
        return this.getModule().getModuleStorage.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getRoot}
     *
     * @method getRootModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getRootModule = function()
    {
        return this.getModule().getRoot.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#isRoot}
     *
     * @method isRootModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.isRootModule = function()
    {
        return this.getModule().isRoot.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getParent}
     *
     * @method getParentModule
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getParentModule = function()
    {
        var parent = this.getModule().getParent.apply(this.getModule(), arguments);

        if (parent == this.getModule()) {
            parent = null;
        }
        return parent;
    };

    return ModuleAPI;

})();

// Source file: ClassManager.js

/**
 * @class
 * @constructor
 * @description
 *
 * Allows to manipulate by classes: register new, load and get already registered classes.
 *
 * @throws {Error}
 *      Throws error if specified invalid module instance
 *
 * @param {Subclass.Module} module
 *      The module instance
 */
Subclass.ClassManager = (function()
{
    function ClassManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the module instance')
                .received(module)
                .expected('an instance of Subclass.Module class')
                .apply()
            ;
        }

        /**
         * Instance of Subclass module
         *
         * @type {Subclass.Module}
         * @private
         */
        this._module = module;

        /**
         * Collection of registered classes
         *
         * @type {Object.<Subclass.Class.ClassType>}
         * @private
         */
        this._classes = {};

        /**
         * The instance of class load manager
         *
         * @type {Subclass.Class.ClassLoader}
         * @private
         */
        this._loader = Subclass.Tools.createClassInstance(Subclass.Class.ClassLoader, this);
    }

    /**
     * Initializes the class manager
     *
     * @method initialize
     * @memberOf Subclass.ClassManager.prototype
     */
    ClassManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var $this = this;

        // Registering basic classes for the root module

        if (module.isRoot()) {
            var defaultClasses = ClassManager.getClasses();

            for (var classTypeName in defaultClasses) {
                if (!defaultClasses.hasOwnProperty(classTypeName)) {
                    continue;
                }
                for (var className in defaultClasses[classTypeName]) {
                    if (
                        !defaultClasses[classTypeName].hasOwnProperty(className)
                        || this.isset(className)
                    ) {
                        continue;
                    }
                    var classDefinition = defaultClasses[classTypeName][className];

                    this.add(
                        classTypeName,
                        className,
                        classDefinition
                    );
                }
            }
        }

        // Adding event listeners

        var eventManager = module.getEventManager();

        // Checking for classes with the same name in module (and its plug-ins)

        eventManager.getEvent('onLoadingEnd').addListener(function(evt) {
            $this.checkForClones();
            $this.initializeClasses();
        });

        // Checking for classes with the same name in module (and its plug-ins)
        // after the new plug-in module was added

        eventManager.getEvent('onAddPlugin').addListener(function(evt, pluginModule) {
            $this.checkForClones();
            pluginModule.getClassManager().initializeClasses();
        });

        // Start loading classes

        setTimeout(function() {
            if (!module.isRoot()) {
                return;
            }
            var classesLength = Object.keys($this.getClasses()).length;
            var standardClassesLength = Object.keys(ClassManager.getClasses()).length;

            if (classesLength == standardClassesLength) {
                module.getLoadManager().startLoading();
            }
        }, 20);
    };

    /**
     * Initializes registered classes
     *
     * @method initializeClasses
     * @memberOf Subclass.ClassManager.prototype
     */
    ClassManager.prototype.initializeClasses = function()
    {
        var classes = this.getClasses();

        for (var className in classes) {
            if (classes.hasOwnProperty(className)) {
                classes[className].createConstructor();
            }
        }
    };

    /**
     * Returns the module instance
     *
     * @method getModule
     * @memberOf Subclass.ClassManager.prototype
     *
     * @returns {Subclass.Module}
     *      The module instance
     */
    ClassManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns the instance of class loader
     *
     * @method getLoader
     * @memberOf Subclass.ClassManager.prototype
     *
     * @returns {Subclass.Class.ClassLoader|*}
     */
    ClassManager.prototype.getLoader = function()
    {
        return this._loader;
    };

    /**
     * Return all registered classes
     *
     * @method getClasses
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {boolean} [privateClasses=false]
     *      If it's true it returns classes only from current module
     *      without classes from its plug-ins
     *
     * @param {boolean} [withParentClasses=true]
     *      Should or not will be returned the classes from the parent
     *      modules (it is actual if the current module is a plug-in)
     *
     * @returns {Object.<Subclass.Class.ClassType>}
     */
    ClassManager.prototype.getClasses = function(privateClasses, withParentClasses)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var classes = {};
        var $this = this;

        if (privateClasses !== true) {
            privateClasses = false;
        }
        if (withParentClasses !== false) {
            withParentClasses = true;
        }

        // Returning classes from current module with classes from its parent modules

        if (!privateClasses && withParentClasses && !mainModule.isRoot() && arguments[2] != mainModule) {
            return mainModule.getRoot().getClassManager().getClasses(false, false, mainModule);

        // Returning classes from current module (without its plug-ins)

        } else if (privateClasses) {
            return this._classes;
        }

        // Adding classes from plug-in modules to result of searching

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(classes, $this.getClasses(true, false));
                return;
            }
            var moduleClassManager = module.getClassManager();
            var moduleClasses = moduleClassManager.getClasses(false, false);

            Subclass.Tools.extend(classes, moduleClasses);
        });

        return classes;
    };

    /**
     * Checks whether class manager contains any class
     *
     * @method isEmpty
     * @memberOf Subclass.ClassManager.prototype
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isEmpty = function()
    {
        return Subclass.Tools.isEmpty(this._classes);
    };

    /**
     * Returns module names where is defined class with specified name.<br /><br />
     *
     * It is especially actual if class with specified name is defined
     * at once in several modules. So it's convenient to use for searching
     * classes with the same name defined in multiple modules.
     *
     * @method findLocations
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {string} className
     * @returns {string[]}
     */
    ClassManager.prototype.findLocations = function(className)
    {
        var mainModule = this.getModule().getRoot();
        var locations = [];

        if (arguments[1]) {
            mainModule = arguments[1];
        }
        var moduleStorage = this.getModule().getModuleStorage();

        moduleStorage.eachModule(function(module) {
            var classManager = module.getClassManager();

            if (classManager.isset(className, true)) {
                locations.push(module.getName());
            }
            if (module == mainModule) {
                return;
            }
            if (module.hasPlugins()) {
                var pluginModuleStorage = module.getModuleStorage();
                var plugins = pluginModuleStorage.getPlugins();

                for (var i = 0; i < plugins.length; i++) {
                    var subPlugin = plugins[i];
                    var subPluginClassManager = subPlugin.getClassManager();
                    var subPluginLocations = subPluginClassManager.findLocations(className, subPlugin);

                    locations = locations.concat(subPluginLocations);
                }
            }
        });

        return locations;
    };

    /**
     * Validates whether there are classes with the same names in the module and its plug-ins
     *
     * @method checkForClones
     * @memberOf Subclass.ClassManager.prototype
     *
     * @throws {Error}
     *      Throws error if definition multiple definition of class with the same name
     */
    ClassManager.prototype.checkForClones = function()
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var $this = this;
        var classes = {};

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(classes, $this._classes);
                return;
            }
            var moduleClassManager = module.getClassManager();
            var moduleClasses = moduleClassManager.getClasses(false, false);

            for (var className in moduleClasses) {
                if (
                    !moduleClasses.hasOwnProperty(className)
                    || ClassManager.isset(className)
                ) {
                    continue;
                }
                if (classes[className]) {
                    var classLocations = $this.findLocations(className);

                    Subclass.Error.create(
                        'Multiple class definition detected. Class "' + className + '" defined ' +
                        'in modules: "' + classLocations.join('", "') + '".'
                    );
                }
                classes[className] = 1;
            }
        });
    };

    /**
     * The same as the {@link Subclass.Class.ClassLoader#loadClass}
     *
     * @method load
     * @memberOf Subclass.ClassManager.prototype
     * @alias Subclass.Class.ClassLoader#loadClass
     */
    ClassManager.prototype.load = function()
    {
        var classLoader = this.getLoader();

        classLoader.loadClass.apply(classLoader, arguments);
    };

    /**
     * Creates the instance of class definition
     *
     * @method create
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {Function} classConstructor
     *      Class constructor of specific class type
     *
     * @param {string} className
     *      A name of the future class
     *
     * @param {Object} classDefinition
     *      A definition of the creating class
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.create = function(classConstructor, className, classDefinition)
    {
        return Subclass.Tools.createClassInstance(
            classConstructor,
            this,
            className,
            classDefinition
        );
    };

    /**
     * Adds a new class
     *
     * @method add
     * @memberOf Subclass.ClassManager.prototype
     *
     * @throws {Error}
     *      Throws error if:
     *      - The class type name was not specified
     *      - Specified non existent class type name
     *      - Missed or not valid the name class
     *      - Missed or not valid the definition of class
     *      - Trying to redefine already existent class
     *
     * @param {string} classTypeName
     *      The name of class type (i.e. "Class", "AbstractClass", "Interface" etc.)
     *
     * @param {string} className
     *      The name of future class
     *
     * @param {object} classDefinition
     *      The object with definition of the creating class
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.add = function(classTypeName, className, classDefinition)
    {
        if (!classTypeName) {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'without specifying class type.'
            );
        }
        if (!Subclass.ClassManager.issetType(classTypeName)) {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'of unknown class type "' + classTypeName + '".'
            );
        }
        if (!className || typeof className != 'string') {
            Subclass.Error.create(
                'Trying to register the class with wrong name "' + className + '".'
            );
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            Subclass.Error.create(
                'Trying to register the class "' + className + '" ' +
                'with empty or not valid class definition.'
            );
        }
        if (this.isset(className)) {
            Subclass.Error.create(
                'Trying to define class with already ' +
                'existed class name "' + className + '".'
            );
        }
        var classTypeConstructor = Subclass.ClassManager.getType(classTypeName);
        var classTypeInstance = this.create(classTypeConstructor, className, classDefinition);

        this._classes[className] = classTypeInstance;
        this.getLoader().setClassLoaded(className);

        return classTypeInstance;
    };

    /**
     * Returns the class definition instance
     *
     * @method get
     * @memberOf Subclass.ClassManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to get non existent class definition instance
     *
     * @param {string} className
     *      The name of needed class
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.get = function(className)
    {
        if (!this.isset(className)) {
            Subclass.Error.create('Trying to call to none existed class "' + className + '".');
        }
        return this.getClasses()[className];
    };

    /**
     * Checks if class with specified name was ever registered
     *
     * @method isset
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {string} className
     *      The name of needed class
     *
     * @param {boolean} [privateClasses=false]
     *      If it's true then the checking will be performed only between classes
     *      from current module without classes from its plugins
     *
     * @returns {boolean}
     */
    ClassManager.prototype.isset = function(className, privateClasses)
    {
        var withParentClasses = true;

        if (privateClasses === true) {
            withParentClasses = false;
        }
        return !!this.getClasses(privateClasses, withParentClasses)[className];
    };

    /**
     * Builds the new class of specified class type.
     * Creates the class builder instance.
     *
     * @method build
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {string} classType
     *      The type of class, i.e. 'Class', 'AbstractClass', 'Config', 'Interface', 'Trait'
     *
     * @param {string} [className]
     *      The name of creating class
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassManager.prototype.build = function(classType, className)
    {
        return this.createBuilder(classType, className);
    };

    /**
     * Modifies existed class definition
     *
     * @method alter
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {string} className
     *      The name of class
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassManager.prototype.alter = function(className)
    {
        return this.createBuilder(null, className);
    };

    /**
     * Registers and returns copy of specified class with specified name
     *
     * @method copy
     * @memberOf Subclass.ClassManager.prototype
     *
     * @param {string} className
     *      The name of source class
     *
     * @param {string} classNameNew
     *      The name of new class
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassManager.prototype.copy = function(className, classNameNew)
    {
        var classInst = this.get(className);
        var classDefinition = classInst.getDefinition().getData();
        var replicaInst = this.add(
            classInst.getType(),
            classNameNew,
            classDefinition
        );
        replicaInst.createConstructor();

        return replicaInst;
    };

    /**
     * Creates the instance of class builder
     *
     * @method createBuilder
     * @memberOf Subclass.ClassManager.prototype
     *
     * @throws {Error}
     *      Throws error if it was specified the name of class
     *      which you want to alter but it doesn't exist
     *
     * @param {string} classType
     *      The name of class type
     *
     * @param {string} [className]
     *      The name class you want to alter.
     *      If it is missing the creating of new class definition will be started.
     */
    ClassManager.prototype.createBuilder = function(classType, className)
    {
        var classBuilderConstructor = null;

        if (!classType && className && !this.isset(className)) {
            Subclass.Error.create(
                'Can\'t alter definition of class "' + className + '". ' +
                'It does not exists.'
            );
        }
        if (!classType && className) {
            classBuilderConstructor = this.get(className).constructor.getBuilderClass();

        } else {
            classBuilderConstructor = Subclass.ClassManager
                .getType(classType)
                .getBuilderClass()
            ;
        }
        return Subclass.Tools.createClassInstance(
            classBuilderConstructor,
            this,
            classType,
            className
        );
    };


    //============================== Class Manager API ================================

    /**
     * Classes that will be added to class manager instance immediately after its creation
     *
     * @type {Object.<Object>}
     * @private
     */
    ClassManager._classes = {};

    /**
     * @type {Object.<function>}
     * @private
     */
    ClassManager._classTypes = {};

    /**
     * Returns all registered default classes
     *
     * @method getClasses
     * @memberOf Subclass.ClassManager
     *
     * @returns {Object.<Object>}
     */
    ClassManager.getClasses = function()
    {
        return this._classes;
    };

    /**
     * Registers the new class.
     * The classes registered by this way will be available in every created module.
     *
     * @method register
     * @memberOf Subclass.ClassManager
     *
     * @throws {Error}
     *      Throws error if trying to redefine already existent class
     *      with the same name in the common scope
     *
     * @param {string} classTypeName
     *      The name of class type
     *
     * @param {string} className
     *      The name of registering class
     *
     * @param {Object} classDefinition
     *      The object with definition of future class
     */
    ClassManager.register = function(classTypeName, className, classDefinition)
    {
        if (this.isset(className)) {
            Subclass.Error.create('The class "' + className + '" is already registered.');
        }
        if (!this._classes[classTypeName]) {
            this._classes[classTypeName] = {};
        }
        this._classes[classTypeName][className] = classDefinition;
    };

    /**
     * Checks whether class with passed name was ever registered.
     * It performs checking only in the common registered classes.
     *
     * @method isset
     * @memberOf Subclass.ClassManager
     *
     * @param {string} className
     *      The name of class
     *
     * @returns {boolean}
     */
    ClassManager.isset = function(className)
    {
        for (var classTypeName in this._classes) {
            if (!this._classes.hasOwnProperty(classTypeName)) {
                continue;
            }
            if (!!this._classes[classTypeName][className]) {
                return true;
            }
        }
        return false;
    };

    /**
     * Registers the new class type
     *
     * @method registerType
     * @memberOf Subclass.ClassManager
     *
     * @param {Function} classTypeConstructor
     *      The constructor of registering class type factory
     */
    ClassManager.registerType = function(classTypeConstructor)
    {
        var classTypeName = classTypeConstructor.getClassTypeName();

        this._classTypes[classTypeName] = classTypeConstructor;

        /**
         * Registering new class type
         *
         * @param {string} className
         * @param {Object} classDefinition
         */
        Subclass.ModuleAPI.prototype["register" + classTypeName] = function (className, classDefinition)
        {
            return this.getModule().getClassManager().add(
                classTypeConstructor.getClassTypeName(),
                className,
                classDefinition
            );
        };
    };

    /**
     * Returns the class type factory constructor
     *
     * @method getType
     * @memberOf Subclass.ClassManager
     *
     * @throws {Error}
     *      Throws error if trying to get constructor
     *      of non existent class type factory
     *
     * @param classTypeName
     *      The name of class type
     *
     * @returns {Function}
     */
    ClassManager.getType = function(classTypeName)
    {
        if (!this.issetType(classTypeName)) {
            Subclass.Error.create('Trying to get non existed class type factory "' + classTypeName + '".');
        }
        return this._classTypes[classTypeName];
    };

    /**
     * Checks if exists specified class type
     *
     * @method issetType
     * @memberOf Subclass.ClassManager
     *
     * @param {string} classTypeName
     *      The name of class type
     *
     * @returns {boolean}
     */
    ClassManager.issetType = function(classTypeName)
    {
        return !!this._classTypes[classTypeName];
    };

    /**
     * Returns names of all registered class types
     *
     * @method getTypes
     * @memberOf Subclass.ClassManager
     *
     * @returns {Object.<Function>}
     */
    ClassManager.getTypes = function()
    {
        return this._classTypes;
    };

    return ClassManager;
})();

// Source file: Class/ClassType.js

/**
 * @namespace
 */
Subclass.Class = {};

/**
 * @namespace
 */
Subclass.Class.Type = {};

/**
 * @class
 * @description Abstract class of the each class type.
 *      Each instance of current class is a class definition which will be used
 *      for creating instances of its declaration.
 */
Subclass.Class.ClassType = function()
{
    /**
     * @param {Subclass.ClassManager} classManager
     *      Instance of class manager which will hold all class definitions of current module
     *
     * @param {string} className
     *      Name of the creating class
     *
     * @param {Object} classDefinition
     *      Definition of the creating class
     *
     * @constructor
     */
    function ClassType(classManager, className, classDefinition)
    {
        if (!classManager) {
            Subclass.Error.create('InvalidArgument')
                .argument("the class manager instance", false)
                .received(classManager)
                .expected("an instance of Subclass.ClassManager class")
                .apply()
            ;
        }
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        if (!classDefinition && typeof classDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected("a plain object")
                .apply()
            ;
        }

        /**
         * The instance of class manager
         *
         * @type {Subclass.ClassManager}
         * @private
         */
        this._classManager = classManager;

        /**
         * The name of class
         *
         * @type {string}
         * @private
         */
        this._name = className;

        /**
         * The instance class definition
         *
         * @type {(Object|Subclass.Class.ClassDefinition)}
         * @private
         */
        this._definition = classDefinition;

        /**
         * The class constructor function
         *
         * @type {(function|null)}
         * @private
         */
        this._constructor = null;

        /**
         * The instance of class which is parent of current class
         *
         * @type {(Subclass.Class.ClassType|null)}
         * @private
         */
        this._parent = null;

        /**
         * Names of class constants
         *
         * @type {Array}
         * @private
         */
        this._constants = [];

        /**
         * Array with class names of classes which inherit current class
         *
         * @type {Array}
         * @private
         */
        this._children = [];

        /**
         * Reports whether the instance of current class was created
         *
         * @type {boolean}
         * @private
         */
        this._created = false;

        /**
         * List of events
         *
         * @type {Array}
         * @private
         */
        this._events = [];

        /**
         * Initializing operations
         */

        this
            .registerEvent("onInitialize")
            .registerEvent("onCreateClassBefore")
            .registerEvent("onCreateClass")
            .registerEvent("onCreateClassAfter")
            .registerEvent("onCreateInstanceBefore")
            .registerEvent("onCreateInstance")
            .registerEvent("onCreateInstanceAfter")
            .registerEvent("onAddChildClass")
            .registerEvent("onRemoveChildClass")
            .registerEvent("onGetClassChildren")
            .registerEvent("onGetClassParents")
            .registerEvent("onSetParent")
            .registerEvent("onSetConstant")
        ;

        this.initialize();
    }

    /**
     * Can be parent class type
     *
     * @type {(Subclass.Class.ClassType|null)}
     */
    ClassType.$parent = Subclass.Extendable;

    /**
     * List of class mixins
     *
     * @type {Array.<Function>}
     */
    ClassType.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Returns name of class type
     *
     * @example Example:
     *      Subclass.Class.Trait.Trait.getClassTypeName(); // returns "Trait"
     *
     * @returns {string}
     */
    ClassType.getClassTypeName = function ()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getClassTypeName")
            .apply()
        ;
    };

    /**
     * Returns class builder constructor for specific class of current class type.
     *
     * @example Example:
     *      Subclass.Class.Type.AbstractClass.AbstractClass.getBuilderClass();
     *      // returns Subclass.Class.Type.AbstractClass.AbstractClassBuilder class constructor
     *
     * @returns {Function}
     */
    ClassType.getBuilderClass = function()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getBuilderClass")
            .apply()
        ;
    };

    /**
     * Returns constructor for creating class definition instance
     *
     * @returns {Function}
     *      Returns class type definition constructor function
     */
    ClassType.getDefinitionClass = function()
    {
        return Subclass.Class.ClassDefinition;
    };

    /**
     * Initializes class on creation stage.<br /><br />
     *
     * Current method invokes automatically right at the end of the class type constructor.
     * It can contain different manipulations with class definition or other manipulations that is needed
     */
    ClassType.prototype.initialize = function()
    {
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
        this._definition = this.createDefinition(this._definition);

        var classDefinition = this.getDefinition();
            classDefinition.processRelatedClasses();
    };

    /**
     * Returns name of class type
     *
     * @returns {string}
     */
    ClassType.prototype.getType = function()
    {
        return this.constructor.getClassTypeName();
    };

    /**
     * Returns class manager instance
     *
     * @returns {Subclass.ClassManager}
     */
    ClassType.prototype.getClassManager = function ()
    {
        return this._classManager;
    };

    /**
     * Returns name of the current class instance
     *
     * @returns {string}
     */
    ClassType.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Creates and returns class definition instance.
     *
     * @param {Object} classDefinition
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.createDefinition = function(classDefinition)
    {
        return Subclass.Tools.createClassInstance(
            this.constructor.getDefinitionClass(),
            this,
            classDefinition
        );
    };

    /**
     * Sets class definition
     *
     * @param {Object} classDefinition
     */
    ClassType.prototype.setDefinition = function(classDefinition)
    {
        var classChildren = this.getClassChildren();
        var classParents = this.getClassParents();
        var classManager = this.getClassManager();

        for (var i = 0; i < classParents.length; i++) {
            var parentClass = classManager.get(classParents[i]);
                parentClass.removeChildClass(this.getName());
        }
        this.constructor.call(
            this,
            this.getClassManager(),
            this.getName(),
            classDefinition
        );
        this._children = classChildren;
        this.createConstructor();
    };

    /**
     * Returns class definition object
     *
     * @returns {Subclass.Class.ClassDefinition}
     */
    ClassType.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Adds name of child class to current class
     *
     * @param {string} className
     *      The name of class
     */
    ClassType.prototype.addChildClass = function(className)
    {
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of child class', false)
                .expected('a string')
                .received(className)
                .apply()
            ;
        }
        if (this.hasChild(className)) {
            return;
        }
        this._children.push(className);

        var classManager = this.getClassManager();
        var classInst = classManager.get(className);
        var classInstChildren = classInst.getClassChildren();
        var classParents = this.getClassParents();

        for (var i = 0; i < classParents.length; i++) {
            var parentClassInst = classManager.get(classParents[i]);
            parentClassInst.addChildClass(className);
        }
        for (i = 0; i < classInstChildren.length; i++) {
            if (!this.hasChild(classInstChildren[i])) {
                this.addChildClass(classInstChildren[i]);
            }
        }
        this
            .getEvent('onAddChildClass')
            .trigger(className)
        ;
    };

    /**
     * Checks whether current class has children with specified class name
     *
     * @param {string} className
     * @returns {boolean}
     */
    ClassType.prototype.hasChild = function(className)
    {
        return this._children.indexOf(className) >= 0;
    };

    /**
     * Removes name of child class from current class
     *
     * @param {string} className
     *      The name of class
     */
    ClassType.prototype.removeChildClass = function(className)
    {
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of child class', false)
                .expected('a string')
                .received(className)
                .apply()
            ;
        }
        var classIndex = this._children.indexOf(className);

        if (classIndex >= 0) {
            this._children.splice(classIndex, 1);
        }
        if (this.hasParent()) {
            this.getParent().removeChildClass(className);
        }
        this
            .getEvent('onRemoveChildClass')
            .trigger(className)
        ;
    };

    /**
     * Returns array of children class names which inherits current class
     *
     * @param {boolean} [grouping=false]
     *      Whether the class names should be grouped
     *
     * @return {(string[]|Object)}
     */
    ClassType.prototype.getClassChildren = function(grouping)
    {
        if (grouping !== true) {
            return this._children;
        }
        var classes = {};

        for (var i = 0; i < this._children.length; i++) {
            var childClassName = this._children[i];
            var childClassType = this.getClassManager().get(this._children[i]).getType();

            if (!classes.hasOwnProperty(childClassType)) {
                classes[childClassType] = [];
            }
            classes[childClassType].push(childClassName);
        }
        this
            .getEvent('onGetClassChildren')
            .trigger(classes)
        ;
        return classes;
    };

    /**
     * Returns chain of parent class names
     *
     * @param {boolean} [grouping=false]
     *      Whether the class names should be grouped
     *
     * @returns {(string[]|Object)}
     */
    ClassType.prototype.getClassParents = function(grouping)
    {
        var classes = [];

        function addClassName(classes, className)
        {
            if (classes.indexOf(className) < 0) {
                classes.push(className);
            }
        }
        if (grouping !== true) {
            grouping = false;
        }
        if (grouping) {
            classes = {};
        }
        if (arguments[1]) {
            classes = arguments[1];
        }
        if (this.hasParent()) {
            var parent = this.getParent();
            var parentName = parent.getName();

            if (grouping) {
                var parentType = parent.getType();

                if (!classes.hasOwnProperty(parentType)) {
                    classes[parentType] = [];
                }
                addClassName(classes[parentType], parentName);

            } else {
                addClassName(classes, parentName);
            }
            classes = parent.getClassParents(grouping, classes);
        }
        this
            .getEvent('onGetClassParents')
            .trigger(classes, grouping)
        ;
        return classes;
    };

    /**
     * Sets class parent
     *
     * @param {string} parentClassName
     */
    ClassType.prototype.setParent = function (parentClassName)
    {
        if (parentClassName == this.getName()) {
            Subclass.Tools.create("Trying to set class as the parent for itself.")
        }
        if (typeof parentClassName == 'string') {
            this._parent = this.getClassManager().get(parentClassName);
            this._parent.addChildClass(this.getName());

        } else if (parentClassName === null) {
            if (this.hasParent()) {
                this._parent.removeChildClass(this.getName());
            }
            this._parent = null;

        } else {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of parent class", false)
                .received(parentClassName)
                .expected('a name of parent class or null in class "' + this.getName() + '"')
                .apply()
            ;
        }
        this
            .getEvent('onSetParent')
            .trigger(parentClassName)
        ;
    };

    /**
     * Returns parent class instance
     *
     * @return {(Subclass.Class.ClassType|null)}
     */
    ClassType.prototype.getParent = function ()
    {
        return this._parent;
    };

    /**
     * Checks whether current class extends another one
     *
     * @returns {boolean}
     */
    ClassType.prototype.hasParent = function()
    {
        return !!this._parent;
    };

    /**
     * Sets constants of the class
     *
     * @param {Object} constants
     *      The plain object which keys are names and values are values of constants
     */
    ClassType.prototype.setConstants = function(constants)
    {
        if (!constants || !Subclass.Tools.isPlainObject(constants)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the constants definition', false)
                .expected('a plain object')
                .received(constants)
                .apply()
            ;
        }
        for (var constantName in constants) {
            if (constants.hasOwnProperty(constantName)) {
                this.setConstant(constantName, constants[constantName]);
            }
        }
    };

    /**
     * Creates the new (or redefines) constant with specified name and value
     *
     * @throws {Error}
     *      Throws error if specified invalid constant name
     *
     * @param {string} constantName
     *      The name of constant
     *
     * @param {*} constantValue
     *      The value of constant
     */
    ClassType.prototype.setConstant = function(constantName, constantValue)
    {
        if (!constantName || typeof constantName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of constant', false)
                .expected('a string')
                .received(constantName)
                .apply()
            ;
        }
        this._constants.push(constantName);

        Object.defineProperty(this, constantName, {
            enumerable: true,
            configurable: false,
            writable: false,
            value: constantValue
        });

        this
            .getEvent('onSetConstant')
            .trigger(constantName, constantValue)
        ;
    };

    /**
     * Returns class constants
     *
     * @param {boolean} [withInherited=false]
     *
     * @returns {Object}
     */
    ClassType.prototype.getConstants = function(withInherited)
    {
        var constantNames = this._constants;
        var constants = {};

        for (var i = 0; i < constantNames.length; i++) {
            constants[constantNames[i]] = this[constantNames[i]];
        }
        return constants;
    };

    /**
     * Returns constructor function for current class type
     *
     * @returns {function} Returns named function
     * @throws {Error}
     */
    ClassType.prototype.getConstructorEmpty = function ()
    {
        Subclass.Error.create("NotImplementedMethod")
            .method("getConstructorEmpty")
            .apply()
        ;
    };

    /**
     * Returns class constructor
     *
     * @returns {Function}
     */
    ClassType.prototype.getConstructor = function ()
    {
        if (!this.isConstructorCreated()) {
            this.createConstructor();
        }
        return this._constructor;
    };

    /**
     * Checks whether class constructor is created
     *
     * @returns {boolean}
     */
    ClassType.prototype.isConstructorCreated = function()
    {
        return !!this._constructor;
    };

    /**
     * Generates and returns current class instance constructor
     *
     * @returns {function}
     */
    ClassType.prototype.createConstructor = function ()
    {
        if (this.isConstructorCreated()) {
            return this._constructor;
        }

        // Processing class definition

        var classDefinition = this.getDefinition();
        var baseClassDefinition = classDefinition.getBaseData();
        classDefinition.normalizeData();

        this.getEvent('onCreateClassBefore').trigger(classDefinition);

        classDefinition.setData(Subclass.Tools.extend(
            baseClassDefinition,
            classDefinition.getData()
        ));
        classDefinition.validateData();
        classDefinition.processData();


        // Creating constructor

        var classConstructor = this.getConstructorEmpty();
        var parentClass = this.getParent();

        if (parentClass) {
            var parentClassConstructor = parentClass.getConstructor();
            var classConstructorProto = Object.create(parentClassConstructor.prototype);

            Subclass.Tools.extend(classConstructorProto, classConstructor.prototype);
            classConstructor.prototype = classConstructorProto;
        }

        this.getEvent('onCreateClass').trigger(classConstructor);

        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMethods());
        Subclass.Tools.extend(classConstructor.prototype, this.getDefinition().getMetaData());

        Object.defineProperty(classConstructor.prototype, "constructor", {
            enumerable: false,
            configurable: true,
            value: classConstructor
        });

        classConstructor.prototype.$_className = this.getName();
        classConstructor.prototype.$_classType = this.constructor.getClassTypeName();
        classConstructor.prototype.$_class = this;

        this._constructor = classConstructor;
        this.getEvent('onCreateClassAfter').trigger(classConstructor);

        return classConstructor;
    };

    /**
     * Creates class instance of current class type
     *
     * @returns {object} Class instance
     */
    ClassType.prototype.createInstance = function()
    {
        var args = [];

        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }

        var classConstructor = this.getConstructor();
        var classInstance = new classConstructor();

        this.getEvent('onCreateInstanceBefore').trigger(classInstance);

        // Adding no methods to class instance

        var classNoMethods = this.getDefinition().getNoMethods(true);

        for (var propName in classNoMethods) {
            if (!classNoMethods.hasOwnProperty(propName)) {
                continue;
            }
            classInstance[propName] = Subclass.Tools.copy(classNoMethods[propName]);
        }

        this.getEvent('onCreateInstance').trigger(classInstance);

        Object.seal(classInstance);

        if (classInstance.$_constructor) {
            classInstance.$_constructor.apply(classInstance, args);
        }

        // Telling that instance of current class was created

        this.setInstanceCreated();
        this.getEvent('onCreateInstanceAfter').trigger(classInstance);

        return classInstance;
    };

    /**
     * Sets state that the instance of current class was created
     */
    ClassType.prototype.setInstanceCreated = function()
    {
        var classManager = this.getClassManager();
        var classParents = this.getClassParents();

        for (var i = 0; i < classParents.length; i++) {
            classManager.get(classParents[i]).setInstanceCreated();
        }
        this._created = true;
    };

    /**
     * Reports whether the instance of current class was ever created
     *
     * @returns {boolean}
     */
    ClassType.prototype.wasInstanceCreated = function()
    {
        if (this._created) {
            return true;
        }
        if (this.hasParent()) {
            return this.getParent().wasInstanceCreated();
        }
        return false;
    };

    /**
     * Checks if current class is instance of another class
     *
     * @param {string|Subclass.Class.ClassType} className
     * @return {boolean}
     */
    ClassType.prototype.isInstanceOf = function (className)
    {
        if (
            !className
            || (
                typeof className != 'string'
                && typeof className != 'object'
            ) || (
                typeof className == 'object'
                && !(className instanceof Subclass.Class.ClassType)
            )
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of class", false)
                .received(className)
                .expected("a string or an instance of Subclass.Class.ClassType")
                .apply()
            ;
        }
        if (typeof className == 'object') {
            className = className.getName();
        }
        if (this.getName() == className) {
            return true;

        }
        return this.getClassParents().indexOf(className) >= 0;
    };

    return ClassType;

}();

// Source file: Class/ClassDefinition.js

/**
 * @class
 */
Subclass.Class.ClassDefinition = (function()
{
    function ClassDefinition (classInst, classDefinition)
    {
        if (!classInst || !(classInst instanceof Subclass.Class.ClassType)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the class instance", false)
                .received(classInst)
                .expected('an instance of "Subclass.Class.ClassType"')
                .apply()
            ;
        }
        if (!classDefinition || typeof classDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected('a plain object')
                .apply()
            ;
        }

        /**
         * @type {Subclass.Class.ClassType}
         * @private
         */
        this._class = classInst;

        /**
         * @type {Object}
         * @private
         */
        this._data = classDefinition;

        /**
         * @type {Object}
         * @private
         */
        this._events = {};

        // Initializing operations

        this
            .registerEvent('onInitialize')
            .registerEvent('onGetBaseData')
            .registerEvent('onProcessRelatedClasses')
            .registerEvent('onNormalizeData')
            .registerEvent('onValidateData')
            .registerEvent('onProcessData')
            .registerEvent('onGetNoMethods')
            .registerEvent('onGetMethods')
            .registerEvent('onGetMetaData')
        ;
        this.initialize();
    }

    ClassDefinition.$parent = Subclass.Extendable;

    ClassDefinition.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Initializes class definition
     */
    ClassDefinition.prototype.initialize = function()
    {
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    };

    /**
     * Returns class definition object
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getData = function()
    {
        return this._data;
    };

    /**
     * Sets class definition data
     *
     * @param data
     */
    ClassDefinition.prototype.setData = function(data)
    {
        if (!data || typeof data != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition data", false)
                .received(data)
                .expected("a plain object")
                .apply()
            ;
        }
        this._data = data;
    };

    /**
     * Returns class instance
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassDefinition.prototype.getClass = function()
    {
        return this._class;
    };

    /**
     * Validates "$_requires" option value
     *
     * @param {*} requires
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateRequires = function(requires)
    {
        if (requires && typeof requires != 'object') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_requires')
                .received(requires)
                .className(this.getClass().getName())
                .expected('a plain object with string properties')
                .apply()
            ;
        }
        if (requires) {
            if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    if (typeof requires[i] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            } else {
                for (var alias in requires) {
                    if (!requires.hasOwnProperty(alias)) {
                        continue;
                    }
                    if (!alias[0].match(/[a-z$_]/i)) {
                        Subclass.Error.create(
                            'Invalid alias name for required class "' + requires[alias] + '" ' +
                            'in class "' + this.getClass().getName() + '".'
                        );
                    }
                    if (typeof requires[alias] != 'string') {
                        Subclass.Error.create('InvalidClassOption')
                            .option('$_requires')
                            .received(requires)
                            .className(this.getClass().getName())
                            .expected('a plain object with string properties')
                            .apply()
                        ;
                    }
                }
            }
        }
        return true;
    };

    /**
     * Sets "$_requires" option value
     *
     * @param {Object.<string>} requires
     *
     * List of the classes that current one requires. It can be specified in two ways:
     *
     * 1. As an array of class names:
     *
     * Example:
     * [
     *    "Namespace/Of/Class1",
     *    "Namespace/Of/Class2",
     *    ...
     * ]
    */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;
    };

    /**
     * Return "$_requires" option value
     *
     * @returns {Object.<string>}
     */
    ClassDefinition.prototype.getRequires = function()
    {
        return this.getData().$_requires;
    };

    /**
     * Validates "$_extends" option value
     *
     * @param {*} parentClassName
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateExtends = function(parentClassName)
    {
        if (parentClassName !== null && typeof parentClassName != 'string') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_extends')
                .received(parentClassName)
                .className(this.getClass().getName())
                .expected('a string or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_extends" option value
     *
     * @param {string} parentClassName  Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setExtends = function(parentClassName)
    {
        this.validateExtends(parentClassName);
        this.getData().$_extends = parentClassName;

        if (parentClassName) {
            this.getClass().setParent(parentClassName);
        }
    };

    /**
     * Returns "$_extends" option value
     *
     * @returns {string}
     */
    ClassDefinition.prototype.getExtends = function()
    {
        return this.getData().$_extends;
    };

    /**
     * Validates "$_constants" option value
     *
     * @param {*} constants
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateConstants = function(constants)
    {
        if (constants !== null && !Subclass.Tools.isPlainObject(constants)) {
            Subclass.Error.create("InvalidClassOption")
                .option('$_constants')
                .className(this.getClass().getName())
                .received(constants)
                .expected('a plain object with not function values')
                .apply()
            ;
        } else if (constants) {
            for (var constantName in constants) {
                if (!constants.hasOwnProperty(constantName)) {
                    continue;
                }
                if (typeof constants[constantName] == 'function') {
                    Subclass.Error.create("InvalidClassOption")
                        .option('$_constants')
                        .className(this.getClass().getName())
                        .expected('a plain object with not function values')
                        .apply()
                    ;
                }
            }
        }
    };

    /**
     * Sets "$_constants" option value
     *
     * @param {Object} constants
     *      Name of parent class, i.e. "Namespace/Of/ParentClass"
     */
    ClassDefinition.prototype.setConstants = function(constants)
    {
        this.validateConstants(constants);
        this._constants = constants;

        if (constants) {
            this.getClass().setConstants(constants);
        }
    };

    /**
     * Returns "$_constants" option value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getConstants = function()
    {
        return this._constants;
    };

    /**
     * Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMetaData = function(withInherited)
    {
        var metaData = this._getDataPart('metaData', withInherited);

        this.getEvent('onGetMetaData').trigger(metaData);

        return metaData;
    };

    /**
     * Returns all class methods (except methods which names started from symbols "$_")
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getMethods = function(withInherited)
    {
        var methods = this._getDataPart('methods', withInherited);

        this.getEvent('onGetMethods').trigger(methods);

        return methods;
    };

    /**
     * Returns class to which belongs specified method body
     *
     * @param {Function} methodName
     *      The name of class method
     *
     * @returns {(Subclass.Class.ClassType|null)}
     */
    ClassDefinition.prototype.getMethodClass = function(methodName)
    {
        var classInst = this.getData();

        if (classInst.hasOwnProperty(methodName)) {
            return this.getClass();
        }
        if (this.getClass().hasParent()) {
            return this.getClass()
                .getParent()
                .getDefinition()
                .getMethodClass(methodName)
            ;
        }
        return null;
    };

    /**
     * Returns class method by its name
     *
     * @param {string} methodName
     *      The name of method
     */
    ClassDefinition.prototype.getMethod = function(methodName)
    {
        if (!this.issetMethod(methodName)) {
            Subclass.Error.create(
                'Trying to get non existent method "' + methodName + '" ' +
                'from definition of class "' + this.getClass().getName() + '".'
            );
        }
        return this.getMethods(true)[methodName];
    };

    /**
     * Checks whether method with specified name exists
     *
     * @param {string} methodName
     *      The name of method
     */
    ClassDefinition.prototype.issetMethod = function(methodName)
    {
        return this.getMethods(true).hasOwnProperty(methodName);
    };

    /**
     * Returns all class properties (except properties which names started from symbols "$_")
     * that are not methods
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     */
    ClassDefinition.prototype.getNoMethods = function(withInherited)
    {
        var noMethods = this._getDataPart('noMethods', withInherited);

        this.getEvent('onGetNoMethods').trigger(noMethods);

        return noMethods;
    };

    /**
     * Returns some grouped parts of class definition depending on specified typeName.
     *
     * @param {string} typeName
     *      Can be one of the followed values: 'noMethods', 'methods' or 'metaData'
     *
     *      noMethods - Returns all class properties (except properties which names started from symbols "$_")
     *      that are not methods
     *
     *      methods - Returns all class methods (except methods which names started from symbols "$_")
     *
     *      metaData - Returns all properties which names started from symbols "$_"
     *
     * @param {boolean} [withInherited = false]
     * @returns {Object}
     * @private
     */
    ClassDefinition.prototype._getDataPart = function(typeName, withInherited)
    {
        if (['noMethods', 'methods', 'metaData'].indexOf(typeName) < 0) {
            Subclass.Error.create(
                'Trying to get not existent ' +
                'class definition part data "' + typeName + '".'
            );
        }
        if (withInherited !== true) {
            withInherited = false;
        }
        var definition = this.getData();
        var classInst = this.getClass();
        var parts = {};

        if (classInst.hasParent() && withInherited) {
            var classParent = classInst.getParent();
            var classParentDefinition = classParent.getDefinition();

            parts = classParentDefinition._getDataPart(
                typeName,
                withInherited
            );
        }

        for (var propName in definition) {
            if (
                !definition.hasOwnProperty(propName)
                || (
                    (typeName == 'noMethods' && (
                        typeof definition[propName] == 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'methods' && (
                        typeof definition[propName] != 'function'
                        || propName.match(/^\$_/i)

                    )) || (typeName == 'metaData' && (
                        !propName.match(/^\$_/i)
                    ))
                )
            ) {
                continue;
            }
            parts[propName] = definition[propName];
        }
        return parts;
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    ClassDefinition.prototype.createBaseData = function()
    {
        return {

            /**
             * Required classes
             *
             * @type {(string[]|Object.<string>|null)}
             */
            $_requires: null,

            /**
             * Parent class name
             *
             * @type {string}
             */
            $_extends: null,

            /**
             * Constants list
             *
             * @type {Object}
             */
            $_constants: null,

            /**
             * Returns class manager instance
             *
             * @returns {Subclass.ClassManager}
             */
            getClassManager: function()
            {
                return this.$_class.getClassManager();
            },

            /**
             * Returns class definition instance
             *
             * @returns {Subclass.Class.ClassType}
             */
            getClass: function()
            {
                return this.$_class;
            },

            /**
             * Returns class name
             *
             * @returns {string}
             */
            getClassName: function()
            {
                return this.$_className;
            },

            /**
             * Returns type name of class
             *
             * @returns {*}
             */
            getClassType: function()
            {
                return this.$_classType;
            },

            /**
             * Checks if current class instance of passed class with specified name
             *
             * @param {string} className
             * @returns {boolean}
             */
            isInstanceOf: function (className)
            {
                return this.$_class.isInstanceOf(className);
            },

            /**
             * Returns parent class
             *
             * @returns {Object} parent class.
             */
            getParent: function ()
            {
                if (this.$_class.hasParent()) {
                    return this.$_class.getParent();
                }
                return null;
            },

            /**
             *
             * @param {string} methodName
             * @param [arguments]
             */
            callParent: function (methodName)
            {
                var methodFunc = this[methodName];

                if (!methodFunc || typeof methodFunc != 'function') {
                    Subclass.Error.create(
                        'Trying to call to non existent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '"'
                    );
                }
                var parentClass = this
                    .getParent()
                    .getDefinition()
                    .getMethodClass(methodName)
                ;
                if (!parentClass) {
                    Subclass.Error.create(
                        'Trying to call parent method "' + methodName + '" ' +
                        'in class "' + this.getClass().getName() + '" which hasn\'t parent'
                    );
                }
                if (methodFunc == parentClass.getDefinition().getData()[methodName]) {
                    parentClass = parentClass.getParent();
                }
                var args = [];

                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return parentClass
                    .getDefinition()
                    .getData()[methodName]
                    .apply(this, args)
                ;
            },

            /**
             * Returns copy of current class instance
             *
             * @returns {Object}
             */
            getCopy: function()
            {
                var copyInst = new this.constructor();
                var props = Object.getOwnPropertyNames(this);

                for (var i = 0; i < props.length; i++) {
                    copyInst[props[i]] = this[props[i]];
                }
                return copyInst;
            }
        };
    };

    /**
     * Returns base class definition data
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getBaseData = function()
    {
        var data = this.createBaseData();

        // Because many class types redefine methods #createBaseData without
        // calling its parent realisation some required properties can lose.
        // To avoid it, the required properties were placed here.

        /**
         * Class name
         *
         * @type {string}
         */
        data.$_className = null;

        /**
         * Class type
         *
         * @type {string}
         */
        data.$_classType = null;

        /**
         * Class definition closure
         *
         * @type {Subclass.Class.ClassType}
         */
        data.$_class = null;


        // Triggering event handlers

        this.getEvent("onGetBaseData").trigger(data);

        return data;
    };

    /**
     * Normalizes definition data
     */
    ClassDefinition.prototype.normalizeData = function()
    {
        // Do some manipulations with class definition data

        this.getEvent('onNormalizeData').trigger(this.getData());
    };

    /**
     * Validates class definition
     *
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateData = function ()
    {
        // Do some validation manipulations with class definition data

        this.getEvent('onValidateData').trigger(this.getData());

        return true;
    };

    /**
     * Processes class definition. Getting info from classDefinition.
     */
    ClassDefinition.prototype.processData = function()
    {
        var definition = this.getData();

        for (var attrName in definition) {
            if (
                !definition.hasOwnProperty(attrName)
                || !attrName.match(/^\$_/i)
            ) {
                continue;
            }
            var setterMethod = "set" + attrName.substr(2)[0].toUpperCase() + attrName.substr(3);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        this.getEvent('onProcessData').trigger(definition);
    };

    /**
     * Searches for the names of classes which are needed to be loaded
     */
    ClassDefinition.prototype.processRelatedClasses = function()
    {
        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        var requires = this.getRequires();
        var parentClass = this.getExtends();

        // Performing $_requires option

        if (requires && this.validateRequires(requires)) {
            if (Subclass.Tools.isPlainObject(requires)) {
                for (var alias in requires) {
                    if (requires.hasOwnProperty(alias)) {
                        classManager.load(requires[alias]);
                    }
                }
            } else if (Array.isArray(requires)) {
                for (var i = 0; i < requires.length; i++) {
                    classManager.load(requires[i]);
                }
            }
        }

        // Performing $_extends option

        if (parentClass && this.validateExtends(parentClass)) {
            classManager.load(parentClass);
        }

        this.getEvent('onProcessRelatedClasses').trigger();
    };

    return ClassDefinition;

})();

// Source file: Class/ClassLoader.js

/**
 * @class
 * @constructor
 *
 * @throws {Error}
 *      Throws error if specified invalid instance of class manager
 *
 * @param {Subclass.ClassManager} classManager
 *      The instance of class manager
 */
Subclass.Class.ClassLoader = (function()
{
    function ClassLoader(classManager)
    {
        if (!classManager || !(classManager instanceof Subclass.ClassManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the class manager instance', false)
                .received(classManager)
                .expected('an instance of Subclass.ClassManager class')
                .apply()
            ;
        }

        /**
         * The instance of class manager
         *
         * @type {Subclass.ClassManager}
         */
        this._classManager = classManager;

        // Adding event listeners

        var eventManager = classManager.getModule().getEventManager();
        var loadManager = classManager.getModule().getLoadManager();

        // Removing from load stack all files of classes which are already loaded

        eventManager.getEvent('onAddToLoadStack')
            .addListener(function(evt, fileName, callback) {
                var className = fileName.replace(/\.js$/, '');

                if (classManager.isset(className)) {
                    loadManager.removeFromStack(fileName);
                }
            })
        ;

        // Removing from load stack process all files of classes which are already loaded

        eventManager.getEvent('onProcessLoadStack')
            .addListener(function(evt, stackItems) {
                for (var i = 0; i < stackItems.length; i++) {
                    var fileName = stackItems[i].file;
                    var className = fileName.replace(/\.js$/, '');

                    if (classManager.isset(className)) {
                        loadManager.removeFromStack(fileName);
                    }
                }
            })
        ;
    }

    /**
     * Returns the instance of class manager
     *
     * @method getClassManager
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @returns {Subclass.ClassManager}
     */
    ClassLoader.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Returns the instance of load manager
     *
     * @method getLoadManager
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @returns {Subclass.LoadManager}
     */
    ClassLoader.prototype.getLoadManager = function()
    {
        return this.getClassManager()
            .getModule()
            .getLoadManager()
        ;
    };

    /**
     * Loads the class by its name
     *
     * @method loadClass
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @param className
     *      The name of class. It should be compatible with the file path where
     *      it is located relative to "rootPath" setting option of module.
     *
     * @param {Function} callback
     *      The callback function which will be invoked after the class will be loaded
     */
    ClassLoader.prototype.loadClass = function(className, callback)
    {
        var classManager = this.getClassManager();
        var loadManager = this.getLoadManager();
        var fileName = className + ".js";

        if (classManager.isset(className)) {
            return;
        }
        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        loadManager.loadFile(fileName, function() {
            if (!classManager.isset(className)) {
                Subclass.Error.create('The class "' + className + '" was not loaded.');
            }
            if (callback) {
                return callback();
            }
        });
    };

    /**
     * Tells that the class with specified name was loaded
     *
     * @method setClassLoaded
     * @memberOf Subclass.Class.ClassLoader.prototype
     *
     * @param {string} className
     *      The name of class
     */
    ClassLoader.prototype.setClassLoaded = function(className)
    {
        var loadManager = this.getLoadManager();
        var fileName = className + '.js';

        loadManager.removeFromStack(fileName);

        if (loadManager.isStackEmpty()) {
            loadManager.completeLoading();
        }
    };

    return ClassLoader;

})();

// Source file: Class/ClassBuilder.js

/**
 * @class
 * @constructor
 * @description
 *
 * The class instance of which allows create the new class definition or alter already existent class.
 * If you want alter definition of existent class you must be sure that was not created no one instance of this class.
 * Otherwise you can't save your changes.
 *
 * @throws {Error}
 *      Throws error if:
 *      - specified invalid or missed the class manager instance
 *      - specified invalid or missed the name of class type
 *
 * @param {Subclass.ClassManager} classManager
 *      The instance of class manager
 *
 * @param {string} [classType]
 *      The name of class type
 *
 * @param {string} [className]
 *      The name of class which definition you want to alter
 */
Subclass.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        if (!classManager || !(classManager instanceof Subclass.ClassManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of class manager', false)
                .received(classManager)
                .expected('an instance of class "Subclass.ClassManager"')
                .apply()
            ;
        }

        /**
         * The class manager instance
         *
         * @type {Subclass.ClassManager}
         * @private
         */
        this._classManager = classManager;

        /**
         * The instance of class definition
         *
         * @type {(Subclass.Class.ClassType|null)}
         * @private
         */
        this._class = null;

        /**
         * The name of class type
         *
         * @type {string}
         * @private
         */
        this._type = classType;

        /**
         * THe name of class
         *
         * @type {string}
         * @private
         */
        this._name = className;

        /**
         * The plain object with definition of class
         *
         * @type {Object}
         * @private
         */
        this._definition = {};

        /**
         * List of events
         *
         * @type {Array}
         * @private
         */
        this._events = [];


        // Initializing

        this
            .registerEvent("onInitialize")
            .registerEvent("onSetClass")
            .registerEvent("onPrepareBody")
            .registerEvent("onValidateBefore")
            .registerEvent("onValidateAfter")
            .registerEvent("onCreateBefore")
            .registerEvent("onCreateAfter")
            .registerEvent("onSaveBefore")
            .registerEvent("onSaveAfter")
            .registerEvent("onSaveAsBefore")
            .registerEvent("onSaveAsAfter")
        ;

        this.initialize();
    }

    ClassBuilder.$parent = Subclass.Extendable;

    ClassBuilder.$mixins = [Subclass.Event.EventableMixin];

    ClassBuilder.prototype.initialize = function()
    {
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();

        if (this.getName() && this.getClassManager().isset(this.getName())) {
            this._setClass(this.getName());
        }
    };

    /**
     * Returns the class manager instance
     *
     * @method getClassManager
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Subclass.ClassManager}
     */
    ClassBuilder.prototype.getClassManager = function()
    {
        return this._classManager;
    };

    /**
     * Sets the class instance which will be altered
     *
     * @method _setClass
     * @private
     *
     * @param {string} className
     *      The name of class
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype._setClass = function(className)
    {
        var classInst = this.getClassManager().get(className);
        var classDefinition = classInst.getDefinition().getData();

        if (classInst.wasInstanceCreated()) {
            Subclass.Error.create(
                'Can\'t alter class "' + className + '". ' +
                'The one or more instances of this class was already created ' +
                'or was created one or more instance of class for which inherits from current one.'
            );
        }
        this.setName(classInst.getName());
        this._setType(classInst.constructor.getClassTypeName());
        this._class = classInst;
        this._setDefinition(Subclass.Tools.copy(classDefinition));
        this.getEvent('onSetClass').trigger(className);

        return this;
    };

    /**
     * Sets the definition of class
     *
     * @method _setDefinition
     * @private
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of class
     *
     * @param {Object} classDefinition
     *      The plain object with definition of class
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype._setDefinition = function(classDefinition)
    {
        if (!classDefinition || !Subclass.Tools.isPlainObject(classDefinition)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of class", false)
                .received(classDefinition)
                .expected("a plain object")
                .apply()
            ;
        }
        this._definition = classDefinition;

        return this;
    };

    /**
     * Returns class definition
     *
     * @method getDefinition
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Sets the class type
     *
     * @method _setType
     * @private
     *
     * @throws {Error}
     *      Throws error if specified invalid name of class type
     *
     * @param {string} classType
     *      The name of class type
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype._setType = function(classType)
    {
        if (typeof classType !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the type of class", false)
                .received(classType)
                .expected("a string")
                .apply()
            ;
        }
        if (this._class) {
            Subclass.Error.create('Can\'t redefine class type of already registered class.');
        }
        this._type = classType;

        return this;
    };

    /**
     * Returns the name of class type
     *
     * @method getType
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {string}
     */
    ClassBuilder.prototype.getType = function()
    {
        return this._type;
    };

    /**
     * Sets the name of class
     *
     * @method setName
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if class with specified name already exists
     *
     * @param {string} className
     *      The name of class
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setName = function(className)
    {
        if (this._class) {
            Subclass.Error.create('Can\'t redefine class name of already registered class.');
        }
        this._name = className;

        return this;
    };

    /**
     * Returns the name of class
     *
     * @method getName
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {string}
     */
    ClassBuilder.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Sets the parent of class (the class which the current one will extend)
     *
     * @method setParent
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {string} parentClassName
     *      The name of parent class which the current one will extend
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setParent = function(parentClassName)
    {
        this.getDefinition().$_extends = parentClassName;

        return this;
    };

    /**
     * Returns the name of parent class
     *
     * @method getParent
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {string}
     */
    ClassBuilder.prototype.getParent = function()
    {
        return this.getDefinition().$_extends || null;
    };

    /**
     * Removes class parent
     *
     * @method removeParent
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeParent = function()
    {
        delete this.getDefinition().$_extends;

        return this;
    };

    /**
     * Sets constants of the class
     *
     * @method setConstants
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of constants
     *
     * @param {Object} constants
     *      The plain object with constants definitions.
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.buildClass("Class")
     *      .setName("Foo/Bar/TestClass")
     *      .setConstants({
     *          FOO_CONST: 10,
     *          BAR_CONST: 20
     *      })
     *      .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     * var testClassInst = TestClass.createInstance();
     * console.log(testClassInst.FOO_CONST);   // 10
     * console.log(testClassInst.BAR_CONST);   // 20
     */
    ClassBuilder.prototype.setConstants = function(constants)
    {
        if (!constants || !Subclass.Tools.isPlainObject(constants)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the constants definition", false)
                .received(constants)
                .expected("a plain object")
                .apply()
            ;
        }
        this.getDefinition().$_constants = constants;

        return this;
    };

    /**
     * Returns constants of the class
     *
     * @method getConstants
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getConstants = function()
    {
        return this.getDefinition().$_constants || {};
    };

    /**
     * Sets constant of the class
     *
     * @method setConstant
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of constant
     *
     * @param {string} constantName
     *      The name of constant
     *
     * @param {*} constantValue
     *      The value of constant
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * builder
     *      .setConstant("FOO_CONST", 10)
     *      .setConstant("BAR_CONST", 20)
     *      .save()
     * ;
     */
    ClassBuilder.prototype.setConstant = function(constantName, constantValue)
    {
        if (typeof constantName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of constant", false)
                .received(constantName)
                .expected("a string")
                .apply()
            ;
        }
        this.getDefinition().$_constants[constantName] = constantValue;

        return this;
    };

    /**
     * Removes the constant
     *
     * @method removeConstant
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of constant
     *
     * @param {string} constantName
     *      The name of constant
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeConstant = function(constantName)
    {
        if (typeof constantName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of constant", false)
                .received(constantName)
                .expected("a string")
                .apply()
            ;
        }
        delete this.getDefinition().$_constants[constantName];

        return this;
    };

    /**
     * Prepares the object with class definition (the class body)
     *
     * @method _prepareBody
     * @private
     *
     * @param {Object} classBody
     *      The object with definition of class
     *
     * @returns {*}
     */
    ClassBuilder.prototype._prepareBody = function(classBody)
    {
        if (!classBody || typeof classBody != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the class body", false)
                .received(classBody)
                .expected("a plain object")
                .apply()
            ;
        }
        for (var propName in classBody) {
            if (!classBody.hasOwnProperty(propName)) {
                continue;
            }
            if (propName.match(/^\$_/i)) {
                delete classBody[propName];
            }
        }
        this
            .getEvent('onPrepareBody')
            .trigger(classBody)
        ;
        return classBody;
    };

    /**
     * Adds new methods and properties to definition of class (the class body)
     *
     * @method addBody
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Object} classBody
     *      The plain object with definitions of properties and methods of the class
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.registerClass("Foo/Bar/TestClass", {
     *     _bar: 0,
     *
     *     $_constructor: function(bar) {
     *          this._bar = bar;
     *     }
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *     .addBody({
     *
     *         _foo: 10,
     *
     *         setFoo: function(foo) {
     *             this._foo = foo;
     *         },
     *
     *         getFoo: function() {
     *             return this._foo;
     *         }
     *     })
     *     .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     * var testClassDefinition = TestClass.getDefinition().getData();
     * console.log(testClassDefinition);
     *
     * // {
     * //   ...
     * //   _bar: 0,
     * //   _foo: 10,
     * //   $_constructor: function(bar) { ... },
     * //   setFoo: function(foo) { ... },
     * //   getFoo: function() { ... },
     * //   ...
     * // }
     */
    ClassBuilder.prototype.addBody = function(classBody)
    {
        classBody = this._prepareBody(classBody);

        var classDefinition = this.getDefinition();
        Subclass.Tools.extend(classDefinition, classBody);

        return this;
    };

    /**
     * Sets properties and methods of the class.<br /><br />
     *
     * Defines the class body except special properties which names start from "$_" symbols.
     * The such properties will be omitted.
     *
     * If you alter someone class then the call of this method removes all methods and properties
     * from the class body which not start from "$_" symbols and will be replaced by the new ones
     * from the object which is specified in current method as argument.
     *
     * @param {Object} classBody
     *      The plain object with definitions of properties and methods of the class
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     *
     * app.buildClass("Class")
     *      .setName("Foo/Bar/TestClass")
     *      .setBody({
     *
     *          _bar: 0,
     *
     *          _foo: 10,
     *
     *          $_constructor: function(bar) {
     *              this._bar = bar;
     *          },
     *
     *          setFoo: function(foo) {
     *              this._foo = foo;
     *          },
     *
     *          getFoo: function() {
     *              return this._foo;
     *          }
     *      })
     *      .save()
     * ;
     */
    ClassBuilder.prototype.setBody = function(classBody)
    {
        classBody = this._prepareBody(classBody);

        var classDefinition = this.getDefinition();

        for (var propName in classDefinition) {
            if (!classDefinition.hasOwnProperty(propName)) {
                continue;
            }
            if (!propName.match(/^$_/)) {
                delete classDefinition[propName];
            }
        }
        Subclass.Tools.extend(classDefinition, classBody);

        return this;
    };

    /**
     * Sets constructor function of the class
     *
     * @method setConstructor
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Function} constructorFunction
     *      The function which will be invoked every time the instance of class will be created
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.buildClass("Class")
     *      .setName("Foo/Bar/TestClass")
     *      .setConstructor(function(bar) {
     *          this._bar = bar;
     *      })
     *      .setBody({
     *          _bar: 0
     *      })
     *      .save()
     * ;
     */
    ClassBuilder.prototype.setConstructor = function(constructorFunction)
    {
        this.getDefinition().$_constructor = constructorFunction;

        return this;
    };

    /**
     * Returns constructor function of the class
     *
     * @method getConstructor
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {(Function|null)}
     */
    ClassBuilder.prototype.getConstructor = function()
    {
        return this.getDefinition().$_constructor || null;
    };

    /**
     * Removes class constructor function
     *
     * @method removeConstructor
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeConstructor = function()
    {
        var classDefinition = this.getDefinition();

        delete classDefinition.$_constructor;

        return this;
    };

    /**
     * Validates the result class definition object
     *
     * @method _validate
     * @private
     *
     * @throws {Error}
     *      Throws error if:
     *      - The name of class was missed
     *      - The type of class was missed
     *
     * @returns {Subclass.Class.ClassBuilder}
     */
    ClassBuilder.prototype._validate = function()
    {
        this.getEvent('onValidateBefore').trigger();

        if (!this.getType()) {
            Subclass.Error.create('The type of the future class must be specified.');
        }
        this.getEvent('onValidateAfter').trigger();

        return this;
    };

    /**
     * Creates class type instance without its registration,
     * i.e. creates anonymous class
     *
     * @method create
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassBuilder.prototype.create = function()
    {
        this._validate();
        this.getEvent('onCreateBefore').trigger();

        if (this._class) {
            this._class.setDefinition(this.getDefinition());
            return this._class;
        }

        var classTypeConstructor = Subclass.ClassManager.getType(this.getType());
        var classTypeInstance = this.getClassManager().create(
            classTypeConstructor,
            this.getName() || ('AnonymousClass_' + String(Math.round(Math.random() * (new Date).valueOf() / 100000))),
            this.getDefinition()
        );
        this.getEvent('onCreateAfter').trigger(classTypeInstance);

        return classTypeInstance;
    };

    /**
     * Saves class definition changes and registers class
     * if the current one with the same name does not exist
     *
     * @method save
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassBuilder.prototype.save = function()
    {
        if (!this.getName()) {
            Subclass.Error.create('The future class must be named.');
        }
        this._validate();
        this.getEvent('onSaveBefore').trigger();

        if (this._class) {
            this._class.setDefinition(this.getDefinition());
            return this._class;
        }
        var classTypeInst = this.getClassManager().add(
            this.getType(),
            this.getName(),
            this.getDefinition()
        );
        classTypeInst.getConstructor();
        this.getEvent('onSaveAfter').trigger(classTypeInst);

        return classTypeInst;
    };

    /**
     * Allows to create copy of class with definition of current class builder
     *
     * @param {string} className
     *      The name of new class
     *
     * @returns {Subclass.Class.ClassType}
     */
    ClassBuilder.prototype.saveAs = function(className)
    {
        if (!this.getName()) {
            Subclass.Error.create('The future class must be named.');
        }
        this._validate();
        this.getEvent('onSaveAsBefore').trigger();

        var classInst = this.getClassManager().add(
            this.getType(),
            className,
            this.getDefinition()
        );
        classInst.getConstructor();
        this.getEvent('onSaveAsAfter').trigger(classInst);

        return classInst;
    };

    return ClassBuilder;
})();

// Source file: Class/ClassExtension.js

Subclass.Class.ClassExtension = function()
{
    function ClassExtension()
    {
        ClassExtension.$parent.call(this);
    }

    ClassExtension.$parent = Subclass.Extension;

    ClassExtension.$config = {
        /**
         * Array of names of class types which current extension will applies to
         *
         * @type {Array.<string>}
         */
        classes: []
    };

    return ClassExtension;
}();

// Source file: Class/Type/Class/Class.js

/**
 * @namespace
 */
Subclass.Class.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Class.Class = (function() {

    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Class(classManager, className, classDefinition)
    {
        Class.$parent.apply(this, arguments);

        /**
         * List of abstract methods (functions with needed arguments)
         *
         * @type {(Object|null)}
         * @private
         */
        this._abstractMethods = {};

        /**
         * Names of class static properties
         *
         * @type {Array}
         * @private
         */
        this._static = [];

        /**
         * The context object for static methods
         *
         * @type {Object}
         * @private
         */
        this._staticContext = null;
    }

    Class.$parent = Subclass.Class.ClassType;

    /**
     * @inheritDoc
     */
    Class.getClassTypeName = function ()
    {
        return "Class";
    };

    /**
     * @inheritDoc
     */
    Class.getBuilderClass = function()
    {
        return Subclass.Class.Type.Class.ClassBuilder;
    };

    /**
     * @inheritDoc
     */
    Class.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Class.ClassDefinition;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.getConstructorEmpty = function ()
    {
        return function Class() {

            // Hook for the grunt-contrib-uglify plugin
            return Class.name;
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Class.prototype.createConstructor = function ()
    {
        var classConstructor = Class.$parent.prototype.createConstructor.call(this);
        var abstractMethods = this._abstractMethods = this.getAbstractMethods();
        var notImplementedMethods = [];

        if (this.hasParent()) {
            var parent = this.getParent();

            // Adding parent abstract methods

            if (parent.getAbstractMethods) {
                this.extendAbstractMethods(parent);
            }

            // Adding parent static properties

            if (parent.getStaticProperties) {
                this.extendStaticProperties(parent);
            }
        }

        // Checking for not implemented methods

        if (this.constructor != Subclass.Class.Type.AbstractClass.AbstractClass) {
            for (var abstractMethodName in abstractMethods) {
                if (!abstractMethods.hasOwnProperty(abstractMethodName)) {
                    continue;
                }
                if (
                    !classConstructor.prototype[abstractMethodName]
                    || typeof classConstructor.prototype[abstractMethodName] != 'function'
                ) {
                    notImplementedMethods.push(abstractMethodName);
                }
            }
            if (notImplementedMethods.length) {
                Subclass.Error.create(
                    'The class "' + this.getName() + '" must be an abstract or implement abstract methods: ' +
                    '"' + notImplementedMethods.join('", "') + '".'
                );
            }
        }

        return classConstructor;
    };

    /**
     * @inheritDoc
     */
    Class.prototype.setParent = function (parentClassName)
    {
        Class.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Class
            && this._parent.constructor != Subclass.ClassManager.getType('AbstractClass')
        ) {
            Subclass.Error.create(
                'The class "' + this.getName() + '" can be inherited ' +
                'only from another class or abstract class.'
            );
        }
        if (
            this._parent
            && this._parent.constructor == Class
            && this._parent.getDefinition().isFinal()
        ) {
            Subclass.Error.create(
                'The class "' + this.getName() + '" can\'t extend the final class ' +
                '"' + this._parent.getName() + '"'
            );
        }
    };

    /**
     * Returns class static properties and methods
     *
     * @returns {Object}
     */
    Class.prototype.getStaticContext = function()
    {
        var $this = this;

        if (!this._staticContext) {
            this._staticContext = {

                /**
                 * Returns current class declaration instance
                 *
                 * @returns {Subclass.Class.ClassType}
                 */
                getClass: function()
                {
                    return $this;
                },

                /**
                 * Returns parent of current class
                 *
                 * @returns {(Subclass.Class.ClassType|null)}
                 */
                getParent: function()
                {
                    return $this.getParent();
                }
            }
        }
        return this._staticContext;
    };

    /**
     * Adds static properties
     *
     * @throws {Error}
     *      Throws error if specified invalid static properties definition
     *
     * @param {Object} properties
     */
    Class.prototype.addStaticProperties = function(properties)
    {
        if (!properties || !Subclass.Tools.isPlainObject(properties)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the static properties definition', false)
                .expected('a plain object')
                .received(properties)
                .apply()
            ;
        }
        for (var propName in properties) {
            if (properties.hasOwnProperty(propName)) {
                this.addStaticProperty(propName, properties[propName]);
            }
        }
    };

    /**
     * Adds the new static property.<br />
     *
     * If the static property value was specified as a function then it will contain
     * specific static context object with all earlier defined static properties and methods.<br />
     *
     * If you'll want call static method with another context, you should use the "origin" property of it.
     * For example, instead of using expression myClass.staticMethod.call(obj) you should use this:
     * myClass.staticMethod.<b>origin</b>.call(obj).
     *
     * @thorws {Error}
     *      Throws error if specified invalid static property name
     *
     * @param {string} propertyName
     *      The name of static property
     *
     * @param {*} propertyValue
     *      The value of static property
     */
    Class.prototype.addStaticProperty = function(propertyName, propertyValue)
    {
        if (!propertyName || typeof propertyName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of static property', false)
                .expected('a string')
                .received(propertyName)
                .apply()
            ;
        }
        var staticContext = this.getStaticContext();
            staticContext[propertyName] = propertyValue;

        this._static.push(propertyName);

        if (typeof propertyValue == 'function') {
            this[propertyName] = function() {
                return staticContext[propertyName].apply(staticContext, arguments);
            };
            this[propertyName].origin = propertyValue;

        } else {
            Object.defineProperty(this, propertyName, {
                configurable: true,
                enumerable: true,
                set: function(value) {
                    staticContext[propertyName] = value;
                },
                get: function() {
                    return staticContext[propertyName];
                }
            });
        }
    };

    /**
     * Extends static properties from parent to current class
     *
     * @param {Subclass.Class.Type.Class.Class} parentClass
     *      The parent class declaration instance
     */
    Class.prototype.extendStaticProperties = function(parentClass)
    {
        var ownStaticPropertyNames = Subclass.Tools.copy(this.getStaticPropertyNames());
        var ownStaticContext = Subclass.Tools.copy(this.getStaticContext());
        var parentStaticContext = parentClass.getStaticContext();
        var parentStaticPropertyNames = parentClass.getStaticPropertyNames();
        var propName, propValue;

        for (var i = 0; i < parentStaticPropertyNames.length; i++) {
            propName = parentStaticPropertyNames[i];
            propValue = parentStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
        for (i = 0; i < ownStaticPropertyNames.length; i++) {
            propName = ownStaticPropertyNames[i];
            propValue = ownStaticContext[propName];

            this.addStaticProperty(propName, propValue);
        }
    };

    /**
     * Returns all defined static class properties
     *
     * @returns {Object}
     */
    Class.prototype.getStaticProperties = function()
    {
        var staticPropertyNames = this._static;
        var staticProperties = {};

        for (var i = 0; i < staticPropertyNames.length; i++) {
            staticProperties[staticPropertyNames[i]] = this[staticPropertyNames];
        }
    };

    /**
     * Returns array with names of static class properties
     *
     * @returns {Array}
     */
    Class.prototype.getStaticPropertyNames = function()
    {
        return this._static;
    };

    /**
     * Returns all abstract methods
     *
     * @returns {Array}
     */
    Class.prototype.getAbstractMethods = function ()
    {
        return this._abstractMethods;
    };

    /**
     * Adds new abstract methods to be implemented
     *
     * @param methods
     */
    Class.prototype.addAbstractMethods = function(methods)
    {
        Subclass.Tools.extend(this._abstractMethods, methods);
    };

    Class.prototype.extendAbstractMethods = function(parentClass)
    {
        Subclass.Tools.extend(
            this.getAbstractMethods(),
            parentClass.getAbstractMethods()
        );
    };

    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerType(Class);

    return Class;

})();

// Source file: Class/Type/Class/ClassBuilder.js

/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Class.ClassBuilder = (function()
{
    function ClassBuilder(classManager, classType, className)
    {
        ClassBuilder.$parent.call(this, classManager, classType, className);
    }

    ClassBuilder.$parent = Subclass.Class.ClassBuilder;

    /**
     * Makes class either final or not
     *
     * @method setFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of final option
     *
     * @param {boolean} isFinal
     */
    ClassBuilder.prototype.setFinal = function(isFinal)
    {
        if (typeof isFinal != 'boolean') {
            Subclass.Error.create('InvalidArgument')
                .argument('is final option value', false)
                .expected('a boolean')
                .received(isFinal)
                .apply()
            ;
        }
        this.getDefinition().$_final = isFinal;

        return this;
    };

    /**
     * Returns $_final option value
     *
     * @method getFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {boolean}
     */
    ClassBuilder.prototype.getFinal = function()
    {
        return this.getDefinition().$_final;
    };

    /**
     * Sets static properties and methods of the class
     *
     * @method setStaticProperties
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of static properties
     *
     * @param {Object} staticProperties
     *      The plain object with definitions of static properties.
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.buildClass("Class")
     *     .setName("Foo/Bar/TestClass")
     *     .setStatic({
     *         staticProp: "static value",
     *         staticMethod: function() {
     *             alert(this.staticProp);
     *         }
     *     })
     *     .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     * var staticProp = TestClass.staticProp;  // "static value"
     * TestClass.staticMethod();               // alerts "static value"
     */
    ClassBuilder.prototype.setStaticProperties = function(staticProperties)
    {
        if (!staticProperties || !Subclass.Tools.isPlainObject(staticProperties)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the static properties", false)
                .received(staticProperties)
                .expected("a plain object")
                .apply()
            ;
        }
        this.getDefinition().$_static = staticProperties;

        return this;
    };

    /**
     * Returns static properties and methods of the class
     *
     * @method getStaticProperties
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {Object}
     */
    ClassBuilder.prototype.getStaticProperties = function()
    {
        return this.getDefinition().$_static || {};
    };

    /**
     * Sets static property or method of the class
     *
     * @method setStaticProperty
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of static property or method
     *
     * @param {string} staticPropertyName
     *      The name of static property or method
     *
     * @param {*} staticPropertyValue
     *      The value of static property or method
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * // Defining few static properties
     * builder
     *     .setStaticProperty("foo", "foo value")
     *     .setStaticProperty("bar", 100)
     * ;
     */
    ClassBuilder.prototype.setStaticProperty = function(staticPropertyName, staticPropertyValue)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of static property", false)
                .received(staticPropertyName)
                .expected("a string")
                .apply()
            ;
        }
        this.getDefinition().$_static[staticPropertyName] = staticPropertyValue;

        return this;
    };

    /**
     * Removes the static property or method
     *
     * @method removeStaticProperty
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified not allowed name of static property or name
     *
     * @param {string} staticPropertyName
     *      The name of static property or method
     *
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.removeStaticProperty = function(staticPropertyName)
    {
        if (typeof staticPropertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of static property", false)
                .received(staticPropertyName)
                .expected("a string")
                .apply()
            ;
        }
        delete this.getDefinition().$_static[staticPropertyName];
        return this;
    };

    return ClassBuilder;
})();

// Source file: Class/Type/Class/ClassDefinition.js

/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Class.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Validates "$_final" option value
     *
     * @param {*} isFinal
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateFinal = function(isFinal)
    {
        if (typeof isFinal != 'boolean') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_final')
                .received(isFinal)
                .className(this.getClass().getName())
                .expected('a boolean')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_final" option value
     *
     * @param {boolean} isFinal
     */
    ClassDefinition.prototype.setFinal = function(isFinal)
    {
        this.validateFinal(isFinal);
        this.getData().$_final = isFinal;
    };

    /**
     * Returns "$_final" option value
     *
     * @returns {boolean}
     */
    ClassDefinition.prototype.getFinal = function()
    {
        return this.getData().$_final;
    };

    /**
     * @alias {Subclass.Class.Type.Class.ClassDefinition.prototype#getFinal}
     *
     * @returns {boolean}
     */
    ClassDefinition.prototype.isFinal = function()
    {
        return this.getFinal();
    };

    /**
     * Validates "$_static" attribute value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateStatic = function(value)
    {
        if (value !== null && !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidClassOption')
                .option('$_static')
                .className(this.getClass().getName())
                .received(value)
                .expected('a plain object or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_static" attribute value
     *
     * @param {Object} value Plain object with different properties and methods
     */
    ClassDefinition.prototype.setStatic = function(value)
    {
        this.validateStatic(value);
        this.getData().$_static = value || {};

        if (value) {
            this.getClass().addStaticProperties(value);
        }
    };

    /**
     * Returns "$_static" attribute value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getStatic = function()
    {
        return this.getData().$_static;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.createBaseData = function ()
    {
        var classDefinition = ClassDefinition.$parent.prototype.createBaseData();

        /**
         * Makes class final. It means that it can't be parent for any another class
         *
         * @type {boolean}
         */
        classDefinition.$_final = false;

        /**
         * Static properties and methods for current class constructor
         *
         * @type {Object}
         */
        classDefinition.$_static = {};

        return classDefinition;
    };

    return ClassDefinition;
})();

// Source file: Class/Type/AbstractClass/AbstractClass.js

/**
 * @namespace
 */
Subclass.Class.Type.AbstractClass = {};

/**
 * @namespace
 */
Subclass.Class.Type.AbstractClass.Extension = {};

/**
 * @class
 * @extends {Subclass.Class.Type.Class.Class}
 */
Subclass.Class.Type.AbstractClass.AbstractClass = (function() {

    /*************************************************/
    /*     Describing class type "AbstractClass"     */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {Class}
     * @constructor
     */
    function AbstractClass(classManager, className, classDefinition)
    {
        AbstractClass.$parent.call(this, classManager, className, classDefinition);
    }

    /**
     * @type {Subclass.Class.Type.Class.Class}
     */
    AbstractClass.$parent = Subclass.Class.Type.Class.Class;

    /**
     * @inheritDoc
     */
    AbstractClass.getClassTypeName = function ()
    {
        return "AbstractClass";
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getBuilderClass = function()
    {
        return Subclass.Class.Type.AbstractClass.AbstractClassBuilder;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.getDefinitionClass = function()
    {
        return Subclass.Class.Type.AbstractClass.AbstractClassDefinition;
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.setParent = function (parentClassName)
    {
        Subclass.Class.ClassType.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != AbstractClass
            && !(this._parent instanceof AbstractClass)
        ) {
            Subclass.Error.create(
                'The abstract class "' + this.getName() + '" can be ' +
                'inherited only from the another abstract class.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    AbstractClass.prototype.getConstructorEmpty = function ()
    {
        return function AbstractClass(){

            // Hook for the grunt-contrib-uglify plugin
            return AbstractClass.name;
        };
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    AbstractClass.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerType(AbstractClass);

    return AbstractClass;

})();

// Source file: Class/Type/AbstractClass/AbstractClassBuilder.js

/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.AbstractClass.AbstractClassBuilder = (function()
{
    function AbstractClassBuilder(classManager, classType, className)
    {
        AbstractClassBuilder.$parent.call(this, classManager, classType, className);
    }

    AbstractClassBuilder.$parent = Subclass.Class.Type.Class.ClassBuilder;

    AbstractClassBuilder.prototype.setFinal = undefined;

    AbstractClassBuilder.prototype.getFinal = undefined;

    /**
     * Validates abstract methods argument
     *
     * @param {Object.<Function>} abstractMethods
     * @private
     */
    AbstractClassBuilder.prototype._validateAbstractMethods = function(abstractMethods)
    {
        if (!Subclass.Tools.isPlainObject(abstractMethods)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of abstract methods", false)
                .received(abstractMethods)
                .expected("a plain object with functions")
                .apply()
            ;
        }
        for (var methodName in abstractMethods) {
            if (abstractMethods.hasOwnProperty(methodName)) {
                this._validateAbstractMethod(abstractMethods[methodName]);
            }
        }
    };

    /**
     * Validates abstract method
     *
     * @param abstractMethod
     * @private
     */
    AbstractClassBuilder.prototype._validateAbstractMethod = function(abstractMethod)
    {
        if (typeof abstractMethod != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of abstract method', false)
                .received(abstractMethod)
                .expected('a function')
                .apply()
            ;
        }
    };

    /**
     * Sets abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.setAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);
        this.getDefinition().$_abstract = abstractMethods;

        return this;
    };

    /**
     * Adds new abstract methods
     *
     * @param {Object.<Function>} abstractMethods
     * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.addAbstractMethods = function(abstractMethods)
    {
        this._validateAbstractMethods(abstractMethods);

        if (!this.getDefinition().$_abstract) {
            this.getDefinition().$_abstract = {};
        }
        Subclass.Tools.extend(
            this.getDefinition().$_abstract,
            abstractMethods
        );

        return this;
    };

    /**
     * Adds new abstract method
     *
     * @param {string} methodName
     * @param {Function} methodFunction
     * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.addAbstractMethod = function(methodName, methodFunction)
    {
        this._validateAbstractMethod(methodFunction);

        if (!methodName || typeof methodName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of abstract method', false)
                .received(methodName)
                .expected('a string')
                .apply()
            ;
        }
        if (!this.getDefinition().$_abstract) {
            this.getDefinition().$_abstract = {};
        }
        this.getDefinition().$_abstract[methodName] = methodFunction;

        return this;
    };


    /**
     * Returns abstract methods
     *
     * @returns {Object.<Function>}
     */
    AbstractClassBuilder.prototype.getAbstractMethods = function()
    {
        return this.getDefinition().$_abstract || {};
    };

    /**
     * Removes abstract method with specified method name
     *
     * @param {string} abstractMethodName
     * @returns {Subclass.Class.Type.AbstractClass.AbstractClassBuilder}
     */
    AbstractClassBuilder.prototype.removeAbstractMethod = function(abstractMethodName)
    {
        var abstractMethods = this.getAbstractMethods();

        delete abstractMethods[abstractMethodName];

        return this;
    };

    return AbstractClassBuilder;
})();

// Source file: Class/Type/AbstractClass/AbstractClassDefinition.js

/**
 * @class
 * @extends {Subclass.Class.Type.Class.ClassDefinition}
 */
Subclass.Class.Type.AbstractClass.AbstractClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function AbstractClassDefinition(classInst, classDefinition)
    {
        AbstractClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    AbstractClassDefinition.$parent = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * @inheritDoc
     */
    AbstractClassDefinition.prototype.validateFinal = function(isFinal)
    {
        Subclass.Error.create(
            'Abstract class definition cannot contain $_final option ' +
            'and consequently can\'t be final.'
        )
    };

    /**
     * Validates "$_abstract" attribute value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    AbstractClassDefinition.prototype.validateAbstract = function(value)
    {
        try {
            if (value !== null && !Subclass.Tools.isPlainObject(value)) {
                throw 'error';
            }
            if (value) {
                for (var methodName in value) {
                    if (!value.hasOwnProperty(methodName)) {
                        continue;
                    }
                    if (typeof value[methodName] != 'function') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_abstract')
                    .className(this.getClass().getName())
                    .expected('a plain object with methods or a null')
                    .received(value)
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_abstract" attribute value
     *
     * @param {Object} value
     *      The plain object with different properties and methods
     */
    AbstractClassDefinition.prototype.setAbstract = function(value)
    {
        this.validateAbstract(value);
        this.getData().$_abstract = value || {};

        if (value) {
            this.getClass().addAbstractMethods(value);
        }
    };

    /**
     * Returns "$_abstract" attribute value
     *
     * @returns {Object}
     */
    AbstractClassDefinition.prototype.getAbstract = function()
    {
        return this.getData().$_abstract;
    };

    /**
     * @inheritDoc
     */
    AbstractClassDefinition.prototype.createBaseData = function ()
    {
        return {

            /**
             * Required classes
             *
             * @type {(string[]|Object.<string>|null)}
             */
            $_requires: null,

            /**
             * Parent class name
             *
             * @type {string}
             */
            $_extends: null,

            /**
             * Constants list
             *
             * @type {Object}
             */
            $_constants: null,

            /**
             * Object that contains abstract methods
             *
             * @type {Object}
             */
            $_abstract: {}
        }
    };

    return AbstractClassDefinition;

})();

// Source file: Class/Type/AbstractClass/Extension/ClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.AbstractClass.Extension.ClassDefinitionExtension = function()
{
    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var interfaceClassDefinitionExtension = Subclass.Class.Type.Interface.Extension.ClassDefinitionExtension;
            interfaceClassDefinitionExtension = Subclass.Tools.buildClassConstructor(interfaceClassDefinitionExtension);
            interfaceClassDefinitionExtension.getConfig().classes.push('AbstractClass');
        }
        if (Subclass.ClassManager.issetType('Trait')) {
            var traitClassDefinitionExtension = Subclass.Class.Type.Trait.Extension.ClassDefinitionExtension;
            traitClassDefinitionExtension = Subclass.Tools.buildClassConstructor(traitClassDefinitionExtension);
            traitClassDefinitionExtension.getConfig().classes.push('AbstractClass');
        }
    });

    return ClassDefinitionExtension;
}();

// Source file: Class/Type/AbstractClass/Extension/ClassExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.AbstractClass.Extension.ClassExtension = function()
{
    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var interfaceClassExtension = Subclass.Class.Type.Interface.Extension.ClassExtension;
            interfaceClassExtension = Subclass.Tools.buildClassConstructor(interfaceClassExtension);
            interfaceClassExtension.getConfig().classes.push('AbstractClass');
        }
        if (Subclass.ClassManager.issetType('Trait')) {
            var traitClassExtension = Subclass.Class.Type.Trait.Extension.ClassExtension;
            traitClassExtension = Subclass.Tools.buildClassConstructor(traitClassExtension);
            traitClassExtension.getConfig().classes.push('AbstractClass');
        }
    });

    return ClassExtension;
}();

// Source file: Class/Type/Interface/Interface.js

/**
 * @namespace
 */
Subclass.Class.Type.Interface = {};

/**
 * @namespace
 */
Subclass.Class.Type.Interface.Extension = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Interface.Interface = (function()
{
    /*************************************************/
    /*       Describing class type "Interface"       */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Interface(classManager, className, classDefinition)
    {
        Interface.$parent.call(this, classManager, className, classDefinition);
    }

    Interface.$parent = Subclass.Class.ClassType;

    /**
     * @inheritDoc
     */
    Interface.getClassTypeName = function ()
    {
        return "Interface";
    };

    /**
     * @inheritDoc
     */
    Interface.getBuilderClass = function()
    {
        return Subclass.Class.Type.Interface.InterfaceBuilder;
    };

    /**
     * @inheritDoc
     */
    Interface.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Interface.InterfaceDefinition;
    };

    /**
     * @inheritDoc
     */
    Interface.prototype.setParent = function (parentClassName)
    {
        Interface.$parent.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Interface
            && !(this._parent instanceof Interface)
        ) {
            Subclass.Error.create(
                'Interface "' + this.getName() + '" can be inherited ' +
                'only from the another interface.'
            );
        }
    };
    //
    //Interface.prototype.getClassDefinitionProperties = function()
    //{
    //    var classDefinition = this.getDefinition();
    //    var classProperties = {};
    //
    //    if (this.hasParent()) {
    //        classProperties = this.getParent().getClassDefinitionProperties();
    //    }
    //    return Subclass.Tools.extend(
    //        classProperties,
    //        classDefinition.getProperties()
    //    );
    //};

    /**
     * @inheritDoc
     */
    Interface.prototype.getConstructorEmpty = function ()
    {
        return function Interface(){

            // Hook for the grunt-contrib-uglify plugin
            return Interface.name;
        };
    };
    //
    ///**
    // * @inheritDoc
    // */
    //Interface.prototype.attachProperties = function() {};

    /**
     * @inheritDoc
     * @throws {Error}
     */
    Interface.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerType(Interface);

    return Interface;

})();

// Source file: Class/Type/Interface/Extension/ClassBuilderExtension.js

/**
 * @class
 * @constructor
 * @extends {Subclass.Extension}
 */
Subclass.Class.Type.Interface.Extension.ClassBuilderExtension = function() {

    function ClassBuilderExtension(classInst)
    {
        ClassBuilderExtension.$parent.apply(this, arguments);
    }

    ClassBuilderExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassBuilder = Subclass.Class.Type.Class.ClassBuilder;

    /**
     * Validates list of interfaces
     *
     * @param {string} interfacesList
     * @private
     */
    ClassBuilder.prototype._validateInterfaces = function(interfacesList)
    {
        if (!Array.isArray(interfacesList)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of interface names", false)
                .received(interfacesList)
                .expected("an array of strings")
                .apply()
            ;
        }
        for (var i = 0; i < interfacesList.length; i++) {
            this._validateInterface(interfacesList[i]);
        }
    };

    /**
     * Validates interface name
     *
     * @param interfaceName
     * @private
     */
    ClassBuilder.prototype._validateInterface = function(interfaceName)
    {
        if (typeof interfaceName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the interface name", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
    };

    /**
     * Sets interfaces list
     *
     * @param {string[]} interfacesList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setInterfaces = function(interfacesList)
    {
        this._validateInterfaces(interfacesList);
        this.getDefinition().$_implements = interfacesList;

        return this;
    };

    /**
     * Adds new interfaces
     *
     * @param {string} interfacesList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addInterfaces = function(interfacesList)
    {
        this._validateInterfaces(interfacesList);

        if (!this.getDefinition().$_implements) {
            this.getDefinition().$_implements = [];
        }
        this.getDefinition().$_implements = this.getDefinition().$_implements.concat(interfacesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} interfaceName
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addInterface = function(interfaceName)
    {
        this._validateInclude(interfaceName);

        if (!this.getDefinition().$_implements) {
            this.getDefinition().$_implements = [];
        }
        this.getDefinition().$_implements.push(interfaceName);

        return this;
    };

    /**
     * Returns interfaces list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getInterfaces = function()
    {
        return this.getDefinition().$_implements || [];
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();

// Source file: Class/Type/Interface/Extension/ClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Interface.Extension.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Class.ClassExtension;

    ClassDefinitionExtension.$config = {
        classes: ["Class"]
    };

    ClassDefinitionExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getClass().getType()) < 0) {
            return false;
        }
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * Array of interfaces names
             *
             * @type {string[]}
             */
            data.$_implements = [];

            /**
             * Checks if current class implements specified interface
             *
             * @param {string} interfaceName
             * @returns {boolean}
             */
            data.isImplements = function (interfaceName)
            {
                return this.$_class.isImplements(interfaceName);
            };
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var interfaces = this.getImplements();

            if (interfaces && this.validateImplements(interfaces)) {
                for (var i = 0; i < interfaces.length; i++) {
                    classManager.load(interfaces[i]);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * Validates "$_implements" attribute value
     *
     * @param {*} interfaces
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateImplements = function(interfaces)
    {
        try {
            if (interfaces && !Array.isArray(interfaces)) {
                throw 'error';
            }
            if (interfaces) {
                for (var i = 0; i < interfaces.length; i++) {
                    if (typeof interfaces[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_implements')
                    .className(this.getClass().getName())
                    .received(interfaces)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_implements" attribute value
     *
     * @param {string[]} interfaces
     *
     *      List of the interfaces witch current one will implement.
     *
     *      Example: [
     *         "Namespace/Of/Interface1",
     *         "Namespace/Of/Interface2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setImplements = function(interfaces)
    {
        this.validateImplements(interfaces);
        this.getData().$_implements = interfaces || [];

        if (interfaces) {
            this.getClass().addInterfaces(interfaces);
        }
    };

    /**
     * Return "$_implements" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getImplements = function()
    {
        return this.getData().$_implements;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();

// Source file: Class/Type/Interface/Extension/ClassExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Interface.Extension.ClassExtension = function() {

    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Class.ClassExtension;

    ClassExtension.$config = {
        classes: ["Class"]
    };

    ClassExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getType()) < 0) {
            return false;
        }
        ClassExtension.$parent.initialize.apply(this, arguments);

        // Defining interfaces storage

        classInst.getEvent('onInitialize').addListener(function(evt)
        {
            /**
             * List of interfaces class names
             *
             * @type {Array<Subclass.Class.Type.Interface.Interface>}
             * @private
             */
            this._interfaces = [];
        });

        // Added ability to return interfaces in class parents list

        classInst.getEvent('onGetClassParents').addListener(function(evt, classes, grouping)
        {
            var interfaces = this.getInterfaces(true);

            function addClassName(classes, className)
            {
                if (classes.indexOf(className) < 0) {
                    classes.push(className);
                }
            }
            for (var i = 0; i < interfaces.length; i++) {
                var classInst = interfaces[i];
                var className = classInst.getName();

                if (grouping) {
                    var classType = classInst.getType();

                    if (!classes.hasOwnProperty(classType)) {
                        classes[classType] = [];
                    }
                    addClassName(classes[classType], className);

                } else {
                    addClassName(classes, className);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var Class = Subclass.Class.Type.Class.Class;

    /**
     * Adds interfaces
     *
     * @param {Object} interfaces
     */
    Class.prototype.addInterfaces = function(interfaces)
    {
        if (!interfaces || !Array.isArray(interfaces)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the traits list', false)
                .expected('an array')
                .received(interfaces)
                .apply()
            ;
        }
        for (var i = 0; i < interfaces.length; i++) {
            this.addInterface(interfaces[i]);
        }
    };

    /**
     * Adds new interface
     *
     * @param {string} interfaceName
     * @throws {Error}
     */
    Class.prototype.addInterface = function (interfaceName)
    {
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        var interfaceClass = this.getClassManager().get(interfaceName);
        interfaceClass.addChildClass(this.getName());

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Can\'t implement no interface "' + interfaceName + '" ' +
                'in class "' + this.getName() + '".'
            );
        }

        var interfaceClassConstructor = interfaceClass.getConstructor();
        var interfaceClassConstructorProto = interfaceClassConstructor.prototype;
        var abstractMethods = {};

        if (interfaceClass.constructor != Subclass.Class.Type.Interface.Interface) {
            Subclass.Error.create(
                'Trying add to "$_implements" option ' +
                'the new class "' + interfaceName + '" that is not an interface.'
            );
        }

        // Add all interface prototype properties (with inherited)

        loop: for (var methodName in interfaceClassConstructorProto) {
            if (typeof interfaceClassConstructorProto[methodName] != 'function') {
                continue;
            }
            abstractMethods[methodName] = interfaceClassConstructorProto[methodName];
        }
        this.addAbstractMethods(abstractMethods);
        this.getInterfaces().push(interfaceClass);
    };

    /**
     * Returns interface names list
     *
     * @throws {Error}
     *
     * @param {boolean} [withInherited=false]
     *      Whether the inherited interfaces should be returned
     *
     * @returns {Array<Subclass.Class.Interface.Interface>}
     */
    Class.prototype.getInterfaces = function(withInherited)
    {
        if (withInherited !== true) {
            return this._interfaces;
        }
        var classManager = this.getClassManager();
        var interfaces = Subclass.Tools.copy(this._interfaces);

        for (var i = 0; i < interfaces.length; i++) {
            var interfaceParents = interfaces[i].getClassParents();

            for (var j = 0; j < interfaceParents.length; j++) {
                interfaces.push(classManager.get(interfaceParents[j]));
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.getInterfaces) {
                interfaces = interfaces.concat(parent.getInterfaces(withInherited))
            }
        }
        return interfaces;
    };

    /**
     * Checks if current class implements specified interface
     *
     * @param interfaceName
     * @returns {*}
     * @throws {Error}
     */
    Class.prototype.isImplements = function (interfaceName)
    {
        if (!interfaceName || typeof interfaceName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of interface", false)
                .received(interfaceName)
                .expected("a string")
                .apply()
            ;
        }
        var interfaces = this.getInterfaces();

        for (var i = 0; i < interfaces.length; i++) {
            if (interfaces[i].isInstanceOf(interfaceName)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.isImplements) {
                return parent.isImplements(interfaceName);
            }
        }
        return false;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        Class = Subclass.Tools.buildClassConstructor(Class);

        if (!Class.hasExtension(ClassExtension)) {
            Class.registerExtension(ClassExtension);
        }
    });

    return ClassExtension;
}();

// Source file: Class/Type/Interface/InterfaceBuilder.js

/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Interface.InterfaceBuilder = (function()
{
    function InterfaceBuilder(classManager, classType, className)
    {
        InterfaceBuilder.$parent.call(this, classManager, classType, className);
    }

    InterfaceBuilder.$parent = Subclass.Class.ClassBuilder;

    InterfaceBuilder.prototype.setConstructor = undefined;

    InterfaceBuilder.prototype.getConstructor = undefined;

    InterfaceBuilder.prototype.removeConstructor = undefined;

    return InterfaceBuilder;

})();

// Source file: Class/Type/Interface/InterfaceDefinition.js

/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Interface.InterfaceDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function InterfaceDefinition(classInst, classDefinition)
    {
        InterfaceDefinition.$parent.call(this, classInst, classDefinition);
    }

    InterfaceDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * @inheritDoc
     */
    InterfaceDefinition.prototype.createBaseData = function()
    {
        return {
            
            /**
             * Parent class name
             *
             * @type {(string|null)}
             */
            $_extends: null,

            /**
             * List of constants
             *
             * @type {(Object|null)}
             */
            $_constants: null
        };
    };

    /**
     * Normalizes definition data
     */
    InterfaceDefinition.prototype.normalizeData = function()
    {
        InterfaceDefinition.$parent.prototype.normalizeData.call(this);

        var data = this.getData();
        var constants = this.getNoMethods();

        if (!data.hasOwnProperty('$_constants')) {
            data.$_constants = {};
        }

        for (var constantName in constants) {
            if (constants.hasOwnProperty(constantName)) {
                data.$_constants[constantName] = constants[constantName];
                delete data[constantName];
            }
        }
    };

    return InterfaceDefinition;
})();

// Source file: Class/Type/Trait/Trait.js

/**
 * @namespace
 */
Subclass.Class.Type.Trait = {};

/**
 * @namespace
 */
Subclass.Class.Type.Trait.Extension = {};

/**
 * @class
 * @extends {Subclass.Class.Type.Class.Class}
 */
Subclass.Class.Type.Trait.Trait = (function()
{
    /*************************************************/
    /*        Describing class type "Class"          */
    /*************************************************/

    /**
     * @param {Subclass.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Trait(classManager, className, classDefinition)
    {
        Trait.$parent.call(this, classManager, className, classDefinition);

        delete this._abstractMethods;
        delete this._created;
        delete this._traits;

        if (Subclass.ClassManager.issetType('Interface')) {
            //delete this._interfaces;
            this.addInterfaces = undefined;
            this.getInterfaces = undefined;
            this.addInterface = undefined;
            this.isImplements = undefined;
        }
    }

    Trait.$parent = Subclass.Class.Type.Class.Class;

    /**
     * @inheritDoc
     */
    Trait.getClassTypeName = function ()
    {
        return "Trait";
    };

    /**
     * @inheritDoc
     */
    Trait.getBuilderClass = function()
    {
        return Subclass.Class.Type.Trait.TraitBuilder;
    };

    /**
     * @inheritDoc
     */
    Trait.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Trait.TraitDefinition;
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.getConstructorEmpty = function ()
    {
        return function Trait() {

            // Hook for the grunt-contrib-uglify plugin
            return Trait.name;
        };
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.setParent = function (parentClassName)
    {
        Subclass.Class.ClassType.prototype.setParent.call(this, parentClassName);

        if (
            this._parent
            && this._parent.constructor != Trait
            && !(this._parent instanceof Trait)
        ) {
            Subclass.Error.create(
                'The trait "' + this.getName() + '" can be ' +
                'inherited only from the another trait.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    Trait.prototype.createConstructor = function()
    {
        return Subclass.Class.ClassType.prototype.createConstructor.apply(this, arguments);
    };

    Trait.prototype.getAbstractMethods = undefined;

    Trait.prototype.addAbstractMethods = undefined;

    /**
     * @inheritDoc
     */
    Trait.prototype.createInstance = undefined;


    /*************************************************/
    /*         Registering new class type            */
    /*************************************************/

    Subclass.ClassManager.registerType(Trait);

    return Trait;

})();

// Source file: Class/Type/Trait/Extension/ClassBuilderExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassBuilderExtension = function() {

    function ClassBuilderExtension(classInst)
    {
        ClassBuilderExtension.$parent.apply(this, arguments);
    }

    ClassBuilderExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassBuilder = Subclass.Class.Type.Class.ClassBuilder;

    /**
     * Validates list of traits
     *
     * @param {string[]} traitsList
     * @private
     */
    ClassBuilder.prototype._validateTraits = function(traitsList)
    {
        if (!Array.isArray(traitsList)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of trait names", false)
                .received(traitsList)
                .expected("an array of strings")
                .apply()
            ;
        }
        for (var i = 0; i < traitsList.length; i++) {
            this._validateTrait(traitsList[i]);
        }
    };

    /**
     * Validates trait name
     *
     * @param traitName
     * @private
     */
    ClassBuilder.prototype._validateTrait = function(traitName)
    {
        if (typeof traitName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the trait name", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
    };

    /**
     * Sets traits list
     *
     * @param {string[]} traitsList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.setTraits = function(traitsList)
    {
        this._validateTraits(traitsList);
        this.getDefinition().$_traits = traitsList;

        return this;
    };

    /**
     * Adds new traits
     *
     * @param {string} traitsList
     * @returns {Subclass.Class.Type.Class.ClassBuilder}
     */
    ClassBuilder.prototype.addTraits = function(traitsList)
    {
        this._validateTraits(traitsList);

        if (!this.getDefinition().$_traits) {
            this.getDefinition().$_traits = [];
        }
        this.getDefinition().$_traits = this.getDefinition().$_traits.concat(traitsList);

        return this;
    };

    /**
     * Adds new trait
     *
     * @param {string[]} traitName
     * @returns {Subclass.Class.Type.Trait.TraitBuilder}
     */
    ClassBuilder.prototype.addTrait = function(traitName)
    {
        this._validateTrait(traitName);

        if (!this.getDefinition().$_traits) {
            this.getDefinition().$_traits = [];
        }
        this.getDefinition().$_traits.push(traitName);

        return this;
    };

    /**
     * Returns traits list
     *
     * @returns {string[]}
     */
    ClassBuilder.prototype.getTraits = function()
    {
        return this.getDefinition().$_traits || [];
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();

// Source file: Class/Type/Trait/Extension/ClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Class.ClassExtension;

    ClassDefinitionExtension.$config = {
        classes: ["Class"]
    };

    ClassDefinitionExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getClass().getType()) < 0) {
            return false;
        }
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * Array of traits names
             *
             * @type {string[]}
             */
            data.$_traits = [];

            /**
             * Checks if current class instance has specified trait
             *
             * @param {string} traitName
             * @returns {boolean}
             */
            data.hasTrait = function (traitName)
            {
                return this.$_class.hasTrait(traitName);
            };
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var traits = this.getTraits();

            if (traits && this.validateTraits(traits)) {
                for (var i = 0; i < traits.length; i++) {
                    classManager.load(traits[i]);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * Validates "$_traits" attribute value
     *
     * @param {*} traits
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateTraits = function(traits)
    {
        try {
            if (traits && !Array.isArray(traits)) {
                throw 'error';
            }
            if (traits) {
                for (var i = 0; i < traits.length; i++) {
                    if (typeof traits[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_traits')
                    .className(this.getClass().getName())
                    .received(traits)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_traits" attribute value
     *
     * @param {string[]} traits
     *
     *      List of the classes which properties and method current one will contain.
     *
     *      Example: [
     *         "Namespace/Of/Trait1",
     *         "Namespace/Of/Trait2",
     *         ...
     *      ]
     */
    ClassDefinition.prototype.setTraits = function(traits)
    {
        this.validateTraits(traits);
        this.getData().$_traits = traits || [];

        if (traits) {
            this.getClass().addTraits(traits);
        }
    };

    /**
     * Return "$_traits" attribute value
     *
     * @returns {string[]}
     */
    ClassDefinition.prototype.getTraits = function()
    {
        return this.getData().$_traits;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();

// Source file: Class/Type/Trait/Extension/ClassExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassExtension = function() {

    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Class.ClassExtension;

    /**
     * @inheritDoc
     */
    ClassExtension.$config = {
        classes: ["Class"]
    };

    /**
     * @inheritDoc
     */
    ClassExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getType()) < 0) {
            return false;
        }
        ClassExtension.$parent.initialize.apply(this, arguments);

        // Registering new events

        classInst.registerEvent('onAddTrait');

        // Defining interfaces storage

        classInst.getEvent('onInitialize').addListener(function(evt)
        {
            /**
             * List of interfaces class names
             *
             * @type {Array<Subclass.Class.Type.Trait.Trait>}
             * @private
             */
            this._traits = [];
        });

        // Added ability to return traits in class parents list

        classInst.getEvent('onGetClassParents').addListener(function(evt, classes, grouping)
        {
            var traits = this.getTraits(true);

            function addClassName(classes, className)
            {
                if (classes.indexOf(className) < 0) {
                    classes.push(className);
                }
            }
            for (var i = 0; i < traits.length; i++) {
                var classInst = traits[i];
                var className = classInst.getName();

                if (grouping) {
                    var classType = classInst.getType();

                    if (!classes.hasOwnProperty(classType)) {
                        classes[classType] = [];
                    }
                    addClassName(classes[classType], className);

                } else {
                    addClassName(classes, className);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var Class = Subclass.Class.Type.Class.Class;

    /**
     * Adds traits
     *
     * @param {Object} traits
     */
    Class.prototype.addTraits = function(traits)
    {
        if (!traits || !Array.isArray(traits)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the traits list', false)
                .expected('an array')
                .received(traits)
                .apply()
            ;
        }
        for (var i = 0; i < traits.length; i++) {
            this.addTrait(traits[i]);
        }
    };

    /**
     * Returns trait names list
     *
     * @throws {Error}
     *
     * @param {boolean} [withInherited=false]
     *      Whether the inherited traits should be returned
     *
     * @returns {Array<Subclass.Class.Trait.Trait>}
     */
    Class.prototype.getTraits = function(withInherited)
    {
        if (withInherited !== true) {
            return this._traits;
        }
        var classManager = this.getClassManager();
        var traits = Subclass.Tools.copy(this._traits);

        for (var i = 0; i < traits.length; i++) {
            var traitParents = traits[i].getClassParents();

            for (var j = 0; j < traitParents.length; j++) {
                traits.push(classManager.get(traitParents[j]));
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.getTraits) {
                traits = traits.concat(parent.getTraits(withInherited))
            }
        }
        return traits;
    };

    /**
     * Adds trait class name
     *
     * @param {string} traitName
     * @throws {Error}
     */
    Class.prototype.addTrait = function (traitName)
    {
        var classDefinition = this.getDefinition();

        if (!traitName || typeof traitName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of trait", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
        var traitClass = this.getClassManager().get(traitName);
        var traitClassDefinition = traitClass.getDefinition();
        var traitProps = {};

        traitClass.addChildClass(this.getName());

        if (traitClass.constructor != Subclass.Class.Type.Trait.Trait) {
            Subclass.Error.create(
                'Trying add to "$_traits" option ' +
                'the new class "' + traitName + '" that is not a trait.'
            );
        }

        this.getEvent('onAddTrait').trigger(traitClass);

        // Copying all static properties to current class

        this.extendStaticProperties(traitClass);
        this.getTraits().push(traitClass);

        // Copying all properties and methods (with inherited) from trait to class definition

        Subclass.Tools.extend(traitProps, traitClassDefinition.getNoMethods(true));
        Subclass.Tools.extend(traitProps, traitClassDefinition.getMethods(true));

        classDefinition.setData(Subclass.Tools.extend(
            traitProps,
            classDefinition.getData()
        ));
    };

    /**
     * Checks if current class has specified trait class name
     *
     * @param {string} traitName
     * @returns {boolean}
     * @throws {Error}
     */
    Class.prototype.hasTrait = function (traitName)
    {
        if (!traitName || typeof traitName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of trait', false)
                .received(traitName)
                .expected('a string')
                .apply()
            ;
        }
        var traits = this.getTraits();

        for (var i = 0; i < traits.length; i++) {
            if (traits[i].isInstanceOf(traitName)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.hasTrait) {
                return parent.hasTrait(traitName);
            }
        }
        return false;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        Class = Subclass.Tools.buildClassConstructor(Class);

        if (!Class.hasExtension(ClassExtension)) {
            Class.registerExtension(ClassExtension);
        }
    });

    return ClassExtension;
}();

// Source file: Class/Type/Trait/TraitBuilder.js

/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Trait.TraitBuilder = (function()
{
    function TraitBuilder(classManager, classType, className)
    {
        TraitBuilder.$parent.call(this, classManager, classType, className);
    }

    TraitBuilder.$parent = Subclass.Class.ClassBuilder;

    TraitBuilder.prototype.setFinal = undefined;

    TraitBuilder.prototype.getFinal = undefined;

    TraitBuilder.prototype.setStatic = undefined;

    TraitBuilder.prototype.getStatic = undefined;

    TraitBuilder.prototype.setStaticProperty = undefined;

    TraitBuilder.prototype.removeStaticProperty = undefined;

    return TraitBuilder;

})();

// Source file: Class/Type/Trait/TraitDefinition.js

/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Trait.TraitDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function TraitDefinition(classInst, classDefinition)
    {
        TraitDefinition.$parent.apply(this, arguments);
    }

    TraitDefinition.$parent = Subclass.Class.Type.Class.ClassDefinition;

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.validateFinal = function(isFinal)
    {
        Subclass.Error.create(
            'Trait class definition cannot contain $_final option ' +
            'and consequently can\'t be final.'
        )
    };

    /**
     * @inheritDoc
     */
    TraitDefinition.prototype.createBaseData = function()
    {
        return {

            /**
             * The name of parent class
             *
             * @type {string}
             */
            $_extends: null
        };
    };

    return TraitDefinition;

})();

// Source file: Event/Helper/EventableInterface.js

/**
 * @interface
 * @constructor
 * @name Subclass.Event.EventableInterface
 */
Subclass.ClassManager.register('Interface', 'Subclass/Event/EventableInterface',
{
    /**
     * Registers the new event
     *
     * @method registerEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    registerEvent: function(eventName) {},

    /**
     * Invokes event listeners
     *
     * @method invokeEvent
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param [arguments]
     *      Any number arguments you need the event listeners
     *      will receive when the event will be triggered
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    triggerEvent: function(eventName) {},

    /**
     * Adds new listener to event
     *
     * @method addEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param {number} [priority]
     *      The priority of event listener.
     *      The more higher priority - the more earlier current listener callback function will be invoked.
     *
     * @param {Function} listener
     *      The callback function which will be invoked when the event triggers
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    addEventListener: function(eventName, priority, listener) {},

    /**
     * Removes specified event listener
     *
     * @method removeEventListener
     * @memberOf Subclass.Event.EventableInterface.prototype
     *
     * @param {string} eventName
     *      The event name
     *
     * @param {function} listener
     *      The listener callback function which was subscribed to the event
     *
     * @returns {Subclass.Event.EventableInterface}
     */
    removeEventListener: function(eventName, listener) {}
});

// Source file: Event/Helper/EventableTrait.js

/**
 * @class
 * @constructor
 * @name Subclass.Event.EventableTrait
 * @extends {Subclass.Event.EventableInterface}
 */
Subclass.ClassManager.register('Trait', 'Subclass/Event/EventableTrait', {

    /**
     * Collection of registered events
     *
     * @type {Object}
     * @example
     *
     * events: {
     *      eventName: [
     *          {
     *              priority: {number},
     *              callback: {function},
     *              hash: {Object}
     *          },
     *          ...
     *      ],
     *      ...
     * }
     */
    _events: {},

    /**
     * Returns collection of registered events
     *
     * @returns {Object}
     */
    getEvents: function()
    {
        return this._events;
    },

    /**
     * @inheritDoc
     */
    registerEvent: function(eventName)
    {
        if (!eventName || typeof eventName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('name of event', false)
                .received(eventName)
                .expected('a string')
                .apply()
            ;
        }
        this.getEvents()[eventName] = [];

        return this;
    },

    /**
     * @inheritDoc
     */
    triggerEvent: function(eventName)
    {
        if (!this.getEvents().hasOwnProperty(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        var uniqueFieldName = '_passed_' + Math.round(new Date().getTime() * Math.random());
        var eventListeners = this.getEvents()[eventName];
        var eventListenerArgs = [];
        var priorities = [];
        var $this = this;

        for (var i = 1; i < arguments.length; i++) {
            eventListenerArgs.push(arguments[i]);
        }

        for (i = 0; i < eventListeners.length; i++) {
            var eventListener = eventListeners[i];
            priorities.push(eventListener.priority);
            eventListener.hash[uniqueFieldName] = false;
        }

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        for (i = 0; i < priorities.length; i++) {
            for (var j = 0; j < eventListeners.length; j++) {
                eventListener = eventListeners[j];

                if (!eventListener.hash[uniqueFieldName] && eventListener.priority == priorities[i]) {
                    eventListener.hash[uniqueFieldName] = true;

                    if (eventListener.callback.apply($this, eventListenerArgs) === false) {
                        return false;
                    }
                }
            }
        }
        for (i = 0; i < eventListeners.length; i++) {
            delete eventListeners[i].hash[uniqueFieldName];
        }

        return this;
    },

    /**
     * @inheritDoc
     */
    addEventListener: function(eventName, priority, listener)
    {
        if (typeof priority == 'function') {
            listener = priority;
            priority = null;
        }
        if (!listener || typeof listener != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the listener in event "' + eventName + '"', false)
                .received(listener)
                .expected('a function')
                .apply()
            ;
        }
        if (!this.getEvents().hasOwnProperty(eventName)) {
            Subclass.Error.create('There is not event named "' + eventName + '".');
        }
        if (!priority && typeof priority != 'number') {
            priority = this.getEvents()[eventName].length;
        }

        var eventListener = {
            priority: priority,
            callback: listener,
            hash: {}
        };

        this.getEvents()[eventName].push(eventListener);

        return this;
    },

    /**
     * @inheritDoc
     */
    removeEventListener: function(eventName, listener)
    {
        var events = this.getEvents();

        for (var evtName in events) {
            if (!events.hasOwnProperty(evtName)) {
                continue;
            }
            var listeners = events[evtName];
            var listenerIndex;

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].callback == listener) {
                    listenerIndex = i;
                    break;
                }
            }
            if (listenerIndex) {
                listeners.splice(listenerIndex, 1);
                break;
            }
        }

        return this;
    }
});

// Source file: EventManager.js

/**
 * @class
 * @constructor
 */
Subclass.EventManager = function()
{
    function EventManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create("InvalidArgument")
                .argument('the module instance', false)
                .received(module)
                .expected('the instance of class "Subclass.Module"')
                .apply()
            ;
        }
        this._module = module;
    }

    EventManager.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Returns instance of module
     *
     * @method getModule
     * @memberOf Subclass.EventManager.prototype
     *
     * @returns {*}
     */
    EventManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Returns all registered events
     *
     * @method getEvents
     * @memberOf Subclass.EventManager.prototype
     *
     * @param {boolean} [privateEvents=false]
     *      If passed true it returns events only from current module
     *      without events from it plug-in modules.
     *
     * @returns {Object.<Subclass.Event.Event>}
     */
    EventManager.prototype.getEvents = function(privateEvents)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var events = {};
        var $this = this;

        if (privateEvents !== true) {
            privateEvents = false;
        }
        if (privateEvents) {
            return this._events;
        }

        moduleStorage.eachModule(true, function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(events, $this._events);
                return;
            }
            var moduleEventManager = module.getEventManager();
            var moduleEvents = moduleEventManager.getEvents();

            Subclass.Tools.extend(events, moduleEvents);
        });

        return events;
    };

    /**
     * @inheritDoc
     */
    EventManager.prototype.registerEvent = function(eventName)
    {
        if (this.issetEvent(eventName, true)) {
            return this;
        }
        this._events[eventName] = Subclass.Tools.createClassInstance(Subclass.ModuleEvent,
            this,
            eventName,
            this.getModule()
        );

        return this;
    };

    /**
     * Checks whether event with specified name was registered
     *
     * @method issetEvent
     * @memberOf Subclass.Event.EventableMixin.prototype
     *
     * @param {string} eventName
     *      The name of interesting event
     *
     * @param {boolean} [privateEvents]
     *      Checks whether is event with specified name was registered
     *      specificly in this module without checking in plug-in modules.
     *
     * @returns {boolean}
     */
    EventManager.prototype.issetEvent = function(eventName, privateEvents)
    {
        return !!this.getEvents(privateEvents)[eventName];
    };

    return EventManager;
}();

// Source file: LoadManager.js

/**
 * @class
 * @constructor
 * @description
 *
 * The class which allows to load different module files,
 * especially it's actual for loading module classes
 *
 * @throws {Error}
 *      Throws error if specified invalid instance of module
 *
 * @param {Subclass.Module} module
 *      The instnace of module
 */
Subclass.LoadManager = (function()
{
    function LoadManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidError')
                .argument('the module instance', false)
                .received(module)
                .expected('an instance of Subclass.Module class')
                .apply()
            ;
        }

        /**
         * The instance of module
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Stack of files that are loading at the moment
         *
         * @type {Array.<Object>}
         * @private
         */
        this._stack = [];

        /**
         * Portion of files in order to load
         *
         * @type {Array.<string>}
         * @private
         */
        this._stackPortion = [];

        /**
         * Checks whether the loading process continues
         *
         * @type {boolean}
         * @private
         */
        this._loading = false;

        /**
         * Reports that loading was paused
         *
         * @type {boolean}
         * @private
         */
        this._loadingPause = false;

        /**
         * The timeout after which the ready callback will be called
         *
         * @type {(*|null)}
         * @private
         */
        this._loadingEndTimeout = null;

        /**
         * The timeout after which the classes in load stack will start loading
         *
         * @type {(*|null)}
         * @private
         */
        this._addToStackTimeout = null;

        module.getEventManager()
            .registerEvent('onLoadingStart')
            .registerEvent('onLoadingEnd')
            .registerEvent('onAddToLoadStack')
            .registerEvent('onRemoveFromLoadStack')
            .registerEvent('onProcessLoadStack')
        ;
    }

    /**
     * Initializes instance of load manager
     *
     * @method initialize
     * @memberOf Subclass.LoadManager.prototype
     */
    LoadManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var eventManager = module.getEventManager();
        var $this = this;

        // Starting load files of plug-in modules after the files
        // of current module (to which the current one instance of load manager belongs) were fully loaded

        eventManager.getEvent('onLoadingEnd').addListener(-10000000, function(evt) {
            module.getModuleStorage().eachModule(function(module) {
                if (module != $this.getModule()) {
                    module.getLoadManager().startLoading();
                }
            });
        });
    };

    /**
     * Returns the instance of module to which current instance of load manager belongs
     *
     * @method getModule
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {Subclass.Module}
     */
    LoadManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Starts the process of loading files with new classes
     *
     * @method startLoading
     * @memberOf Subclass.LoadManager.prototype
     */
    LoadManager.prototype.startLoading = function()
    {
        var module = this.getModule();
        var $this = this;

        if (
            module.isPlugin()
            && (
                !module.getParent()
                || !module.getRoot().isPrepared()
            )
        ) {
            return;
        }
        $this._loading = true;
        $this._loadingPause = false;
        $this.processStack();

        $this.getModule().getEventManager().getEvent('onLoadingStart').trigger();

        if ($this.isStackEmpty()) {
            $this.completeLoading();
        }
    };

    /**
     * Pauses the process of loading files with new classes
     *
     * @method pauseLoading
     * @memberOf Subclass.LoadManager.prototype
     */
    LoadManager.prototype.pauseLoading = function()
    {
        clearTimeout(this._loadingEndTimeout);
        this._loadingPause = true;
    };

    /**
     * Reports whether the process of loading files with new classes was paused
     *
     * @method isLoadingPaused
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isLoadingPaused = function()
    {
        return this._loadingPause;
    };

    /**
     * Tries to complete the process of loading files with new classes.
     * If it was completed then will be triggered the appropriate event.
     *
     * @method completeLoading
     * @memberOf Subclass.LoadManager.prototype
     */
    LoadManager.prototype.completeLoading = function()
    {
        if (!this.isLoading()) {
            return;
        }
        clearTimeout(this._loadingEndTimeout);
        var $this = this;

        if (
            !this.isLoadingPaused()
            && this.isStackEmpty()
        ) {
            this._loadingEndTimeout = setTimeout(function() {
                var module = $this.getModule();
                var eventManager = module.getEventManager();
                $this._loading = false;

                eventManager
                    .getEvent('onLoadingEnd')
                    .triggerPrivate()
                ;
            }, 20);
        }
    };

    /**
     * Checks whether the loading process continues
     *
     * @method isLoading
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isLoading = function()
    {
        return this._loading;
    };

    /**
     * Adds the new file to load stack
     *
     * @method addToStack
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param {string} fileName
     *      The name of file relative to the "rootPath" module settings option.
     *      Also it is possible to specify an absolute path using the "^" symbol at the start of the path.
     *
     * @param {function} [callback]
     *      The callback function which will be invoked after file will be loaded
     */
    LoadManager.prototype.addToStack = function(fileName, callback)
    {
        var $this = this;

        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        if (this.isInStack(fileName)) {
            return;
        }

        this._stack.push({
            file: fileName,
            fileFull: null,
            callback: callback || function() {},
            xmlhttp: null
        });

        clearTimeout(this._addToStackTimeout);
        this.getModule().getEventManager().getEvent('onAddToLoadStack').trigger(
            fileName,
            callback
        );

        this._addToStackTimeout = setTimeout(function() {
            $this.startLoading();
        }, 10);
    };

    /**
     * Alias of {@link Subclass.LoadManager#addToStack}
     *
     * @method load
     * @memberOf Subclass.LoadManager.prototype
     * @alias Subclass.LoadManager#addToStack
     */
    LoadManager.prototype.loadFile = LoadManager.prototype.addToStack;

    /**
     * Returns the object of loading file from the load stack
     *
     * @method getStackItem
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param fileName
     *      The name of loading file
     *
     * @returns {*}
     */
    LoadManager.prototype.getStackItem = function(fileName)
    {
        var stackItem = null;

        for (var i = 0; i < this._stack.length; i++) {
            if (this._stack[i].file == fileName) {
                stackItem = this._stack[i];
            }
        }

        return stackItem;
    };

    /**
     * Returns the index of file name in load stack
     *
     * @method getStackItemIndex
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param fileName
     *      The name of file
     *
     * @returns {boolean}
     */
    LoadManager.prototype.getStackItemIndex = function(fileName)
    {
        var stackItemIndex = false;

        for (var i = 0; i < this._stack.length; i++) {
            if (this._stack[i].file == fileName) {
                stackItemIndex = i;
            }
        }

        return stackItemIndex;
    };

    /**
     * Removes specified class from the load stack
     *
     * @method removeFromLoadStack
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param {string} fileName
     *      The name of class
     */
    LoadManager.prototype.removeFromStack = function(fileName)
    {
        var mainModule = this.getModule().getRoot();

        if (arguments[1]) {
            mainModule = this.getModule();
        }

        var loadManager = mainModule.getLoadManager();
        var stackItem = loadManager.getStackItem(fileName);
        var stackItemIndex = loadManager.getStackItemIndex(fileName);

        if (stackItem && stackItemIndex !== false) {
            mainModule.getEventManager().getEvent('onRemoveFromLoadStack').trigger(
                stackItem,
                stackItemIndex
            );

            if (stackItem.xmlhttp) {
                stackItem.xmlhttp.abort();
            }
            loadManager._stack.splice(stackItemIndex, 1);
        }

        // Removing from stack from all modules

        var moduleStorage = mainModule.getModuleStorage();

        moduleStorage.eachModule(function (module, moduleName) {
            if (module != mainModule) {
                module.getLoadManager().removeFromStack(fileName, true);
            }
        });
    };

    /**
     * Processes files from the load stack. Loads files from stack.
     *
     * @method processStack
     * @memberOf Subclass.LoadManager.prototype
     */
    LoadManager.prototype.processStack = function()
    {
        var module = this.getModule();
        var moduleSettings = module.getSettingsManager();
        var rootPath = moduleSettings.getRootPath();
        var stackPortion = [];
        var $this = this;

        if (!this.isStackPortionEmpty()) {
            return;
        }

        for (var i = 0; i < this._stack.length; i++) {
            var stackItem = this._stack[i];
            stackPortion.push(stackItem.file);

            if (!stackItem.file.match(/^\^/i)) {
                stackItem.fileFull = rootPath + stackItem.file;

            } else {
                stackItem.fileFull = stackItem.file.substr(1);
            }
        }

        // Creating the pack of loading files.
        // While this portion loads the new files will not start loading.

        this.setStackPortion(stackPortion);

        // Triggering the event when processing the new portion of files

        module.getEventManager().getEvent('onProcessLoadStack').trigger(this._stack);

        // Loading files

        !function loadFile(fileName) {
            if (!fileName) {
                return;
            }
            var stackItem = $this.getStackItem(fileName);

            if (!stackItem) {
                return;
            }
            stackItem.xmlhttp = Subclass.Tools.loadJS(stackItem.fileFull, function() {
                $this.removeFromStackPortion(stackItem.file);
                $this.removeFromStack(stackItem.file);
                stackItem.callback();

                var newFileName = $this.getStackPortion()[0];

                if (newFileName) {
                    loadFile(newFileName);

                } else {
                    $this.startLoading();
                }
            });
        }(stackPortion[0]);

        // If loading of files from the portion was not completed
        // then pause the loading of new files while the portion becomes empty

        if (!this.isStackEmpty()) {
            this.pauseLoading();
        }
    };

    /**
     * Checks whether the specified files is in load stack
     *
     * @method isInStack
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param {string} fileName
     *      The name of file
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isInStack = function(fileName)
    {
        var mainModule = this.getModule().getRoot();

        if (arguments[1]) {
            mainModule = this.getModule();
        }

        var loadManager = mainModule.getLoadManager();

        for (var i = 0; i < loadManager._stack.length; i++) {
            if (loadManager._stack[i].file == fileName) {
                return true;
            }
        }

        // Searching file with specified name in all modules

        var moduleStorage = mainModule.getModuleStorage();
        var result = false;

        moduleStorage.eachModule(function (module, moduleName) {
            if (module != mainModule) {
                result = module.getLoadManager().removeFromStack(fileName, true);

                if (result) {
                    return false;
                }
            }
        });

        return result;
    };

    /**
     * Checks whether the load stack is empty
     *
     * @method isStackEmpty
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isStackEmpty = function()
    {
        return !this._stack.length;
    };

    /**
     * Sets the stack portion.<br /><br />
     *
     * It is a pack of file names which will be loaded first.
     * The files, which was added after the portion was created, will be loaded only after
     * the files from current portion will be loaded.
     *
     * @method setStackPortion
     * @memberOf Subclass.LoadManager.prototype
     *
     * @param {Array.<string>} fileNames
     *      The array of file names.
     */
    LoadManager.prototype.setStackPortion = function(fileNames)
    {
        if (!Array.isArray(fileNames)) {
            Subclass.Error.create('InvalidArgument')
                .argument('list of file names', false)
                .received(fileNames)
                .expected('array of strings')
                .apply()
            ;
        }
        this._stackPortion = fileNames;
    };

    /**
     * Returns the stack portion
     *
     * @method getStackPortion
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {Array.<string>}
     */
    LoadManager.prototype.getStackPortion = function()
    {
        return this._stackPortion;
    };

    /**
     * Reports whether the stack portion is empty
     *
     * @method isStackPortionEmpty
     * @memberOf Subclass.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isStackPortionEmpty = function()
    {
        return !this.getStackPortion().length;
    };

    /**
    * Removes file name from the stack portion
    *
    * @method removeFromStackPortion
    * @memberOf Subclass.LoadManager.prototype
    *
    * @param {string} fileName
    */
    LoadManager.prototype.removeFromStackPortion = function(fileName)
    {
        var stackPortion = this.getStackPortion();
        var index = stackPortion.indexOf(fileName);

        if (index >= 0) {
            stackPortion.splice(index, 1);
        }
    };

    return LoadManager;

})();

// Source file: ModuleEvent.js

/**
 * @class
 * @extends {Subclass.Event.Event}
 */
Subclass.ModuleEvent = function()
{
    function ModuleEvent(eventManager, eventName, context)
    {
        ModuleEvent.$parent.call(this, eventName, context);

        if (!eventManager || !(eventManager instanceof Subclass.EventManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the event manager instance", false)
                .received(eventManager)
                .expected('an instance of "Subclass.EventManager"')
                .apply()
            ;
        }

        /**
         * Event manager instance
         *
         * @type {Subclass.EventManager}
         * @private
         */
        this._eventManager = eventManager;
    }

    ModuleEvent.$parent = Subclass.Event.Event;



    /**
     * Returns event manager instance
     *
     * @method getEventManager
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @returns {Subclass.EventManager}
     */
    ModuleEvent.prototype.getEventManager = function()
    {
        return this._eventManager;
    };

    /**
     * Returns all registered event listeners
     *
     * @method getListeners
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @param {boolean} [privateListeners = false]
     *      If passed true it returns event listeners only from event instance from current module
     *      without listeners from its plug-in module events with the same name.
     *
     * @returns {Object.<Subclass.Event.EventListener>}
     */
    ModuleEvent.prototype.getListeners = function(privateListeners)
    {
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var listeners = [];
        var $this = this;

        if (privateListeners !== true) {
            privateListeners = false;
        }
        if (privateListeners) {
            return this._listeners;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(listeners, $this._listeners);
                return;
            }
            var moduleEventManager = module.getEventManager();
            var moduleEventListeners = moduleEventManager.getEvent($this.getName()).getListeners();

            Subclass.Tools.extend(listeners, moduleEventListeners);
        });

        return Subclass.Tools.unique(listeners);
    };

    /**
     * Returns event listener by specified callback function
     *
     * @method getListenerByCallback
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @throws {Error}
     *      Throws error if was specified not a function callback
     *
     * @param {Function} callback
     *      Function which was early used in registering event listener
     *
     * @returns {(Subclass.Event.EventListener|null)}
     */
    ModuleEvent.prototype.getListenerByCallback = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var listener = null;
        var $this = this;

        moduleStorage.eachModule(function(module) {
            var moduleEventManager = module.getEventManager();
            var moduleEvent = moduleEventManager.getEvent($this.getName());
            var listeners = moduleEvent.getListeners(true);

            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i].getCallback() == callback) {
                    listener = listeners[i];
                    return false;
                }
            }
        });

        return listener;
    };

    /**
     * @inheritDoc
     */
    ModuleEvent.prototype.removeListener = function(callback)
    {
        if (!callback || typeof callback != 'Function') {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var mainModule = this.getEventManager().getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var $this = this;

        moduleStorage.eachModule(function(module) {
            var moduleEventManager = module.getEventManager();
            var moduleEvent = moduleEventManager.getEvent($this.getName());
            var listeners = moduleEvent.getListeners(true);
            var listenerIndex = listeners.indexOf(callback);

            if (listenerIndex >= 0) {
                listeners.splice(listenerIndex, 1);
            }
        });

        return this;
    };

    /**
     * Invokes event listeners only from module to which event with specified name belongs to.<br /><br />
     *
     * Will be invoked all listener callback functions only from
     * current module (without plug-ins) event.<br /><br />
     *
     * Each event listener callback function will receive as arguments all arguments from current method call.
     * If listener callback function returns false then it will bring to stop propagation of event.
     *
     * @method triggerPrivate
     * @memberOf Subclass.ModuleEvent.prototype
     *
     * @param [arguments]
     *      Any number of any needed arguments
     *
     * @returns {Subclass.Event.EventData}
     */
    ModuleEvent.prototype.triggerPrivate = function()
    {
        var listeners = this.getListeners(true);

        return this._processTrigger(listeners, arguments);
    };

    return ModuleEvent;
}();

// Source file: ModuleStorage.js

/**
 * @class
 * @constructor
 * @description
 *
 * Class that manages all plug-in and a root modules.<br /><br />
 *
 * The goal of manager is hold links to all module plug-ins and sort out them
 * and a root module by specific callback function in order
 * as they were attached to the root module.
 *
 * @param {Subclass.Module} module
 *      An instance of module
 *
 * @param {string[]} pluginModuleNames
 *      Array of plug-in module names
 */
Subclass.ModuleStorage = (function()
{
    function ModuleStorage(module, pluginModuleNames)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the module instance", false)
                .received(module)
                .expected('an instance of "Subclass.Module"')
                .apply()
            ;
        }
        if (pluginModuleNames && !Array.isArray(pluginModuleNames)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of plug-in module names", false)
                .received(pluginModuleNames)
                .expected('an array of plug-in module names')
                .apply()
            ;
        } else if (!pluginModuleNames) {
            pluginModuleNames = [];
        }

        // Selecting lazy modules

        var lazyModuleNames = {};

        for (var i = 0, j = 0; i < pluginModuleNames.length; i++, j++) {
            if (typeof pluginModuleNames[i] == 'object') {
                lazyModuleNames[pluginModuleNames[i].name] = j;
                pluginModuleNames.splice(i, 1);
                i--;
            }
        }

        /**
         * Main module instance
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Collection with current module and its plug-in modules
         *
         * @type {Array.<Subclass.Module>}
         */
        this._modules = this._processModules(pluginModuleNames);
        this._modules.unshift(module);

        /**
         * The list of module names that are loading at the moment
         * When each of lazy modules will be loaded, it will be removed from current array.
         *
         * @type {string[]}
         */
        this._lazyModules = lazyModuleNames;
    }

    /**
     * Returns main module instance (the module to
     * which belongs current instance of module manager)
     *
     * @method getMainModule
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {Subclass.Module}
     */
    ModuleStorage.prototype.getMainModule = function()
    {
        return this._module;
    };

    /**
     * Returns array with all module instances (including main module)
     *
     * @method getModules
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {Array.<Subclass.Module>}
     */
    ModuleStorage.prototype.getModules = function()
    {
        return this._modules;
    };

    /**
     * Returns the list of all not resolved lazy plug-in modules
     *
     * @method getLazyModules
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {string[]}
     */
    ModuleStorage.prototype.getLazyModules = function()
    {
        return this._lazyModules;
    };

    /**
     * Checks whether module with specified name is lazy
     *
     * @mthod issetLazyModule
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @param {string} moduleName
     *      A name of lazy module
     *
     * @returns {boolean}
     */
    ModuleStorage.prototype.issetLazyModule = function(moduleName)
    {
        return !!this.getLazyModules().hasOwnProperty(moduleName);
    };

    /**
     * Reports whether current module has not resolved lazy plug-in modules
     *
     * @method hasLazyModules
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {boolean}
     */
    ModuleStorage.prototype.hasLazyModules = function()
    {
        return !!Object.keys(this.getLazyModules()).length;
    };

    /**
     * Resolves lazy module (plug-in in this case).
     * It means that lazy module was loaded.
     *
     * @method resolveLazyModule
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @param {string} moduleName
     *      The name of lazy plug-in module
     */
    ModuleStorage.prototype.resolveLazyModule = function(moduleName)
    {
        if (!this.issetLazyModule(moduleName)) {
            return;
        }
        delete this.getLazyModules()[moduleName];
    };

    /**
     * Normalizes plugin modules
     *
     * @method _processModules
     *
     * @throws {Error}
     *      Throws error if specified in plugins module that is not a plugin.
     *
     * @param {string[]} moduleNames
     *      Array of module names. Each module should be marked as a plugin
     *      (by the "plugin" or "pluginOf" setting parameters)
     *
     * @returns {Array.<Subclass.Module>}
     * @private
     * @ignore
     */
    ModuleStorage.prototype._processModules = function(moduleNames)
    {
        var mainModule = this.getMainModule();
        var modules = [];

        for (var i = 0; i < moduleNames.length; i++) {
            var childModule = Subclass.getModule(moduleNames[i]).getModule();
            var childModuleSettings = childModule.getSettingsManager();

            if (!childModuleSettings.isPlugin()) {
                Subclass.Error.create(
                    'Specified in plugins module "' + moduleNames[i] + '" ' +
                    'that is not a plugin.'
                );
            }
            childModule.setParent(mainModule);
            modules.push(childModule);
        }

        return modules;
    };

    /**
     * Adds the new plugin module
     *
     * @method addPlugin
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @param {string} moduleName
     *      The name of plug-in module
     */
    ModuleStorage.prototype.addPlugin = function(moduleName)
    {
        var processedModule = this._processModules([moduleName])[0];

        if (this.issetLazyModule(moduleName)) {
            var lazyModuleIndex = parseInt(this.getLazyModules()[moduleName]) + 1;
            this._modules.splice(lazyModuleIndex, 0, processedModule)

        } else {
            this._modules.push(processedModule);
        }
    };

    /**
     * Returns all plug-in module instances of the current module
     *
     * @method getPlugins
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {Array.<Subclass.Module>}
     */
    ModuleStorage.prototype.getPlugins = function()
    {
        var modules = this.getModules();
        var modulesCopy = [];

        for (var i = 0; i < modules.length; i++) {
            if (i > 0) {
                modulesCopy.push(modules[i]);
            }
        }
        return modulesCopy;
    };

    /**
     * Returns all plug-in module names of the current module
     *
     * @method getPluginNames
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @returns {Array.<string>}
     */
    ModuleStorage.prototype.getPluginNames = function()
    {
        var plugins = this.getPlugins();
        var names = [];

        for (var i = 0; i < plugins.length; i++) {
            names.push(plugins[i].getName());
        }
        return names;
    };

    /**
     * Sorts out each module by specified callback
     *
     * @method eachModule
     * @memberOf Subclass.ModuleStorage.prototype
     *
     * @param {boolean} [reverse]
     *      Optional parameter which allows to sort out modules in a reverse order
     *
     * @param {Function} callback
     *      Callback function which will perform each module in the sor ordering process.<br /><br />
     *
     *      Function will receive two arguments:<br />
     *      - the first one is an instance of module;<br />
     *      - the second one is a module name.<br /><br />
     *
     *      If callback function returns false, the sorting out will break.
     *
     * @example
     * ...
     *
     * var ModuleStorage = moduleInst.getModuleStorage();
     *
     * moduleStorage.eachModule(function(module, moduleName) {
     *     // some manipulations
     *     ...
     *
     *     if (moduleName == 'app') {  // or any other condition.
     *         return false;           // breaks sort ordering and the rest modules
     *                                 // will not processed by this function
     *     }
     * });
     * ...
     */
    ModuleStorage.prototype.eachModule = function(reverse, callback)
    {
        if (typeof reverse == 'function') {
            callback = reverse;
            reverse = false;
        }
        var modules = Subclass.Tools.extend([], this.getModules());

        if (reverse) {
            modules.reverse();
        }

        for (var i = 0; i < modules.length; i++) {
            if (callback(modules[i], modules[i].getName()) === false) {
                break;
            }
        }
    };

    return ModuleStorage;

})();

// Source file: SettingsManager.js

/**
 * @class
 * @constructor
 * @description
 *
 * The class which holds and manages module settings.
 * It can validate, set and get settings parameters.<br /><br />
 *
 * To see the list of available setting parameters
 * look at description of {@link Subclass.Module}
 * class constructor parameters.
 *
 * @param {Subclass.Module} module
 *      The module instance
 */
Subclass.SettingsManager = function()
{
    /**
     * @alias Subclass.SettingsManager
     */
    function SettingsManager(module)
    {
        /**
         * Instance of subclass module
         *
         * @type {Subclass.Module}
         */
        this._module = module;

        /**
         * Indicates is the current module a plug-in
         *
         * @type {boolean}
         * @private
         */
        this._plugin = false;

        /**
         * Indicates that current module is a plugin and belongs to specified module
         *
         * @type {(string|null)}
         * @private
         */
        this._pluginOf = null;

        /**
         * Root path of the project
         *
         * @type {string}
         * @private
         */
        this._rootPath = "";

        /**
         * A list of files
         *
         * @type {Array}
         * @private
         */
        this._files = [];

        /**
         * List of class manager events
         *
         * @type {Object}
         * @private
         */
        this._events = {};


        // Initializing operations

        this.registerEvent('onInitialize');
        this.initializeExtensions();
        this.getEvent('onInitialize').trigger();
    }

    SettingsManager.$parent = Subclass.Extendable;

    SettingsManager.$mixins = [Subclass.Event.EventableMixin];

    /**
     * Sets new module settings.
     *
     * New setting parameters will rewrite earlier ones, for example,
     * specified in module constructor or in earlier call of SettingsManager#setSettings method.
     *
     * @method setSettings
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *     Throws error when:<br />
     *     - if module is ready;<br />
     *     - specified argument is not a plain object;<br />
     *     - in settings object specified non agreed parameter.
     *
     * @param {Object} moduleSettings
     *     Object with module setting parameters
     *
     * @example
     * ...
     *
     * var moduleInst = Subclass.createModule('myApp');
     *
     * ...
     * var moduleSettings = moduleInst.getSettingsManager();
     * var parameterManager = moduleInst.getParameterManager();
     *
     * moduleSettings.setSettings({ // or easily use moduleInst.setSettings({...});
     *     rootPath: "path/to/project/root/dir",  // adds new parameter
     * });
     *
     * moduleSettings.getRootPath();               // Return "path/to/project/root/dir"
     * ...
     */
    SettingsManager.prototype.setSettings = function (moduleSettings)
    {
        var $this = this;

        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change settings in ready module.');
        }
        if (moduleSettings && !Subclass.Tools.isPlainObject(moduleSettings)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the module settings", false)
                .received(moduleSettings)
                .expected("a plain object")
                .apply()
            ;
        }
        if (moduleSettings) {
            if (moduleSettings.hasOwnProperty('pluginOf')) {
                this.setPluginOf(moduleSettings.pluginOf);
            }
            if (moduleSettings.hasOwnProperty('files')) {
                this.setFiles(moduleSettings.files);
            }

            for (var settingName in moduleSettings) {
                if (
                    !moduleSettings.hasOwnProperty(settingName)
                    || [
                        'pluginOf',
                        'files',
                        'onReady'
                    ].indexOf(settingName) >= 0
                ) {
                    continue;
                }
                var setterName = "set" + settingName[0].toUpperCase() + settingName.substr(1);

                if (!this[setterName]) {
                    Subclass.Error.create(
                        'Setting option "' + settingName + '" is not allowed ' +
                        'by the module.'
                    );
                }
                this[setterName](moduleSettings[settingName]);
            }
            if (moduleSettings.hasOwnProperty('onReady')) {
                $this.setOnReady(moduleSettings.onReady);
            }
        }
    };

    /**
     * Returns module instance to which current settings manager belongs
     *
     * @method getModule
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {Subclass.Module}
     */
    SettingsManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Sets a specific state would be current module a plug-in or not.
     *
     * If module is marked as a plug-in then its registered onReady callback functions
     * will be invoked only when the root module becomes ready.
     *
     * @method setPlugin
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - was specified not boolean value
     *
     * @param {boolean} isPlugin
     *      Should be current module a plugin or not
     */
    SettingsManager.prototype.setPlugin = function(isPlugin)
    {
        this.checkModuleIsReady();

        if (typeof isPlugin != 'boolean') {
            Subclass.Error.create('InvalidModuleOption')
                .option('plugin')
                .module(this.getModule().getName())
                .received(isPlugin)
                .expected('a boolean value')
                .apply()
            ;
        }
        this._plugin = isPlugin;
    };

    /**
     * Reports whether the current module is a plug-in of another module or not
     *
     * @method getPlugin
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {boolean}
     */
    SettingsManager.prototype.getPlugin = function()
    {
        return this._plugin;
    };

    /**
     * @method isPlugin
     * @memberOf Subclass.SettingsManager.prototype
     * @alias Subclass.SettingsManager#getPlugin
     */
    SettingsManager.prototype.isPlugin = SettingsManager.prototype.getPlugin;

    /**
     * Marks current module that it should be a plug-in of the module with specified name.
     *
     * If was specified name of parent module then the module setting parameter
     * "plugin" will forcibly set to true.
     *
     * @method setPluginOf
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if specified argument is not string or null
     *
     * @param {string} parentModuleName
     *      A name of the parent module
     */
    SettingsManager.prototype.setPluginOf = function(parentModuleName)
    {
        this.checkModuleIsReady();

        if (parentModuleName !== null && typeof parentModuleName != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('pluginOf')
                .module(this.getModule().getName())
                .received(parentModuleName)
                .expected('a string (name of another module that is not marked as a plugin)')
                .apply()
            ;
        }
        this._pluginOf = parentModuleName;
        this.setPlugin(true);
    };

    /**
     * Returns name of the parent module if current one is a plug-in of the specified module
     *
     * @method getPluginOf
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {(string|null)}
     */
    SettingsManager.prototype.getPluginOf = function()
    {
        return this._pluginOf;
    };

    /**
     * Sets root directory path of the project.
     *
     * @method setRootPath
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not string argument value
     *
     * @param {string} rootPath
     *      A path to the project root directory
     *
     * @example
     *
     * ...
     * var moduleSettings = moduleInst.getSettingsManager();
     *     moduleSettings.setRootPath("path/to/the/directory/root");
     * ...
     */
    SettingsManager.prototype.setRootPath = function(rootPath)
    {
        this.checkModuleIsReady();

        if (typeof rootPath != 'string') {
            Subclass.Error.create('InvalidModuleOption')
                .option('rootPath')
                .module(this.getModule().getName())
                .received(rootPath)
                .expected('a string')
                .apply()
            ;
        }
        this._rootPath = rootPath;
    };

    /**
     * Returns root directory path of the project
     *
     * @method getRootPath
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {(string|null)}
     */
    SettingsManager.prototype.getRootPath = function()
    {
        return this._rootPath;
    };

    /**
     * Sets and loads specified files.
     *
     * @method setFiles
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not array of strings argument value
     *
     * @param {string[]} files
     *      An array with file names which will be loaded before module
     *      will become ready. Each file name can be an absolute or relative.
     *      If file name specified with sign "^" at start it means that is an absolute path.
     *      Otherwise it is a path of file relative to "rootPath".
     *
     * @param {Function} callback
     *      The callback function which will invoked after
     *      the specified main file will loaded
     */
    SettingsManager.prototype.setFiles = function(files, callback)
    {
        this.checkModuleIsReady();

        if (!files || !Array.isArray(files)) {
            Subclass.Error.create(
                "Trying to set invalid files array in module settings set. " +
                "It must contain the names of files."
            );
        }

        var module = this.getModule();
        var loadManager = module.getLoadManager();

        for (var i = 0; i < files.length; i++) {
            loadManager.loadFile(files[i]);
        }
    };

    /**
     * Reports whether current module loads some files
     *
     * @method hasFiles
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {boolean}
     */
    SettingsManager.prototype.hasFiles = function()
    {
        return !!this._files.length;
    };

    /**
     * Sets callback function which will be invoked before all registered user application
     * parts (i.e. classes) will be set upped.
     *
     * It is a good opportunity to modify its settings using plugins of application.
     *
     * @method setOnSetup
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param callback
     */
    SettingsManager.prototype.setOnSetup = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var eventManager = this.getModule().getEventManager();
        var onSetupEvent = eventManager.getEvent('onSetup');

        onSetupEvent.addListener(callback);
    };

    /**
     * Sets callback function which will be invoked after the all classes of the module
     * will be loaded and registered.<br><br>
     *
     * It is the same as "onReady" parameter in module settings. If it was defined
     * in module settings too the new callback function will be added to the onReady
     * callbacks storage and will be invoked after other callback functions
     * which were registered earlier.<br><br>
     *
     * If there were no classes registered in module at the moment and onReady callback
     * function was not set earlier, the call of current method invokes specified callback immediately.
     *
     * @method setOnReady
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param {Function} callback
     *      Callback function which will do some initializing manipulations
     */
    SettingsManager.prototype.setOnReady = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var module = this.getModule();
        var eventManager = module.getEventManager();
        var onReadyEvent = eventManager.getEvent('onReady');

        onReadyEvent.addListener(callback);
    };

    /**
     * Ensures that the module is not ready
     *
     * @method checkModuleIsReady
     * @private
     * @ignore
     */
    SettingsManager.prototype.checkModuleIsReady = function()
    {
        if (this.getModule().isReady()) {
            Subclass.Error.create('Can\'t change settings in ready module.');
        }
    };

    return SettingsManager;
}();

// Source file: SubclassPlugin.js

/**
 * @class
 * @constructor
 */
Subclass.SubclassPlugin = function() {

    function SubclassPlugin()
    {
        // Do nothing
    }

    SubclassPlugin.$parent = null;

    /**
     * Returns tha name of Subclass plugin
     */
    SubclassPlugin.getName = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .className('Subclass.SubclassPlugin')
            .method('getName')
            .apply()
        ;
    };

    /**
     * Returns list of Subclass plugin names which is needed by current plugin
     */
    SubclassPlugin.getDependencies = function()
    {
        return [];
    };

    return SubclassPlugin;
}();
})();