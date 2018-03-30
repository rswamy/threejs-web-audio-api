import THREE from 'three';
import axis from './Debug/axis';

/**
import TWEEN from './Tween/Tween';
import * as PIXI from 'pixi.js';
import axis from './Debug/axis';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const scene2DintervalMin = 5000;
const scene2DintervalMax = 10000;
const scene3DintervalMin = 5000;
const scene3DintervalMax = 10000;

// Make timer for all timers
let timers = document.createElement("ul");
timers.id = 'timers';
document.body.appendChild(timers);

// Display timer for debugging 2D scenes as a list item in the #timers ul.
let scene2DtimerDisplay = document.createElement("li");
scene2DtimerDisplay.id = 'scene2Dtimer';
scene2DtimerDisplay.appendChild(document.createTextNode("init2D"));
timers.appendChild(scene2DtimerDisplay);

// 3D timers
let scene3DtimerDisplay = document.createElement("li");
scene3DtimerDisplay.id = 'scene3Dtimer';
scene3DtimerDisplay.appendChild(document.createTextNode("init3D"));
timers.appendChild(scene3DtimerDisplay);


/** * * * * * * * * * * 2D Scene setup * * * * * * * * * * * * * * *
 * PIXIjs initialization
 * -----------------------
 * Set up pixi application and attach to canvas.
 */

const app2D = new PIXI.Application({
	transparent: true
});
// Make canvas the size of the browser window
app2D.renderer.view.style.position = "absolute";
app2D.renderer.view.style.display = "block";
app2D.renderer.autoResize = true;
app2D.renderer.resize(window.innerWidth, window.innerHeight);
app2D.view.id = 'pixi';
document.body.appendChild(app2D.view);

class Scene2D {
	constructor(sceneName) {
		this.container = null;
		this.sceneName = sceneName;
		var isBeat = null;
		var levels = null;
		var waveform = null;
		var beatCutoff = null;
		var volume = null;
		this.count = 0;
	}
	stop() {
		console.log('Scene2D] stopping and destroying ' + this.sceneName);
		this.container.destroy({children:true});
	}
	start() {
		console.log('Scene2D] starting ' + this.sceneName);
		this.container = new PIXI.Container();
		app2D.stage.addChild(this.container);
	}
	audioTick(audioData) {
		this.isBeat = audioData.isBeat;
		this.levels = audioData.levels;
		this.waveform = audioData.waveform;
		this.beatCutoff = audioData.beatCutoff;
		this.volume = audioData.volume;
		this.count += 0.01;
	}
}

class DiscoScene extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let fleckSpacing = 100;
		let numberOfFlecks = 30;
		console.log('DiscoScene] numberOfFlecks= ' + numberOfFlecks);
		// create many flecks
		var blurFilter1 = new PIXI.filters.BlurFilter();
		var blurFilter2 = new PIXI.filters.BlurFilter(5);
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0xffffff, 0.5);
			discoFleck.drawRect(0, 0, randomIntFromInterval(0.3 * fleckSpacing, 1.3 * fleckSpacing), 20);
			discoFleck.endFill();
			discoFleck.x = (i % Math.floor(windowWidth/fleckSpacing)) * randomIntFromInterval(fleckSpacing, 3 * fleckSpacing);
			discoFleck.y = (i / 5) * fleckSpacing;
			if(i % 2 == 0) {
				discoFleck.filters = [blurFilter1];
			}
			else {
				discoFleck.filters = [blurFilter2];
			}
			this.container.addChild(discoFleck);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 3 == 0) {
					child.scale.x = 1 + (volume * 1);
					if(isBeat) {
						child.fillAlpha = 1;
					}
					else {
						child.fillAlpha = 0.5;
					}
				}
				if(childrenArray.indexOf(child) % 2 == 0) {
					child.rotation += 0.01
				}
			});
		}
	}
}

class TriangleScene extends Scene2D {
	start() {
		super.start();
		let thing = new PIXI.Graphics();
		thing.lineStyle(1, 0xffffff, 1);
		thing.moveTo(50,50);
		thing.lineTo(250, 50);
		thing.lineTo(100, 100);
		thing.lineTo(50, 50);
		this.container.addChild(thing);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var volume = this.volume;
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				child.scale.x = 15 * volume;
			});
		}
	}
}

// Create a list of scenes
let emptyScene = new Scene2D("empty");
let discoScene = new DiscoScene("disco");
let triangleScene = new TriangleScene("triangle");

// Start of code to randomly select the 2D scenes
let arrayOf2Dscenes = [
	discoScene,
	triangleScene
];

