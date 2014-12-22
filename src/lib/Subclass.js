window.Subclass = (function()
{
    return {
        /**
         * Creates new application.
         * Each application can contain its own private set of classes.
         *
         * @param {Object} [configs]
         * @returns {ClassManager}
         */
        newApp: function(configs)
        {
            return Subclass.ClassManager.create(configs);
        }
    };
})();