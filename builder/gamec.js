'use strict'

// gamec takes a game folder (zipped or not) and spits out
// a compiled JS object that Terminator can load.

// Builds properly structured game content folders into a single
// HTML-linkable game content file.

// Takes your folder as a command line arg
// and builds based on game.yml
// Requires node.

const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

const args = process.argv.slice(2)

if (args[0]) {
    const gamePath = path.resolve(args[0]);

	// Write to specified output folder, or the __dirname if none specified.
	const outputDir = args[1] ? path.resolve(args[1]) : __dirname;

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

	const out = path.join(outputDir, 'game.json')
    fs.writeFileSync(out, JSON.stringify(bundle, null, 2))
	console.log('game.json bundled')
} else {
    throw Error('No path given');
}
