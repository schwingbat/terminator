/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/****************************
	 *         Core.js
	 ***************************/

	// Bring in the specialized modules.
	const Input = __webpack_require__(1);
	const Inventory = __webpack_require__(2);
	const Scene = __webpack_require__(3);

	// Utils
	const ensureNode = __webpack_require__(4);

	// Define the top-level stuff.
	const Terminator = (function() {
	    
	    /*********************
	     * Private Variables
	     ********************/

	    const elements = {
	        textbox: null,
	        input: null
	    }

	    const state = {
	        game: null
	    }
	    
	    const config = {
	        root: document.body, // Root node to attach to
	        
	        textSpeed: 1, // write speed - 0 for instant

	        cursorBlinkSpeed: 1, // if blinking, how fast?
	        cursorBlink: true, // whether to blink or not.
	        
	        keySounds: true,
	    }
	    
	    /*********************
	     * Private Methods
	     ********************/
	     
	    function _init(game) {
	        // Intialize engine components and start the game.
	        
	        const root = config.root;
	        
	        const text = elements.textbox = document.createElement('div');
	        text.classList.add('tm-gametext');
	        
	        const input = elements.input = document.createElement('input');
	        input.setAttribute('type', 'text');
	        input.classList.add('tm-userinput');
	        
	        const inputcont = document.createElement('div');
	        inputcont.classList.add('tm-userinput-container');
	        
	        while (root.children.length > 0) {
	            root.removeChild(root.children[0]);
	        }
	        
	        root.classList.add('tm-container');
	        
	        root.appendChild(text);
	        inputcont.appendChild(input);
	        root.appendChild(inputcont);
	        
	        // Set up Input object targeting the input element we just created.
	        Input.init(input, config);
	        Scene.init(text, game, config);
	    }
	    
	    Input.onInput(function(val) {
	        // This callback runs when some input is submitted.
	        
	        console.log('Listener on Core received input of ', val);
	    });
	    
	    
	    /*********************
	     * Public Methods
	     ********************/
	     
	    const t = {};

	    t.load = function(game) {
	        if (!game) {
	            throw Error('Cannot .load() without a game to load!');
	        }
	        
	        let gameData = null;

	        if (typeof game === "object") {
	            if (game.hasOwnProperty('game') && game.hasOwnProperty('scenes')) {
	                gameData = game;
	                console.log('Loading '+game.game.title);
	            }
	        }
	        
	        console.log(gameData);
	        state.game = game;
	        _init(gameData);
	    }
	    
	    t.config = function(props) {
	        console.log('Configuring with', props);
	        
	        // Make sure config is an object.
	        if (typeof props === 'object' && !Array.isArray(props)) {
	            
	            // Loop through and overwrite old config with new properties.
	            for (let i in props) {
	                // If user passes in a string, grab the DOM node.
	                config[i] = (i === 'root')
	                    ? ensureNode(props[i])
	                    : props[i];
	            }
	        } else {
	            throw Error('.config() requires an object as the only parameter.');
	        }
	    }
	    
	    // Define Terminator on window.
	    if (window) {
	        window.Terminator = t;
	    }
	})();

/***/ },
/* 1 */
/***/ function(module, exports) {

	/******************************
	 *      --- Input.js ---
	 *****************************/

	// Handle user input and parsing

	module.exports = (function() {
	    
	    let inputIsFocused = false;
	    let inputEl = null;
	    let config = null;
	    
	    const callbacks = [];
	    
	    const pub = {};
	    
	    pub.init = function(elem, masterConfig) {
	        inputEl = elem;
	        config = masterConfig;
	        
	        inputEl.addEventListener('focus', () => inputIsFocused = true);
	        inputEl.addEventListener('blur', () => inputIsFocused = false);
	        
	        window.addEventListener('keydown', function(e) {
	            if (inputIsFocused) {
	                switch(e.key) {
	                    case 'Enter':
	                        for (let i = 0; i < callbacks.length; i++) {
	                            callbacks[i](inputEl.value);
	                        }
	                        break;
	                    case 'Escape':
	                        inputEl.value = '';
	                        break;
	                    default:
	                        break;
	                }
	                
	                if (config.keySounds) {
	                    console.log('click');
	                }
	            }
	        });
	    };
	    
	    pub.onInput = function(callback) {
	        // Register callback which fires every time text input happens.
	        
	        for (let i = 0; i < callbacks.length; i++) {
	            if (callbacks[i] === callback) {
	                console.warn('Did not add callback because it\'s already in the list');
	                return;
	            }
	        }
	        
	        callbacks.push(callback);
	    };
	    
	    return pub;
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	/******************************
	 *    --- Inventory.js ---
	 *****************************/

	// Provides an easy way to keep track of
	// what items the player has and retrieve them.

	module.exports = (function() {
	    
	})();

/***/ },
/* 3 */
/***/ function(module, exports) {

	/******************************
	 *      --- Scene.js ---
	 *****************************/

	// Handles the scene list and transitions between scenes.

	module.exports = (function() {
	    let sceneTree = {};
	    let activeScene = {
	        name: null,
	        data: null
	    }
	    let textEl = null;
	    let config = {};
	    
	    function _printSection(name) {
	        activeScene.section = name;
	        
	        if (textEl) {
	            textEl.textContent = activeScene.data.sections[name];
	        }
	        
	        console.log('printing', activeScene.data.sections[name]);
	    }
	    
	    function _runCallbacks(list, params) {
	        for (var i = 0; i < list.length; i++) {
	            list[i].apply(null, params);
	        }
	    }
	    
	    const listeners = [];
	    
	    const s = {};
	    
	    s.init = function(el, gameData, conf) {
	        textEl = el;
	        sceneTree = gameData.scenes;
	        config = conf;
	        
	        s.changeScene(gameData.game.first_scene);
	    }
	    
	    s.changeScene = function(name, section = 'main') {
	        if (sceneTree[name]) {
	            activeScene.name = name;
	            activeScene.data = sceneTree[name];
	            
	            //console.log(section, name);
	            if (activeScene.data.sections[section]) {
	                _printSection(section);
	            }
	            
	            _runCallbacks(listeners, [name, section]);
	        } else {
	            throw Error('Scene '+scene+' does not exist!');
	        }
	    }
	    
	    s.changeSection = function(name) {
	        return s.changeScene(activeScene.name, name);
	    }
	    
	    s.onChange = function(callback) {
	        for (var i = 0; i < sceneListeners.length; i++) {
	            if (sceneListeners[i] === callback) {
	                return false;
	            }
	        }
	        
	        sceneListeners.push(callback);
	    }
	    
	    return s;
	})();

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function(node) {
	    if (typeof node === 'string') {
	        return document.querySelector(node);
	    }
	    return node;
	}

/***/ }
/******/ ]);