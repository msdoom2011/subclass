/**
 * @class
 * @extends {Subclass.PropertyManager.PropertyTypes.CollectionType.Collection}
 */
Subclass.PropertyManager.PropertyTypes.ObjectCollection.Collection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ObjectCollection(property)
    {
        ObjectCollection.$parent.call(this, property);
    }

    ObjectCollection.$parent = Subclass.PropertyManager.PropertyTypes.CollectionType.Collection;

    return ObjectCollection;

})();