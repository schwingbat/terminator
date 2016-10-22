/******************************
 *      --- Input.js ---
 *****************************/

// Handle user input and parsing

module.exports = (function() {

    let inputEnabled = true
    let inputEl = null
	let cursorEl = null
    let config = null

    const callbacks = []

	const allowed = 'abcdefghijklmnopqrstuvwxyz1234567890`~!@#$%^&*()_-+=[]{}\\|;:\'",<.>/? '
	function isValidChar(ch) {
		ch = ch.toLowerCase()

		for (let i = 0; i < allowed.length; i++) {
			if (allowed[i] === ch) {
				return true
			}
		}

		return false
	}

	function animateCursor() {
		console.warn('Cursor will animate!')

		//requestAnimationFrame(animateCursor)
	}

    const pub = {}

    pub.init = function(elem, masterConfig) {
        inputEl = elem
		cursorEl = document.querySelector('.tm-cursor') || null
        config = masterConfig

		if (cursorEl) {
			animateCursor()
		}

        window.addEventListener('keydown', function(e) {
			//console.log(e.which);
            if (inputEnabled) {
                switch(e.key) {
                    case 'Enter':
                        for (let i = 0; i < callbacks.length; i++) {
                            callbacks[i](inputEl.textContent)
                        }
                        break
                    case 'Escape':
                        inputEl.textContent = ''
                        break
					case 'Backspace':
						inputEl.textContent = inputEl.textContent.slice(0, inputEl.textContent.length - 1)
						break
                    default:
						if (isValidChar(e.key)) {
							inputEl.textContent += e.key.toUpperCase()
						}
                        break
                }

                // if (config.keySounds) {
                //     console.log('click')
                // }
            }
        });
    };

    pub.onInput = function(callback) {
        // Register callback which fires every time text input happens.

        for (let i = 0; i < callbacks.length; i++) {
            if (callbacks[i] === callback) {
                console.warn('Did not add callback because it\'s already in the list')
                return
            }
        }

        callbacks.push(callback);
    };

    pub.clear = function() {
        if (inputEl) {
            inputEl.textContent = ''
        }
    }

    return pub
})()
