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

    pub.clear = function() {
        if (inputEl) {
            inputEl.value = '';
        }
    }
    
    return pub;
})();