Subclass.Parser.ParserAbstract = function()
{
    function ParserAbstract(parserManager)
    {
        if (!parserManager || !(parserManager instanceof Subclass.Parser.ParserManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the parser manager instance', false)
                .expected('an instance of class "Subclass.Parser.ParserManager"')
                .received(parserManager)
                .apply()
            ;
        }
        this._parserManager = parserManager;
    }

    /**
     * Returns name of string parser
     *
     * @returns {string}
     * @abstract
     */
    ParserAbstract.getName = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .className("Subclass.Parser.ParserAbstract")
            .method('getName', true)
            .apply()
        ;
    };

    ParserAbstract.prototype = {

        /**
         * Returns instance of parser manager
         *
         * @returns {Subclass.Parser.ParserManager}
         */
        getParserManager: function()
        {
            return this._parserManager;
        },

        /**
         * Returns subclass module instance
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this.getParserManager().getModule();
        },

        /**
         * Normalizes string
         *
         * @param string
         */
        parse: function(string)
        {
            Subclass.Error.create('NotImplementedMethod')
                .className("Subclass.Parser.ParserAbstract")
                .method('parse')
                .apply()
            ;
        }
    };

    return ParserAbstract;
}();