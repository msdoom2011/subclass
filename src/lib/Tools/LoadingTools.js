Subclass.Tools.LoadingTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Loads and invoke the java script file
         *
         * @param {string} fileName
         *      The path to the requested file
         *
         * @param {(Function|Object)} callback
         *      The callback function. Can be specified in two forms:
         *
         *      1. As an object.
         *         If specified an object it can contain two properties:
         *
         *         before: {Function}
         *
         *         If specified "before" that means the specified callback function
         *         will be invoked after the file will loaded but before
         *         it will be invoked.
         *
         *         after: {Function}
         *
         *         If specified "after" that means the specified callback function
         *         will be invoked after the file will loaded and invoked.
         *
         *      2. As a function.
         *         If specified function, it will be invoked immediately
         *         after file was loaded and invoked.
         *         The same as was specified: { "after": function() {...} }
         *
         * @returns {XMLHttpRequest}
         */
        loadJS: function(fileName, callback)
        {
            if (
                callback
                && typeof callback != 'function'
                && !this.isPlainObject(callback)
            ) {
                throw new Error(
                    'Trying to specify not valid callback. ' +
                    'It must be a function.'
                );
            }

            var beforeCallback, afterCallback;

            if (typeof callback == 'function') {
                afterCallback = callback;
            }
            if (typeof callback == 'object') {
                beforeCallback = callback.before;
                afterCallback = callback.after;
            }

            var xmlhttp = new XMLHttpRequest();
            var documentScripts = document.querySelectorAll('script');
            var currentScript = documentScripts[documentScripts.length - 1];

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var script = document.createElement('script');
                    script.setAttribute("type", "text/javascript");
                    script.text = xmlhttp.responseText;

                    if (script.text) {
                        if (currentScript) {
                            if (beforeCallback) {
                                beforeCallback();
                            }
                            currentScript.parentNode.insertBefore(
                                script,
                                currentScript.nextSibling
                            );
                            if (afterCallback) {
                                afterCallback();
                            }
                        }
                    } else {
                        throw new Error('Loading file "' + fileName + '" failed.');
                    }
                } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                    throw new Error('Loading file "' + fileName + '" failed.');
                }
            };

            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();

            return xmlhttp;
        }
    });

    return Subclass.Tools;
})();