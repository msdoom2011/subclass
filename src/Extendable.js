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
    this.$extensions = [];

    /**
     * Registers class extension
     *
     * @param {Function} classExtension
     *      The constructor of class extension
     */
    this.registerExtension = function(classExtension)
    {
        this.$extensions.push(classExtension);
    };

    /**
     * Returns all registered extensions
     *
     * @returns {Array.<Function>}
     */
    this.getExtensions = function()
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
    this.hasExtension = function(classExtension)
    {
        return this.$extensions.indexOf(classExtension) >= 0
    };

    return Extendable;
}();