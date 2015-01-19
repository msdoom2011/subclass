/**
 * @class
 */
Subclass.Class.ClassManager.registerClass("Interface", "Subclass/Service/TaggableInterface", {

    /**
     * Processes tagged services in the way it needs
     *
     * @param {Array} taggedServices Array of class instances
     */
    processTaggedServices: function(taggedServices) {},

    /**
     * Allows to add and process the new tagged service
     *
     * @param {Object} taggedService An instance of some class
     */
    addTaggedService: function(taggedService) {}

});