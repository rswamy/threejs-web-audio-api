import * as THREE from 'three';
import axis from './Debug/axis';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const scene3DintervalMin = 60*1000*5;
const scene3DintervalMax = 60*1000*10;

// Make timer for all timers
let pageTimers = document.getElementById('timers')
if(pageTimers == null) {
	let timers = document.createElement("ul");
	timers.id = 'timers';
	document.body.appendChild(timers);
}
// 3D timers
let scene3DtimerDisplay = document.createElement("li");
scene3DtimerDisplay.id = 'scene3Dtimer';
scene3DtimerDisplay.appendChild(document.createTextNode("init3D"));
pageTimers.appendChild(scene3DtimerDisplay);

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

/* Materials */
var meshDepthMaterial = new THREE.MeshDepthMaterial();
var meshLambertWire = new THREE.MeshLambertMaterial({
	wireframe: true
});

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
		this.uniforms = {
			time: { value: 1.0 }
		};

	}
	stop() {
		//console.log('Scene3D] stopping and destroying ' + this.sceneName);
		app3D.remove(this.container);
	}
	start() {
		//console.log('Scene2D] starting ' + this.sceneName);
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

/** Audio reactive toruses */
class AdvancedTorusDots extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.Points(
					new THREE.TorusGeometry( 100 * (i + 1), 3, 3, 20 ),
					new THREE.PointsMaterial( {
						color: 0xffffff,
						size: Math.random()*20 + 1
					} )
				)
			);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].scale.z = 10 * Math.cos(this.count) * i + 0.001;
			}
			childrenArray[4].scale.z = -8 * Math.cos(this.count) + 0.001;
			childrenArray[4].rotation.z -= 2 * Math.cos(this.count) + 0.001;
			childrenArray[6].rotation.z -= 2 * Math.cos(this.count) + 0.001;
			childrenArray[6].scale.z = -14 * Math.cos(this.count) + 0.001;
			childrenArray[8].scale.z = -18 * Math.cos(this.count) + 0.001;
			if(isBeat) {
				childrenArray[randomIntFromInterval(0, childrenArray.length - 1)].scale.z = -30 * Math.cos(volume);
			}
			//this.container.rotation.x -= 0.01 * cos * volume;
			//this.container.rotation.y += 0.005 * Math.sin(this.count) * volume;
		}
	}
}


// Setup THREE.js stuff for rendering
//app3D.add(new THREE.AxesHelper(300));	// debug x,y,z axis
app3D.add(ambientLight);
app3D.add(pointLight);

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * 2D and 3D SCENE PLAYBACK CONTROL LOGIC * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
// Create list of 3D scenes
let empty3Dscene = new Scene3D("empty");
let advancedTorusDots = new AdvancedTorusDots("advancedTorusDots");

// When app loads, initially show empty 2D and 3D scenes.
var current3Dscene = empty3Dscene;
current3Dscene.start();

// Array of 3D scenes to choose from
let arrayOf3Dscenes = [
	empty3Dscene,
	advancedTorusDots
];

// Then start choosing a random 2D and random 3D scene
random3Dscene();

// Choose random 3D scenes
function random3Dscene() {
	let idx = randomIntFromInterval(0, arrayOf3Dscenes.length - 1);
	var next3Dscene = arrayOf3Dscenes[idx];
	// Stop current scene and start next one
	current3Dscene.stop();
	next3Dscene.start();
	current3Dscene = next3Dscene;
	console.log('3D] Picked the scene with index: '
		+ idx + ' scene: ' + next3Dscene.sceneName);
	let interval3D = randomIntFromInterval(scene3DintervalMin, scene3DintervalMax);
	scene3DtimerDisplay.innerText = millisToMinutesAndSeconds(interval3D) + current3Dscene.sceneName;
	console.log('3D] Will change 3D scene in ' + interval3D + ' ms');
	setTimeout(random3Dscene, interval3D);
}

/** * * * * * * * * * * Audio input function * * * * * * * * * * * * * * *
 * Fires every time new audio data is received.
 * Called from app.js.
 *
 * @param audioData
 * @param command - key pressed
 */
export function audioReactive(audioData, command) {
	// 3D scenes
	if(advancedTorusDots != null) {
		advancedTorusDots.audioTick(audioData);
	}

	// rerender scene every update
	renderer.render(app3D, camera);
}

export function stop() {
	current3Dscene.stop();
}
export function start() {
	current3Dscene.start();
}
export function random() {
	random3Dscene();
}
export function restart() {
	current3Dscene.stop();
	current3Dscene.start();
}
export function empty() {
	current3Dscene.stop();
	empty3Dscene.start();
}
export function name() {
	return current3Dscene.sceneName;
}


/** * * * * * * * * * * General helper functions * * * * * * * * * * * * * * */

// Choose random int between min and max
function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * ( max - min + 1 ) + min);
}

// Convert milliseconds to mm:ss
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = millis % 60;
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function map (num, in_min, in_max, out_min, out_max) {
	return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

