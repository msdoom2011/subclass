Subclass.Extension = function()
{
    function Extension(classInst)
    {
        // Do nothing
    }

    Extension.$parent = null;

    /**
     * Instance of any class which extends Subclass.Extendable class
     *
     * @param {Subclass.Extendable} classInst
     */
    Extension.initialize = function(classInst)
    {
        // Do some initialization operations
    };

    return Extension;
}();