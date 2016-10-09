/****************************
 *         Core.js
 ***************************/

// Bring in the specialized modules.
const Input = require('./input');
const Inventory = require('./inventory');
const Scene = require('./scene');

// Utils
const ensureNode = require('./utils/ensurenode.js');

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