/**
 * @class
 * @constructor
 * @description
 *
 * The class which allows to load different module files,
 * especially it's actual for loading module classes
 *
 * @throws {Error}
 *      Throws error if specified invalid instance of module
 *
 * @param {Subclass.Module.Module} module
 *      The instnace of module
 */
Subclass.Module.LoadManager = (function()
{
    function LoadManager(module)
    {
        if (!module || !(module instanceof Subclass.Module.Module)) {
            Subclass.Error.create('InvalidError')
                .argument('the module instance', false)
                .received(module)
                .expected('an instance of Subclass.Module.Module class')
                .apply()
            ;
        }

        /**
         * The instance of module
         *
         * @type {Subclass.Module.Module}
         */
        this._module = module;

        /**
         * Stack of files that are loading at the moment
         *
         * @type {Array}
         * @private
         */
        this._stack = [];

        /**
         * Checks whether the loading process continues
         *
         * @type {boolean}
         * @private
         */
        this._loading = false;

        /**
         * Reports that loading was paused
         *
         * @type {boolean}
         * @private
         */
        this._loadingPause = false;

        /**
         * Reports that loading is locked
         *
         * @type {boolean}
         * @private
         */
        this._loadingLocked = true;

        /**
         * The timeout after which the loading will be started
         *
         * @type {(*|null)}
         * @private
         */
        this._loadingStartTimeout = null;

        /**
         * The timeout after which the ready callback will be called
         *
         * @type {(*|null)}
         * @private
         */
        this._loadingEndTimeout = null;

        /**
         * The timeout after which the classes in load stack will start loading
         *
         * @type {(*|null)}
         * @private
         */
        this._addToStackTimeout = null;
    }

    /**
     * Initializes instance of load manager
     *
     * @method initialize
     * @memberOf Subclass.Module.LoadManager.prototype
     */
    LoadManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var eventManager = module.getEventManager();
        var $this = this;

        // Unlock loading of module files after the module was created

        eventManager.getEvent('onModuleInit').addListener(function() {
            if (module.isRoot()) {
                $this.unlockLoading();
            }
        });

        // Unlocking loading files of plug-in modules after the files
        // of current module (to which the current one instance of load manager belongs) were fully loaded

        eventManager.getEvent('onLoadingEnd').addListener(100, function() {
            module.getModuleManager().eachModule(function(module) {
                module.getLoadManager().unlockLoading();
            });
        });
    };

    /**
     * Returns the instance of module to which current instance of load manager belongs
     *
     * @method getModule
     * @memberOf Subclass.Module.LoadManager.prototype
     *
     * @returns {Subclass.Module.Module}
     */
    LoadManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Locks the process of loading files with new classes
     *
     * @method lockLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.lockLoading = function()
    {
        this._loadingLocked = true;
    };

    /**
     * Unlocks and starts the process of loading files with new classes
     *
     * @method unlockLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.unlockLoading = function()
    {
        if (this.getModule().getConfigManager().hasFiles()) {
            return;
        }
        if (!this.isLoadingLocked()) {
            return;
        }
        this._loadingLocked = false;
        this.startLoading();
        this.completeLoading();
    };

    /**
     * Reports whether the process of loading files with new classes is locked
     *
     * @method isLoadingLocked
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isLoadingLocked = function()
    {
        return this._loadingLocked;
    };

    /**
     * Starts the process of loading files with new classes
     *
     * @method startLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.startLoading = function()
    {
        clearTimeout(this._loadingStartTimeout);
        var $this = this;

        if (this.isLoadingLocked()) {
            return;
        }

        this._loadingStartTimeout = setTimeout(function() {
            $this._loading = true;
            $this._loadingPause = false;
            $this.processStack();

            if ($this.isStackEmpty()) {
                $this.completeLoading();
            }
        }, 2);
    };

    /**
     * Pauses the process of loading files with new classes
     *
     * @method pauseLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.pauseLoading = function()
    {
        clearTimeout(this._loadingEndTimeout);
        this._loadingPause = true;
    };

    /**
     * Reports whether the process of loading files with new classes was paused
     *
     * @method isLoadingPaused
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isLoadingPaused = function()
    {
        return this._loadingPause;
    };

    /**
     * Tries to complete the process of loading files with new classes.
     * If it was completed then will be triggered the appropriate event.
     *
     * @method completeLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.completeLoading = function()
    {
        if (!this.isLoading()) {
            return;
        }
        clearTimeout(this._loadingEndTimeout);
        var $this = this;

        if (
            !this.isLoadingPaused()
            && this.isStackEmpty()
        ) {
            this._loadingEndTimeout = setTimeout(function() {
                $this.getModule().getEventManager().getEvent('onLoadingEnd').triggerPrivate();
                $this._loading = false;
            }, 10);
        }
    };

    /**
     * Checks whether the loading process continues
     *
     * @method isLoading
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isLoading = function()
    {
        return this._loading;
    };

    /**
     * Adds the new class to load stack
     *
     * @method addToStack
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @param {string} fileName
     *      The name of file relative to the "rootPath" module config option. (^ - for specifying the absolute path)
     *
     * @param {function} [callback]
     *      The callback function which will be invoked after file will be loaded
     */
    LoadManager.prototype.addToStack = function(fileName, callback)
    {
        var $this = this;

        if (callback && typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        if (this.isInStack(fileName)) {
            return;
        }

        this._stack.push({
            file: fileName,
            callback: callback || function() {},
            xmlhttp: null
        });

        clearTimeout(this._addToStackTimeout);

        this._addToStackTimeout = setTimeout(function() {
            if (!$this.isLoadingLocked()) {
                $this.startLoading();
            }
        }, 10);
    };

    /**
     * Removes specified class from the load stack
     *
     * @method removeFromLoadStack
     * @memberOf Subclass.Class.ClassManager.prototype
     *
     * @param {string} fileName
     *      The name of class
     */
    LoadManager.prototype.removeFromStack = function(fileName)
    {
        var stackItem;
        var stackItemIndex;

        for (var i = 0; i < this._stack.length; i++) {
            if (this._stack[i].file == fileName) {
                stackItem = this._stack[i];
            }
        }
        if (!stackItem) {
            return;
        }

        if (stackItem.xmlhttp) {
            stackItem.xmlhttp.abort();
        }
        this._stack.splice(stackItemIndex, 1);
    };

    /**
     * Processes the classes from load stack
     *
     * @method processStack
     * @memberOf Subclass.Class.LoadManager.prototype
     */
    LoadManager.prototype.processStack = function()
    {
        var moduleConfigs = this.getModule().getConfigManager();
        var rootPath = moduleConfigs.getRootPath();
        var $this = this;

        if (this.isLoadingPaused()) {
            return;
        }
        if (!this.isStackEmpty()) {
            this.pauseLoading();
        }

        for (var fileName in this._stack) {
            if (!this._stack.hasOwnProperty(fileName)) {
                continue;
            }
            //if (this.issetClass(className)) {
            //    this.removeFromStack(className);
            //}

            if (!fileName.match(/^\^/i)) {
                fileName = rootPath + fileName;

            } else {
                fileName = fileName.substr(1);
            }
        }

        var stackLength = this._stack.length;

        !function loadCallback(stackItem) {
            stackItem.xmlhttp = Subclass.Tools.loadJS(stackItem.file, function() {
                stackItem.callback();
                stackLength--;

                if (stackLength) {
                    loadCallback($this._stack.shift())
                } else {
                    $this.startLoading();
                }
            });
        }(this._stack.shift());
    };

    /**
     * Checks whether the specified files is in load stack
     *
     * @method isInStack
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @param {string} fileName
     *      The name of file
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isInStack = function(fileName)
    {
        for (var i = 0; i < this._stack.length; i++) {
            if (this._stack[i].file == fileName) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks whether the load stack is empty
     *
     * @method isStackEmpty
     * @memberOf Subclass.Class.LoadManager.prototype
     *
     * @returns {boolean}
     */
    LoadManager.prototype.isStackEmpty = function()
    {
        return !this._stack.length;
    };

    return LoadManager;

})();