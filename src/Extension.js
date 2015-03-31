Subclass.Extension = function()
{
    function Extension(classInst)
    {
        // Do nothing
    }

    Extension.$parent = null;

    //Extension.addStaticMethods = function()
    //{
        /**
         * Instance of any class which extends Subclass.Extendable class
         *
         * @param {Subclass.Extendable} classInst
         */
        this.initialize = function(classInst)
        {
            // Do some initialization operations
        };
    //};
    //
    //if (Extension.$parent && Extension.$parent.addStaticMethods) {
    //    Extension.$parent.addStaticMethods.call(Extension);
    //}
    //
    ///**
    // * Adding static methods and properties
    // */
    //Extension.addStaticMethods();

    return Extension;
}();