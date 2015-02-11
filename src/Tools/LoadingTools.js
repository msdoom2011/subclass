Subclass.Tools.LoadingTools = (function()
{
    Subclass.Tools.extend(Subclass.Tools, {

        /**
         * Loads, embeds and invoke the java script file
         *
         * @method loadJS
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} fileName
         *      The path to the requested file
         *
         * @param {(Function|Object)} callback
         * <pre>
         * The callback function. It can be specified in two forms:
         *
         * 1. As an object.
         *    It can contains two properties (either one or even two at once):
         *
         *    before: {Function}
         *
         *    If specified "before" that means the specified callback function
         *    will be invoked after the file will loaded but before
         *    it will be invoked.
         *
         *    after: {Function}
         *
         *    If specified "after" that means the specified callback function
         *    will be invoked after the file will loaded and invoked.
         *
         * 2. As a function.
         *    If specified function, it will be invoked immediately after
         *    file was loaded and its contained JS was performed.
         *
         *    It is the same if you had specified: { "after": function() {...} }
         * </pre>
         *
         * @returns {XMLHttpRequest}
         */
        loadJS: function(fileName, callback)
        {
            var callbacks = _processLoadArguments(fileName, callback);
            var xmlhttp = new XMLHttpRequest();
            var documentScripts = document.querySelectorAll('script');
            var currentScript = documentScripts[documentScripts.length - 1];

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //console.log(fileName);
                    var script = document.createElement('script');
                    script.setAttribute("type", "text/javascript");
                    script.text = xmlhttp.responseText;

                    if (script.text) {
                        if (currentScript) {
                            if (callbacks.beforeCallback) {
                                callbacks.beforeCallback();
                            }
                            currentScript.parentNode.insertBefore(
                                script,
                                currentScript.nextSibling
                            );
                            if (callbacks.afterCallback) {
                                callbacks.afterCallback();
                            }
                        }
                    } else {
                        Subclass.Error.create('Loading file "' + fileName + '" failed.');
                    }

                } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                    Subclass.Error.create('Loading file "' + fileName + '" failed.');
                }
            };

            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();

            return xmlhttp;
        },

        /**
         * Loads and embeds css file
         *
         * @method loadCSS
         * @memberOf Subclass.Tools
         * @static
         *
         * @param {string} fileName
         *      The path to the requested file
         *
         * @param {(Function|Object)} callback
         *      The callback function. See more details in {@link Subclass.Tools#loadJS}
         *
         * @returns {XMLHttpRequest}
         */
        loadCSS: function(fileName, callback)
        {
            var callbacks = _processLoadArguments(fileName, callback);
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var script = document.createElement('script');
                    script.setAttribute("type", "text/javascript");
                    script.text = xmlhttp.responseText;

                    if (script.text) {
                        if (callbacks.beforeCallback) {
                            callbacks.beforeCallback();
                        }
                        window.document.getElementsByTagName("HEAD")[0].appendChild(script);

                        if (callbacks.afterCallback) {
                            callbacks.afterCallback();
                        }
                    } else {
                        Subclass.Error.create('Loading file "' + fileName + '" failed.');
                    }
                } else if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
                    Subclass.Error.create('Loading file "' + fileName + '" failed.');
                }
            };

            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();

            return xmlhttp;
        }
    });

    /**
     * Processes the load file arguments and returns callback functions
     *
     * @param {string} fileName
     *      The name of file. It is needed for generating user-friendly
     *      error message if something went wrong.
     *
     * @param {Function} [callback]
     *      The one ore two callback functions depending on type of
     *      specified argument.
     *
     * @returns {{
     *      afterCallback: {(Function|undefined)},
     *      beforeCallback: {(Function|undefined)}
     * }}
     * @private
     */
    function _processLoadArguments(fileName, callback)
    {
        if (!fileName || typeof fileName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of file', false)
                .received(fileName)
                .expected('a string')
                .apply()
            ;
        }
        if (
            callback
            && typeof callback != 'function'
            && !this.isPlainObject(callback)
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback when trying to load file "' + fileName + '"', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }

        var beforeCallback, afterCallback;

        if (typeof callback == 'function') {
            afterCallback = callback;
        }
        if (typeof callback == 'object') {
            beforeCallback = callback.before;
            afterCallback = callback.after;
        }

        return {
            afterCallback: afterCallback,
            beforeCallback: beforeCallback
        };
    }

    return Subclass.Tools;
})();