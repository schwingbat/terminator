/****************************
 *         Core.js
 ***************************/

// Bring in the specialized modules.
const Input = require('./input')
const Inventory = require('./inventory')
const Scene = require('./scene')

// Utils
const ensureNode = require('./utils/ensurenode.js')

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

	// Set up HTML

	function _setup() {
		const root = config.root
		root.classList.add('tm-container')

		while (root.children.length > 0) {
			root.removeChild(root.children[0])
		}

		const text = elements.textbox = document.createElement('div')
		text.classList.add('tm-gametext')
		root.appendChild(text)

		const inputcont = document.createElement('div')
		inputcont.classList.add('tm-userinput-container')
		root.appendChild(inputcont)

		const input = elements.input = document.createElement('span')
		input.classList.add('tm-userinput')
		input.style.whiteSpace = 'pre'
		inputcont.appendChild(input)

		const cursor = elements.cursor = document.createElement('span')
		cursor.classList.add('tm-cursor')
		inputcont.appendChild(cursor)
	}


    /*********************
     * Private Methods
     ********************/

    function _init(game) {
        // Intialize engine components and start the game.
		_setup()

        // Set up Input object targeting the input element we just created.
        Input.init(elements.input, config)
        Scene.init(elements.textbox, game, config)
    }

    Input.onInput(function(val) {
        // This callback runs when some input is submitted.

        console.log('Listener on Core received input of ', val)
    })


    /*********************
     * Public Methods
     ********************/

    const tm = {}

    tm.load = function(game) {
        if (!game) {
            throw Error('Cannot .load() without a game to load!')
        }

        let gameData = null;

        if (typeof game === "object") {
            if (game.hasOwnProperty('game') && game.hasOwnProperty('scenes')) {
                gameData = game;
                console.log('Loading '+game.game.title);
            }
        }

        console.log(gameData)
        state.game = game
        _init(gameData)
    }

    tm.config = function(props) {
        console.log('Configuring with', props)

		console.log(props)

        // Make sure config is an object.
        if (typeof props === 'object' && !Array.isArray(props)) {

            // Loop through and overwrite old config with new properties.
            for (let i in props) {
                // If user passes in a string, grab the DOM node.
                config[i] = (i === 'root')
                    ? ensureNode(props[i])
                    : props[i]
            }
        } else {
            throw Error('.config() requires an object as the only parameter.')
        }
    }

    // Define Terminator on window.
    if (window) {
        window.Terminator = tm
    }
})();
