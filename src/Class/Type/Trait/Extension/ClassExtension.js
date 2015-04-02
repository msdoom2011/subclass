/**
 * @class
 * @constructor
 */
Subclass.Class.Type.Trait.Extension.ClassExtension = function() {

    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Class.ClassExtension;

    /**
     * @inheritDoc
     */
    ClassExtension.$config = {
        classes: ["Class"]
    };

    /**
     * @inheritDoc
     */
    ClassExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getType()) < 0) {
            return false;
        }
        ClassExtension.$parent.initialize.apply(this, arguments);


        // Defining interfaces storage

        classInst.getEvent('onInitialize').addListener(function(evt)
        {
            /**
             * List of interfaces class names
             *
             * @type {Array<Subclass.Class.Type.Trait.Trait>}
             * @private
             */
            this._traits = [];
        });

        // Added ability to return traits in class parents list

        classInst.getEvent('onGetClassParents').addListener(function(evt, classes, grouping)
        {
            var traits = this.getTraits(true);

            function addClassName(classes, className)
            {
                if (classes.indexOf(className) < 0) {
                    classes.push(className);
                }
            }
            for (var i = 0; i < traits.length; i++) {
                var classInst = traits[i];
                var className = classInst.getName();

                if (grouping) {
                    var classType = classInst.getType();

                    if (!classes.hasOwnProperty(classType)) {
                        classes[classType] = [];
                    }
                    addClassName(classes[classType], className);

                } else {
                    addClassName(classes, className);
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var Class = Subclass.Class.Type.Class.Class;

    /**
     * Adds traits
     *
     * @param {Object} traits
     */
    Class.prototype.addTraits = function(traits)
    {
        if (!traits || !Array.isArray(traits)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the traits list', false)
                .expected('an array')
                .received(traits)
                .apply()
            ;
        }
        for (var i = 0; i < traits.length; i++) {
            this.addTrait(traits[i]);
        }
    };

    /**
     * Returns trait names list
     *
     * @throws {Error}
     *
     * @param {boolean} [withInherited=false]
     *      Whether the inherited traits should be returned
     *
     * @returns {Array<Subclass.Class.Trait.Trait>}
     */
    Class.prototype.getTraits = function(withInherited)
    {
        if (withInherited !== true) {
            return this._traits;
        }
        var classManager = this.getClassManager();
        var traits = Subclass.Tools.copy(this._traits);

        for (var i = 0; i < traits.length; i++) {
            var traitParents = traits[i].getClassParents();

            for (var j = 0; j < traitParents.length; j++) {
                traits.push(classManager.getClass(traitParents[j]));
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.getTraits) {
                traits = traits.concat(parent.getTraits(withInherited))
            }
        }
        return traits;
    };

    /**
     * Adds trait class name
     *
     * @param {string} traitName
     * @throws {Error}
     */
    Class.prototype.addTrait = function (traitName)
    {
        var classDefinition = this.getDefinition();

        if (!traitName || typeof traitName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of trait", false)
                .received(traitName)
                .expected("a string")
                .apply()
            ;
        }
        var traitClass = this.getClassManager().getClass(traitName);
        var traitClassDefinition = traitClass.getDefinition();
        //var traitClassProperties = traitClass.getProperties();
        var traitProps = {};

        traitClass.addChildClass(this.getName());

        if (traitClass.constructor != Subclass.Class.Type.Trait.Trait) {
            Subclass.Error.create(
                'Trying add to "$_traits" option ' +
                'the new class "' + traitName + '" that is not a trait.'
            );
        }

        //for (var propName in traitClassProperties) {
        //    if (!traitClassProperties.hasOwnProperty(propName)) {
        //        continue;
        //    }
        //    var property = traitClassProperties[propName];
        //    this.addProperty(propName, property.getDefinition().getData());
        //}

        // Copying all static properties to current class

        this.extendStaticProperties(traitClass);
        this.getTraits().push(traitClass);

        // Copying all properties and methods (with inherited) from trait to class definition

        Subclass.Tools.extend(traitProps, traitClassDefinition.getNoMethods(true));
        Subclass.Tools.extend(traitProps, traitClassDefinition.getMethods(true));

        classDefinition.setData(Subclass.Tools.extend(
            traitProps,
            classDefinition.getData()
        ));
    };

    /**
     * Checks if current class has specified trait class name
     *
     * @param {string} traitName
     * @returns {boolean}
     * @throws {Error}
     */
    Class.prototype.hasTrait = function (traitName)
    {
        if (!traitName || typeof traitName != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of trait', false)
                .received(traitName)
                .expected('a string')
                .apply()
            ;
        }
        var traits = this.getTraits();

        for (var i = 0; i < traits.length; i++) {
            if (traits[i].isInstanceOf(traitName)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.hasTrait) {
                return parent.hasTrait(traitName);
            }
        }
        return false;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        Class = Subclass.Tools.buildClassConstructor(Class);

        if (!Class.hasExtension(ClassExtension)) {
            Class.registerExtension(ClassExtension);
        }
    });

    return ClassExtension;
}();