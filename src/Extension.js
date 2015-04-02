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