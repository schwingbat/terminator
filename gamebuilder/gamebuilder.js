'use strict';

// Builds properly structured game content folders into a single
// HTML-linkable game content file.

// Takes your folder as a command line arg
// and builds based on game.yml
// Requires node.

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

function writeToHTML(html, title, theme, engine, game) {
    return html
        .replace('@TITLE', title)
        .replace('@THEME', theme)
        .replace('@ENGINE', engine)
        .replace('@GAME', game);
}

if (args[0]) {
    const gamePath = path.resolve(args[0]);
    
    // First read game.yml
    const manifest = yaml.safeLoad(fs.readFileSync(path.join(gamePath, 'game.yml'), 'utf8'));
    if (!manifest) throw Error('game.yml not found in '+gamePath+'! Please make sure the file exists.');
    
    const scenePath = path.join(gamePath, manifest.scene_path);
    const scenes = fs.readdirSync(scenePath);
    
    const sceneObj = {};
    
    for (let i = 0; i < scenes.length; i++) {
        const p = path.join(scenePath, scenes[i]);
        sceneObj[scenes[i]] = yaml.safeLoad(fs.readFileSync(p, 'utf8'));
    }
    
    const bundle = {
        game: {
            title: manifest.title,
            shortname: manifest.shortname || manifest.title.replace(' ', '').toLowerCase(),
            first_scene: manifest.first_scene,
            developer: manifest.developer,
            game_version: manifest.game_version
        },
        scenes: sceneObj
    }
    
    const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
    const theme = fs.readFileSync(path.join(__dirname, 'themes', 'phosphor.css'), 'utf8');
    const engine = fs.readFileSync('terminator.engine.js', 'utf8');
    
    const newHTML = writeToHTML(template, bundle.game.title, theme, engine, JSON.stringify(bundle));
    
    const bundleName = bundle.game.shortname + '.bundle.html';
    fs.writeFileSync(bundleName, newHTML);
    
    console.log('Saved to '+bundleName);
    
    // First read game.yml
    
} else {
    throw Error('No path given');
}