# Terminator (ALPHA)
Terminator is a developer-oriented text adventure framework. It takes a folder full of YAML files and turns it into a web-based text adventure game that can be hosted on any server and played anywhere!

![Terminator Screenshot](screenshot.jpg?raw=true)

## Features
### Current
- Build larger scenes with many smaller sections. Specify your own custom commands to move between sections and scenes

### Future
- Sound effects and music tracks game-wide, per-scene or per-section
- Swappable themes

## How Do I Use It?
0. Make sure you have Node.js installed. Get it [HERE](https://nodejs.org/en/download/current/) if you don't.
1. Clone the project `git clone https://github.com/vantaure/terminator.git`
2. Move into the directory with `cd terminator`
3. Set up, build the engine and start the server: `npm install && gulp build && gulp build:game && npm start`
4. Open a browser and point it to `localhost:8080`

From there, check the gulpfile for more commands you can run. The game and engine will eventually be split up, but since this is super alpha you can just play around with things in the `gamecontent` folder and run `gulp build:game` to see your changes.

Better docs incoming when Terminator is ready for game devs to start using it.

## Game format
Games are laid out like so:
```
game/
  |__game.yaml
  |__scenes/
     |__scene1.yaml
	 |__scene2.yaml
	 |__scene...
```

`game.yaml` contains all the information the engine needs to bootstrap your game into a single JS object that can be loaded and played. Check the example one in `gamecontent/` for properties that should be included.

`game.yaml` will specify the scene directory and the name of the first scene (sans file extension) that will be loaded when the game starts.

Scenes can link to each other using whatever names you want by specifying a name and scene file name in each scene's YAML file. Check `gamecontent/scenes/first.yaml` for an example.

Scene files contain four main sections;

#### `scenes`
Specifies all scenes that can be linked to from within this scene and the name they're referred to by.

#### `commands`
#### `aliases`
#### `sections`
