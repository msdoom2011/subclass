/**
 * @param {string} methodName
 * @param {boolean} [isStatic = false]
 */
Subclass.Exception.NonExistentMethod = function(methodName, isStatic)
{
    if (isStatic !== true) {
        isStatic = false;
    }
    throw new Error('Trying to call non existent ' + (isStatic && 'static ') + 'method "methodName".');
};