/**
 * @mixin
 */
Subclass.Error.Option.Service = (function()
{
    return {

        /**
         * Sets/returns service name
         *
         * @param {string} [service]
         * @returns {Subclass.Error}
         */
        service: function(service)
        {
            if (!arguments.length) {
                return this._service;
            }
            if (service && typeof service != 'string') {
                throw new Error('Specified invalid service name. It must be a string.');
            }
            this._service = service;

            return this;
        },

        /**
         * Checks whether the service option was specified
         *
         * @returns {boolean}
         */
        hasService: function()
        {
            return this._service !== undefined;
        }
    };
})();