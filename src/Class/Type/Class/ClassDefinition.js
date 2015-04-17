/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Class.ClassDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ClassDefinition(classInst, classDefinition)
    {
        ClassDefinition.$parent.call(this, classInst, classDefinition);
    }

    ClassDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Validates "$_static" attribute value
     *
     * @param {*} value
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateStatic = function(value)
    {
        if (value !== null && !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidClassOption')
                .option('$_static')
                .className(this.getClass().getName())
                .received(value)
                .expected('a plain object or null')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_static" attribute value
     *
     * @param {Object} value Plain object with different properties and methods
     */
    ClassDefinition.prototype.setStatic = function(value)
    {
        this.validateStatic(value);
        this.getData().$_static = value || {};

        if (value) {
            this.getClass().addStaticProperties(value);
        }
    };

    /**
     * Returns "$_static" attribute value
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.getStatic = function()
    {
        return this.getData().$_static;
    };

    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.createBaseData = function ()
    {
        var classDefinition = ClassDefinition.$parent.prototype.createBaseData();

        /**
         * Static properties and methods for current class constructor
         *
         * @type {Object}
         */
        classDefinition.$_static = {};

        /******************************************************************/
        /********************** SUBCLASS PROPERTY *************************/
        /******************************************************************/
        //
        ///**
        // * Returns the property instance based on specified data type.
        // *
        // * @param {(string|{type:{string}})} dataType
        // * @returns {Subclass.Property.PropertyAPI}
        // * @private
        // */
        //classDefinition._getDataTypeProperty = function(dataType)
        //{
        //    var classManager = this.getClassManager();
        //    var propertyManager = classManager.getModule().getPropertyManager();
        //    var property;
        //
        //    if (
        //        dataType &&
        //        typeof dataType == 'object'
        //        && dataType.type &&
        //        typeof dataType.type == 'string'
        //    ) {
        //        return propertyManager.createProperty('test', dataType).getAPI(this);
        //
        //    } else if (!dataType || typeof dataType != 'string') {
        //        Subclass.Error.create("InvalidArgument")
        //            .argument('the data type', false)
        //            .received(dataType)
        //            .expected('a string')
        //            .apply()
        //        ;
        //    }
        //
        //    if (this.issetProperty(dataType)) {
        //        property = this.getProperty(dataType);
        //
        //    } else {
        //        var dataTypeManager = propertyManager.getDataTypeManager();
        //
        //        if (dataTypeManager.issetType(dataType)) {
        //            property = dataTypeManager.getType(dataType).getAPI(this);
        //        }
        //    }
        //    if (!property) {
        //        Subclass.Error.create(
        //            'Specified non existent or data type which ' +
        //            'can\'t be used in data type validation.'
        //        );
        //    }
        //    return property;
        //};
        //
        ///**
        // * Validates and returns default value if the value is undefined
        // * or returns the same value as was specified if it's valid
        // *
        // * @param {(string|{type:{string}})} dataType
        // * @param {*} value
        // * @param {*} [valueDefault]
        // * @returns {*}
        // */
        //classDefinition.value = function(dataType, value, valueDefault)
        //{
        //    var property = this._getDataTypeProperty(dataType);
        //    dataType = typeof dataType == 'object' ? dataType.type : dataType;
        //
        //    if (value === undefined && arguments.length == 3) {
        //        return valueDefault;
        //
        //    } else if (value === undefined) {
        //        return property.getDefaultValue();
        //
        //    } else if (!property.isValueValid(value)) {
        //        Subclass.Error.create(
        //            'Specified invalid value that is not corresponds to data type "' + dataType + '".'
        //        );
        //    }
        //
        //    return value;
        //};
        //
        ///**
        // * Validates and returns (if valid)
        // * @param dataType
        // * @param value
        // */
        //classDefinition.result = function(dataType, value)
        //{
        //    var property = this._getDataTypeProperty(dataType);
        //    dataType = typeof dataType == 'object' ? dataType.type : dataType;
        //
        //    if (!property.isValueValid(value)) {
        //        Subclass.Error.create(
        //            'Trying to return not valid value that is not corresponds to data type "' + dataType + '".'
        //        );
        //    }
        //    return value;
        //};
        /******************************************************************/
        /********************** SUBCLASS PROPERTY *************************/
        /******************************************************************/

        return classDefinition;
    };

    return ClassDefinition;
})();