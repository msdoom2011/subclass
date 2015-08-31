app.registerClass('App/EventableClass', {

    $_implements: ['Subclass/Event/EventableInterface'],

    $_traits: ['Subclass/Event/EventableTrait'],

    $_constructor: function()
    {
        this
            .registerEvent('foo')
            .registerEvent('bar')
        ;
    }
});