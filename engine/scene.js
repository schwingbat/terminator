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