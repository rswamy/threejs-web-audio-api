# homemade VJ rig for techno shows, 2018
Super basic javascript project with audio-reactive elements in THREE.js and pixi.js using the mic input (uses web audio API). Used at a few techno shows by running chrome in fullscreen mode on a projector.

Disclaimer: This is pretty much hardcoded for a specific application and artist, so ymmv in using this code elsewhere.

Code for audio reactivity forked from threejs-web-audio-api project under the MIT license.

### What's in it?

There are a few layers of animations and graphics which can be shown and hidden using various keyboard keys:

- "2D scenes" - pixijs container
- "3D scenes" - threejs group
- full-screen videos - NOTE these need to be added into the docs/video folder.

The app itself contains

- Debugger panel to show all audio data with visuals
- Mic input from web audio API
- Various mapping of keyboard keys for toggling different effects.

### To run

Install webpack and the development server:

```
> $ npm install webpack-dev-server webpack -g
```
Install other dependencies:

```
> $ npm install
```

Start building!: 

```
> $ npm run dev
```

Go to `http://localhost:8080/`
