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