'use strict';

// Builds properly structured game content folders into a single
// HTML-linkable game content file.

// Takes your folder as a command line arg
// and builds based on game.yml
// Requires node.

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const args = process.argv.slice(2);

function writeToHTML(html, title, theme, engine, game) {
    return html
        .replace('@TITLE', title)
        .replace('@THEME', theme)
        .replace('@ENGINE', engine)
        .replace('@GAME', game);
}

if (args[0]) {
    const gamePath = path.resolve(args[0]);
	// Specify engine files to bundle the game with.
	const engineDir = args[1] ? path.resolve(args[1]) : __dirname;
	// Write to specified output folder, or the __dirname if none specified.
	const outputDir = args[2] ? path.resolve(args[2]) : __dirname;

    // First read game.yml
    const manifest = yaml.safeLoad(fs.readFileSync(path.join(gamePath, 'game.yml'), 'utf8'));
    if (!manifest) throw Error('game.yml not found in '+gamePath+'! Please make sure the file exists.');

	// Get all files in the scenes directory.
    const scenePath = path.join(gamePath, manifest.scene_path);
    const scenes = fs.readdirSync(scenePath);

    const sceneObj = {};

	// Load each one, converting from YAML to JSON and adding it to sceneObj,
    for (let i = 0; i < scenes.length; i++) {
        const p = path.join(scenePath, scenes[i]);

        // Strip file extension.
        const scene = path.basename(scenes[i], path.extname(scenes[i]));

        sceneObj[scene] = yaml.safeLoad(fs.readFileSync(p, 'utf8'));
    }

	// Set up the bundle using data from game.yml and add the compiled scenes object.
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

	// Get template and theme from this script's folder.
    const template = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
    const theme = fs.readFileSync(path.join(__dirname, 'themes', 'phosphor.css'), 'utf8');

	// Grab compiled engine from specified directory.
    const engine = fs.readFileSync(path.join(engineDir, 'terminator.engine.js'), 'utf8');

	// Concat the theme CSS, engine JS and compiled game bundle into a single HTML file.
    const newHTML = writeToHTML(template, bundle.game.title, engine, JSON.stringify(bundle));

	// And write... now just drop it on a web server somewhere!
	const bundlePath = path.join(outputDir, bundle.game.shortname + '.bundle.html');
    fs.writeFileSync(bundlePath, newHTML);

    console.log('Saved to '+bundlePath);
} else {
    throw Error('No path given');
}
