/**
 * @namespace
 */
Subclass.Parser = {};

/**
 * @class
 * @constructor
 */
Subclass.Parser.ParserManager = function()
{
    function ParserManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the module instance', false)
                .expected('an instance of class "Subclass.Module"')
                .received(module)
                .apply()
            ;
        }
        /**
         * @type {Subclass.Module}
         * @private
         */
        this._module = module;

        /**
         * @type {Object.<Subclass.Parser.ParserAbstract>}
         * @private
         */
        this._parsers = {};

        for (var parserName in _parsers) {
            if (_parsers.hasOwnProperty(parserName)) {
                this._parsers[parserName] = Subclass.Tools.createClassInstance(
                    _parsers[parserName],
                    this
                );
                if (!(this._parsers[parserName] instanceof Subclass.Parser.ParserAbstract)) {
                    Subclass.Error.create(
                        'Registered invalid parser. ' +
                        'It should be instance of class "Subclass.Parser.ParserAbstract".'
                    )
                }
            }
        }
    }

    var _parsers = [];

    /**
     * Registers new parser constructor
     *
     * @param {Function} parserConstructor
     */
    ParserManager.registerParser = function(parserConstructor)
    {
        if (typeof parserConstructor != 'function' || !parserConstructor.getName) {
            Subclass.Error.create(
                'Trying to register invalid parser. ' +
                'It should be instance of class "Subclass.Parser.ParserAbstract".'
            );
        }
        _parsers[parserConstructor.getName()] = parserConstructor;
    };

    /**
     * Returns parser constructor by its name
     *
     * @param {string} parserName
     * @returns {*}
     */
    ParserManager.getParser = function(parserName)
    {
        if (!this.issetParser(parserName)) {
            Subclass.Error.create(
                'Trying to get non registered parser constructor ' +
                'named "' + parserName + '"'
            );
        }
        return _parsers[parserName];
    };

    /**
     * Checks whether parser constructor with specified name was registered
     *
     * @param {string} parserName
     * @returns {boolean}
     */
    ParserManager.issetParser = function(parserName)
    {
        return _parsers.hasOwnProperty(parserName);
    };

    ParserManager.prototype = {

        /**
         * Returns module instance
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this._module;
        },

        /**
         * Returns parser instance by its name
         *
         * @param {string} parserName
         * @returns {Subclass.Parser.ParserAbstract}
         */
        get: function(parserName)
        {
            if (!this.isset(parserName)) {
                Subclass.Error.create(
                    'Trying to get non registered parser ' +
                    'named "' + parserName + '"'
                );
            }
            return this._parsers[parserName];
        },

        /**
         * Checks whether parser width specified name exists
         *
         * @param {string} parserName
         * @returns {boolean}
         */
        isset: function(parserName)
        {
            return this._parsers.hasOwnProperty(parserName);
        },

        /**
         * Removes parser from parser manager by its name
         *
         * @param {string} parserName
         */
        remove: function(parserName)
        {
            delete this._parsers[parserName];
        },

        /**
         * Parses string value
         *
         * @param {string} string
         * @returns {*}
         */
        parse: function(string)
        {
            var parsers = this._parsers;

            for (var parserName in parsers) {
                if (parsers.hasOwnProperty(parserName)) {
                    string = parsers[parserName].parse(string);
                }
            }

            return string;
        }
    };

    return ParserManager;
}();