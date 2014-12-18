; Subclass.PropertyManager.PropertyTypes.Mixed = (function()
{
    /*************************************************/
    /*       Describing property type "Mixed"        */
    /*************************************************/

    /**
     * @param {PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function MixedType(propertyManager, propertyName, propertyDefinition)
    {
        MixedType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
        this._allowedTypes = [];
    }

    MixedType.$parent = Subclass.PropertyManager.PropertyTypes.PropertyType;

    /**
     * @inheritDoc
     */
    MixedType.getPropertyTypeName = function()
    {
        return "mixed";
    };

    /**
     * Returns definitions of all allowed value types
     *
     * @returns {Object[]}
     */
    MixedType.prototype.getAllows = function()
    {
        return this.getPropertyDefinition().allows;
    };

    /**
     * Returns all allowed value types according to allows parameter of property definition.
     *
     * @returns {string[]}
     */
    MixedType.prototype.getAllowedTypeNames = function()
    {
        var allows = this.getAllows();
        var typeNames = [];

        for (var i = 0; i < allows.length; i++) {
            typeNames.push(allows[i].type);
        }
        return typeNames;
    };

    /**
     * Returns property instances according to allows parameter of property definition.
     *
     * @returns {PropertyType[]}
     */
    MixedType.prototype.getAllowedTypes = function()
    {
        return this._allowedTypes;
    };

    MixedType.prototype.addAllowedType = function(typeDefinition)
    {
        this._allowedTypes.push(this.getPropertyManager().createProperty(
            "mixedProperty",
            typeDefinition,
            this.getContextClass(),
            this.getContextProperty()
        ));
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.validate = function(value)
    {
        var allowedTypes = this.getAllowedTypes();
        var error = true;

        for (var i = 0; i < allowedTypes.length; i++) {
            var allowedType = allowedTypes[i];

            try {
                allowedType.validate(value);
                error = false;
                break;

            } catch (e) {
                // Do nothing
            }
        }
        if (error) {
            var allowedTypeNames = this.getAllowedTypeNames();

            var message = 'The value of the property "' + this.getPropertyNameFull() + '" is not valid ' +
                'and must belongs to one of the specified types [' + allowedTypeNames.join(", ") + ']' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". ";

            if (value && typeof value == 'object' && value.$_className) {
                message += 'Instance of class "' + value.$_className + '" was received instead.';

            } else if (value && typeof value == 'object') {
                message += 'Object with type "' + value.constructor.name + '" was received instead.';

            } else if (value === null) {
                message += 'null value was received instead.';

            } else {
                message += 'Value with type "' + (typeof value) + '" was received instead.';
            }
            throw new Error(message);
        }
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.getBasePropertyDefinition = function()
    {
        var basePropertyDefinition = MixedType.$parent.prototype.getBasePropertyDefinition.call(this);

        /**
         * Allows to specify allowed types of property value.
         * Every value in array must be property definition of needed type
         *
         * @type {Object[]}
         */
        basePropertyDefinition.allows = null;

        return basePropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.processPropertyDefinition = function()
    {
        MixedType.$parent.prototype.processPropertyDefinition.call(this);

        var allows = this.getAllows();

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                if (!Subclass.Tools.isPlainObject(allows[i])) {
                    continue;
                }
                this.addAllowedType(allows[i]);
            }
        }
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.validatePropertyDefinition = function()
    {
        var allows = this.getAllows();

        if (!allows) {
            throw new Error('Missed "allows" parameter in definition ' +
                'of mixed type property "' + this.getPropertyNameFull() + '"' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ".");
        }
        if (!Array.isArray(allows) || !allows.length) {
            throw new Error('Specified not valid "allows" parameter in definition ' +
                'of property "' + this.getPropertyNameFull() + '" ' +
                (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". " +
                'It must be a not empty array with definitions of needed property types.');
        }
        for (var i = 0; i < allows.length; i++) {
            if (!Subclass.Tools.isPlainObject(allows[i])) {
                throw new Error('Specified not valid values in "allows" parameter in definition ' +
                    'of property "' + this.getPropertyNameFull() + '" ' +
                    (this.getContextClass() ? (' in class "' + this.getContextClass().getClassName() + '"') : "") + ". " +
                    'It must property definitions.');
            }
        }

        MixedType.$parent.prototype.validatePropertyDefinition.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.PropertyManager.registerPropertyType(MixedType);

    return MixedType;

})();