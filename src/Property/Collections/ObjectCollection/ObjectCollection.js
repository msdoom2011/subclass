; ClassManager.PropertyManager.PropertyTypes.ObjectCollection.Collection = (function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function ObjectCollection(property)
    {
        ObjectCollection.$parent.call(this, property);
    }

    ObjectCollection.$parent = ClassManager.PropertyManager.PropertyTypes.CollectionType.Collection;

    return ObjectCollection;

})();