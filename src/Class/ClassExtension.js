Subclass.Class.ClassExtension = function()
{
    function ClassExtension()
    {
        ClassExtension.$parent.call(this);
    }

    ClassExtension.$parent = Subclass.Extension;

    ClassExtension.$config = {
        /**
         * Array of names of class types which current extension will applies to
         *
         * @type {Array.<string>}
         */
        classes: []
    };

    return ClassExtension;
}();