/**
 * @param {string} methodName
 * @param {boolean} [isStatic = false]
 */
Subclass.Exception.AbstractMethod = function(methodName, isStatic)
{
    if (isStatic !== true) {
        isStatic = false;
    }
    throw new Error(
        'The  ' + (isStatic && 'static ') + 'method"' + methodName + '" is ' +
        'abstract and must be implemented'
    );
};