// When the app loads, initially show a the disco scene
var current2Dscene = discoScene;
current2Dscene.start();

// Then start choosing
random2Dscene();

// Choose scene randomly from the array of available 2D scenes
function random2Dscene() {
	// Pick a scene from the array to start
	let idx = randomIntFromInterval(0, arrayOf2Dscenes.length - 1);
	var next2Dscene = arrayOf2Dscenes[idx];

	// Stop the current scene and start the next scene
	current2Dscene.stop();
	next2Dscene.start();

	// Make the picked scene the current scene.
	current2Dscene = next2Dscene;
	console.log('[2D] I have picked the scene with index: '
		+ idx + ' scene: ' + next2Dscene.sceneName);

	// Call this function again after the interval time.
	// Also update the display.
	let interval2D = randomIntFromInterval(scene2DintervalMin, scene2DintervalMax);
	scene2DtimerDisplay.innerText = millisToMinutesAndSeconds(interval2D);
	console.log('[2D] Will change 2D scene in ' + interval2D + ' ms');
	setTimeout(random2Dscene, interval2D);
}

/** * * * * * * * * * * 3D Scene setup * * * * * * * * * * * * * * *
 *  THREEjs initialization
 *  ----------------------
 *  create camera, controls, scene and renderer
 */

let camera = new THREE.PerspectiveCamera(45, windowWidth / windowHeight, 0.1, 10000);
let app3D = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({
	alpha: true
});

// create mouse controls
let controls = new (require('three-orbit-controls')(THREE))(camera);
// initial camera position
camera.position.z = 900;
// set renderer fullscreen
renderer.setSize(windowWidth, windowHeight);

// add to dom
document.getElementById('scene').appendChild(renderer.domElement);

/**
 *  Lighting
 *  --------
 *  point light adds more direct lighting - color, intensity, distance, decay
 *  while ambient light adds light to all angles - color
 */
let pointLight = new THREE.PointLight(0xFFFFFF, 1, 0, 2);
let ambientLight = new THREE.AmbientLight(0x404040);
// set where you want the light to be directed at
pointLight.position.set(10, 50, 130);


class Scene3D {
	constructor(sceneName) {
		this.container = null;
		this.sceneName = sceneName;
		var isBeat = null;
		var levels = null;
		var waveform = null;
		var beatCutoff = null;
		var volume = null;
		this.count = 0;
	}
	stop() {
		console.log('Scene3D] stopping and destroying ' + this.sceneName);
		app3D.remove(this.container);
	}
	start() {
		console.log('Scene2D] starting ' + this.sceneName);
		this.container = new THREE.Group();
		app3D.add(this.container);
	}
	audioTick(audioData) {
		this.isBeat = audioData.isBeat;
		this.levels = audioData.levels;
		this.waveform = audioData.waveform;
		this.beatCutoff = audioData.beatCutoff;
		this.volume = audioData.volume;
		this.count += 0.01;
	}
}


/**
 *  Sphere
 *  ------
 *  radius dictates size, segments and rings dictates polygon count
 *  while ambient light adds light to all angles
 */
class SphereScene extends Scene3D {
	start() {
		super.start();
		this.sphereColors = [{r:156,g:0,b:253},{r:0,g:255,b:249},{r:0,g:253,b:40},{r:245,g:253,b:0},{r:252,g:15,b:145}];
		this.activeColor = 0;	// Index of sphere colors
		let sphereRadius = 150;
		let sphereSegments = 24;
		let sphereRings = 24;
		let sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xCC0000
		});
		let sphereGeometry = new THREE.SphereGeometry(sphereRadius, sphereSegments, sphereRings);
		let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		this.container.add(sphere);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		if((this.container != null) && (typeof this.container != 'undefined')) {
			// change sphere color every beat
			var sphere = this.container.children[0];
			if (this.isBeat) {
				let color = this.sphereColors[this.activeColor];
				sphere.material.color = new THREE.Color(`rgb(${color.r},${color.g},${color.b})`);
				this.activeColor = this.activeColor < this.sphereColors.length - 1 ? this.activeColor + 1 : 0;
			}
			// change sphere size based on volume
			sphere.scale.x = .3 + (this.volume / 2);
			sphere.scale.y = .3 + (this.volume / 2);
			sphere.scale.z = .3 + (this.volume / 2);
		}
	}
}


/**
 *  Plane
 *  ------
 *  pointlight adds more direct lighting
 *  while ambient light adds light to all angles
 */

