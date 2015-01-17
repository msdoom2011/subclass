app.registerClass('Logger/Logger', {

    $_implements: ['Subclass/Service/TaggableInterface'],

    $_constructor: function(mode)
    {
        console.log('constructor call:', mode);
    },

    _bugs: [],

    setPsix: function(mode, psix)
    {
        console.log('method call:');
        console.log('-', mode);
        console.log('-', psix);
    },

    addBug: function(bug)
    {
        this._bugs.push(bug);
    },

    getBugs: function()
    {
        return this._bugs;
    },

    processTaggedServices: function(taggedServices)
    {
        for (var i = 0; i < taggedServices.length; i++) {
            var serviceClass = app.getClass(taggedServices[i].getClassName());

            if (!serviceClass.isImplements('Logger/BugInterface')) {
                continue;
            }

            this.addBug(serviceClass.createInstance());
        }
    }
});
