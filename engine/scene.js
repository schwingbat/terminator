/******************************
 *      --- Scene.js ---
 *****************************/

// Handles the scene list and transitions between scenes.

const Input = require('./input');

module.exports = (function() {
    let sceneTree = {};
    let activeScene = {
        name: null,
        data: null
    }
    let textEl = null;
    let config = {};

    // For controls
    let commands = {};
    let aliases = [];
    
    Input.onInput(function(val) {
        console.log(`Listener on Scene received "${val}"`);

        // Check if there is an action for the entered value and run it if there is. 
        if (commands[val]) {
            console.log('There is an action for '+val);
            commands[val]();
            Input.clear();
        } else {
            // Show some kind of message to the player here.
            Input.clear();
            console.log('No action found');
        }
    });

    function _parseCommands() {
        // Turn the command syntax into proper callable functions.

        commands = {};
        aliases = [];

        const c = activeScene.data.commands;

        for (let key in c) {
            const str = c[key].trim();
            
            if (str[0] === '(' && str[str.length - 1] === ')') {
                // Is surrounded by parens, so is valid function syntax

                // Strip parens and split white space to get function name and param
                const str2 = str.replace(/\(|\)/g, '').split(' ');

                // Check function name
                switch(str2[0]) {
                case 'section':
                    commands[key] = s.changeSection.bind(null, str2[1]);
                    break;
                case 'scene':
                    // Look for scene by alias:
                    const sc = activeScene.data.scenes;
                    let sceneName = str2[1];
                    for (let s in sc) {
                        // If scene exists in scenes object,
                        // get its real name.
                        if (s === str2[1]) {
                            sceneName = sc[s];
                            console.log(`"${sc[s]}" is in scene list as "${s}"`);
                            break;
                        }
                    }
                    // Pass two params to specify a section in a scene
                    // to jump into like (scene bathroom subscene)
                    commands[key] = s.changeScene.bind(null, sceneName, str2[2]);
                    break;
                default:
                    break;
                }
            }
        }

        console.log('parsed', c, 'into', commands);
    }

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

            _parseCommands();
            
            //console.log(section, name);
            if (activeScene.data.sections[section]) {
                _printSection(section);
            }
            
            _runCallbacks(listeners, [name, section]);
        } else {
            throw Error(`Scene "${name}" does not exist!`);
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