class PlaneScene extends Scene3D {
	start() {
		super.start();
		let planePoints = 15;
		let planeMaterial = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			wireframe: true,
			wireframeLinewidth: 0.5
		});
		let planeGeometry = new THREE.PlaneGeometry(1000, 1000, planePoints, planePoints);
		let plane = new THREE.Mesh(planeGeometry, planeMaterial);
		// let the renderer know we plan to update the vertices
		plane.geometry.verticesNeedUpdate = true;
		plane.geometry.dynamic = true;
		// rotate and position plane on ground
		plane.position.z = 200;
		plane.rotation.y = Math.PI/8;
		this.container.add(plane);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var waveform = this.waveform;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				waveform.forEach((value, i) => {
					if (i%2 === 0) {
						child.geometry.vertices[i/2].z = value * 80;
					}
				});
				child.geometry.verticesNeedUpdate = true;
			});
			this.container.rotateZ(0.001);
		}
	}
}


/**
 *  sticks
 *  ------
 */
class StickScene extends Scene3D {
	start() {
		super.start();
		let pivot;
		let stickEndWidth = 10;
		let stickLength = 500;
		let stickMaterial = new THREE.MeshBasicMaterial( {
			color: 0x00ff00,
			wireframe: true
		} );
		const numberOfSticks = 10;
		let stickGapDistance = 100;
		let stickGroup = new THREE.Group();
		// create an assortment of sticks
		for(let i = 0; i < numberOfSticks; i++) {
			let stickGeometry = new THREE.BoxGeometry( stickLength, stickEndWidth, stickEndWidth );
			let stick = new THREE.Mesh( stickGeometry, stickMaterial );
			stick.position.set(0, stickGapDistance*i, 0);
			stick.rotation.set(0, (2*Math.PI*i)/numberOfSticks, 0);
			stickGroup.add(stick);
		}
		// add sticks to scene and move group to center.
		stickGroup.position.set(0, -numberOfSticks * stickGapDistance/2, 0);
		pivot = new THREE.Object3D();
		pivot.add(stickGroup);
		this.container.add(pivot);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotateY(i * 0.2);
			}
			this.container.rotateZ(0.01);
		}
	}
}

// Setup THREE.js stuff for rendering
app3D.add(axis(300));	// debug x,y,z axis
app3D.add(ambientLight);
app3D.add(pointLight);

// Create list of scenes
let empty3Dscene = new Scene3D("empty");
let sphereScene = new SphereScene("sphere");
let planeScene = new PlaneScene("plane");
let stickScene = new StickScene("stick");

// When app loads, initially show the sphere scene
var current3Dscene = sphereScene;
current3Dscene.start();

// Then start choosing random 3D scenes:
let arrayOf3Dscenes = [
	//sphereScene,
	planeScene,
	planeScene
	// stickScene,
	// empty3Dscene
];
random3Dscene();
// Choose random 3D scenes
function random3Dscene() {
	let idx = randomIntFromInterval(0, arrayOf3Dscenes.length - 1);
	var next3Dscene = arrayOf3Dscenes[idx];
	// Stop current scene and start next one
	current3Dscene.stop();
	next3Dscene.start();
	current3Dscene = next3Dscene;
	let interval3D = randomIntFromInterval(scene3DintervalMin, scene3DintervalMax);
	scene3DtimerDisplay.innerText = millisToMinutesAndSeconds(interval3D);
	console.log('[3D] Will change 3D scene in ' + interval3D + ' ms');
	setTimeout(random3Dscene, interval3D);
}

/** * * * * * * * * * * Audio input function * * * * * * * * * * * * * * *
 * Fires every time new audio data is received.
 * Called from app.js.
 *
 * @param audioData
 */
export default function(audioData) {

	if(sphereScene != null) {
		sphereScene.audioTick(audioData);
	}
	if(planeScene != null) {
		planeScene.audioTick(audioData);
	}
	if(discoScene != null) {
		discoScene.audioTick(audioData);
	}
	if(triangleScene != null) {
		triangleScene.audioTick(audioData);
	}
	if(stickScene != null) {
		stickScene.audioTick(audioData);
	}

	// rerender scene every update
	render();
}
/** Rendering function point of entry.
 * Renders the three.js scene (renderer object), updates the TWEENs,
 * and updates the PIXIjs objects.
 */
function render() {
	renderer.render(app3D, camera);
	// update the tweens
	TWEEN.update();
	// update the pixi objects
	pixiLoop();
}
// PIXI animation loop, called every time new audio data from the render function.
// Reset by each function
var pixiLoop = function() {
};

/** * * * * * * * * * * General helper functions * * * * * * * * * * * * * * */

// Choose random int between min and max
function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * ( max - min + 1 ) + min);
}

// Convert milliseconds to mm:ss
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function map (num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}