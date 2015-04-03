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
     * Returns tha name of SubclassJS plugin
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
     * Returns list of SubclassJS plugin names which is needed by current plugin
     */
    SubclassPlugin.getDependencies = function()
    {
        return [];
    };

    return SubclassPlugin;
}();