
app.registerAbstractClass("Logger/BugAbstract", {

    $_implements: ["Logger/BugInterface"],

    getName: function()
    {
        return this._name;
    },

    getMessage: function()
    {
        return this._message;
    }
});
