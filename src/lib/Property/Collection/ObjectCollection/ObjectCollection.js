/**
 * @class
 * @extends {Subclass.Property.Collection.Collection}
 */
Subclass.Property.Collection.ObjectCollection.ObjectCollection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ObjectCollection(property)
    {
        ObjectCollection.$parent.call(this, property);
    }

    ObjectCollection.$parent = Subclass.Property.Collection.Collection;

    return ObjectCollection;

})();