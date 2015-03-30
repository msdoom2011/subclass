Subclass.Class.ClassTypeAddon = function()
{
    function ClassTypeAddon(classInst)
    {
        // Do nothing
    }

    ClassTypeAddon.addStaticMethods = function()
    {
        this.$parent = null;

        this.initialize = function(classInst)
        {
            if (!classInst || !(classInst instanceof Subclass.Class.ClassType)) {
                Subclass.Error.create("InvalidArgument")
                    .argument('the instance of class', false)
                    .expected('an instance of class "Subclass.Class.ClassType"')
                    .received(classInst)
                    .apply()
                ;
            }

            // Do some initialization operations
        }
    };

    /**
     * Adding static methods and properties
     */
    ClassTypeAddon.addStaticMethods();

    return ClassTypeAddon;
}();