import * as PIXI from 'pixi.js';

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const scene2DintervalMin = 60*1000*5; // 5min
const scene2DintervalMax = 60*1000*10; //20min

// Make timer for all timers
let timers = document.createElement("ul");
timers.id = 'timers';
if(document.getElementById('timers') == null) {
	document.body.appendChild(timers);
}

// Display timer for debugging 2D scenes as a list item in the #timers ul.
let scene2DtimerDisplay = document.createElement("li");
scene2DtimerDisplay.id = 'scene2Dtimer';
scene2DtimerDisplay.appendChild(document.createTextNode("init2D"));
timers.appendChild(scene2DtimerDisplay);

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
document.getElementById('scene2D').appendChild(app2D.view);

var blurFilter1 = new PIXI.filters.BlurFilter();
var blurFilter2 = new PIXI.filters.BlurFilter(5);

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
		this.speed = 0.01;
	}
	stop() {
		//console.log('Scene2D] stopping and destroying ' + this.sceneName);
		this.container.destroy({
			children:true
		});
	}
	start() {
		//console.log('Scene2D] starting ' + this.sceneName);
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

/** Triangles in a row in the center, not audioreactive */
class FixedTriangleRow extends Scene2D {
	start() {
		super.start();
		let thing = new PIXI.Graphics();
		thing.lineStyle(1, 0xffffff, 0.8);
		function drawTriangle(xOffset, triangleSize) {
			thing.moveTo(xOffset, - triangleSize/2);
			thing.lineTo(triangleSize/2 + xOffset, triangleSize/2);
			thing.lineTo(-triangleSize/2 + xOffset, triangleSize/2);
			thing.lineTo(xOffset, - triangleSize/2);
		}
		drawTriangle(-200, 100);
		drawTriangle(-100, 150);
		drawTriangle(0, 200);
		drawTriangle(100, 150);
		drawTriangle(200, 100);
		this.container.x = windowWidth/2;
		this.container.y = windowHeight/2;
		this.container.pivot.x = (this.container.width / 2) - (this.container.width / 2);
		this.container.pivot.y = (this.container.height / 2) - (this.container.height / 2);
		thing.filters = [blurFilter1];
		this.container.addChild(thing);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				var childrenArray = this.container.children;
				childrenArray.forEach(function (child) {
					child.scale.x = 1 + Math.cos(volume * 2);
					child.scale.y = 1 + Math.cos(volume * 2);
				});
			}
		}
	}
}


/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * 2D and 3D SCENE PLAYBACK CONTROL LOGIC * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
// Create a list of 2D scenes
let emptyScene = new Scene2D("empty");
let fixedTriangles = new FixedTriangleRow("fixedTriangles");

// When app loads, initially show empty 2D and 3D scenes.
var current2Dscene = emptyScene;
current2Dscene.start();

// Array of 2D scenes to choose from
let arrayOf2Dscenes = [
	emptyScene,
	fixedTriangles
];

// Then start choosing a random 2D and random 3D scene
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
	console.log('2D] Picked the scene with index: '
		+ idx + ' scene: ' + next2Dscene.sceneName);

	// Call this function again after the interval time.
	// Also update the display.
	let interval2D = randomIntFromInterval(scene2DintervalMin, scene2DintervalMax);
	scene2DtimerDisplay.innerText = millisToMinutesAndSeconds(interval2D) + current2Dscene.sceneName;
	console.log('2D] Will change 2D scene in ' + interval2D + ' ms');
	setTimeout(random2Dscene, interval2D);
}

/** * * * * * * * * * * Audio input function * * * * * * * * * * * * * * *
 * Fires every time new audio data is received.
 * Called from app.js.
 *
 * @param audioData
 */
export default function(audioData) {
	// Only feed audio data into the scenes that are currently on screen (not null).

	// 2D scenes
	if(fixedTriangles != null) {
		fixedTriangles.audioTick(audioData);
	}
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

