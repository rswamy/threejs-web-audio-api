import THREE from 'three';
import axis from './Debug/axis';

/**
import TWEEN from './Tween/Tween';
import * as PIXI from 'pixi.js';
import axis from './Debug/axis';

// KEYBOARD CONTROLS
// 		Keyboard tester:
// 			window.addEventListener('keypress', function (e) {alert(e.keyCode)})
/*
   2D   3D
   |    |
 [ 1 ][ 2 ] ----- start
  [ Q ][ W ] ---- stop
   [ A ][ S ][ D ] --- random
     [ Z ][ X ] - empty room
 */
window.addEventListener('keypress', function (e) {
	switch(e.keyCode) {
		case 49: // 1
			current2Dscene.start();
			break;
		case 113: // Q
			current2Dscene.stop();
			break;
		case 97: // A
			random2Dscene();
			break;
		case 122: // Z
			current2Dscene.stop();
			emptyScene.start();
			break;
		case 119: // W
			current3Dscene.stop();
			break;
		case 50: // 2
			current3Dscene.start();
			break;
		case 115: // S
			random3Dscene();
			break;
		case 120: // X
			current3Dscene.stop();
			empty3Dscene.start();
			break;
	}
}, false);

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
const scene2DintervalMin = 60*1000*5; // 5min
const scene2DintervalMax = 60*1000*10; //20min
const scene3DintervalMin = 60*1000*5;
const scene3DintervalMax = 60*1000*10;

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
	}
	stop() {
		//console.log('Scene2D] stopping and destroying ' + this.sceneName);
		this.container.destroy({children:true});
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

/** Skinny rectangles randomly placed on the screen */
class DiscoScene extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let fleckSpacing = 100;
		let numberOfFlecks = 30;
		// create many flecks
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

/** Fast triangles */
class TriangleScene extends Scene2D {
	start() {
		super.start();
		let thing = new PIXI.Graphics();
		thing.lineStyle(1, 0xffffff, 1);
		let triangleSize = 100;
		function drawTriangle(xOffset) {
			thing.moveTo(windowWidth/2 + xOffset, windowHeight/2 - triangleSize/2);
			thing.lineTo(windowWidth/2 + triangleSize/2 + xOffset, windowHeight/2 + triangleSize/2);
			thing.lineTo(windowWidth/2 - triangleSize/2 + xOffset, windowHeight/2 + triangleSize/2);
			thing.lineTo(windowWidth/2 + xOffset, windowHeight/2 - triangleSize/2);
		}
		drawTriangle(0);
		drawTriangle(300);
		drawTriangle(-300);
		drawTriangle(600);
		drawTriangle(-600);
		drawTriangle(900);
		drawTriangle(-900);
		this.container.x = windowWidth/2;
		this.container.y = windowHeight/2;
		this.container.pivot.x = (this.container.width / 2) - (this.container.width / 2);
		this.container.pivot.y = (this.container.height / 2) - (this.container.height / 2);
		this.container.addChild(thing);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var volume = this.volume;
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				child.scale.x = 2 * volume + 1;
				child.scale.y = 2 * volume + 1;
				if(isBeat) {
					child.rotation += 3;
				}
			});
		}
	}
}

/** Circles in a 5x5 grid */
class CirclesArray extends Scene2D {
	start() {
		super.start();
		let offset = 100;
		for(let row = 0; row < 5; row++) {
			for(let col = 0; col < 5; col++) {
				let graphics = new PIXI.Graphics();
				graphics.lineStyle(1, 0x000000, 1);
				graphics.beginFill(0x000000, 0.8);
				graphics.drawCircle(windowWidth/2 - 2.5*offset + offset * row, windowHeight/2 + - 2.5*offset + offset * col, row + col * 20);
				graphics.endFill();
				this.container.addChild(graphics);
			}
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 2 == 0) {
					child.position.y = 1 + volume * 5;
				}
			})
		}
	}
}

/** Bokeh almost */
class BubblesArray extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let fleckSpacing = 100;
		let numberOfFlecks = 15;
		// create many flecks
		var blurFilter1 = new PIXI.filters.BlurFilter();
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0x000000, 0.3);
			discoFleck.drawCircle(0, 0, randomIntFromInterval(0.3 * fleckSpacing, 1.3 * fleckSpacing));
			discoFleck.endFill();
			discoFleck.x = (i % Math.floor(windowWidth/fleckSpacing)) * randomIntFromInterval(fleckSpacing, 3 * fleckSpacing);
			discoFleck.y = (i / 5) * fleckSpacing;
			discoFleck.filters = [blurFilter1];
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
				child.scale.x = 1 + (volume * 1);
				if(childrenArray.indexOf(child) % 2 == 0) {
					child.rotation += 0.01
				}
			});
		}
	}
}

/** One soft circle sound reactive in center */
class OneCircleScene extends Scene2D {
	start() {
		super.start();
		let squareSide = 150;
		let test = new PIXI.Graphics();
		test.lineStyle(1, 0xaaaaaa, 1);
		test.drawCircle(0, 0, squareSide);
		this.container.x = windowWidth/2;
		this.container.y = windowHeight/2;
		this.container.pivot.x = (this.container.width / 2) - (this.container.width / 2);
		this.container.pivot.y = (this.container.height / 2) - (this.container.height / 2);
		test.filters = [blurFilter1];
		this.container.addChild(test);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.scale.x = 1 + (volume * 2);
				this.container.scale.y = 1 + (volume * 2);
			}
		}
	}
}

/** Draw a line each time there is a beat */
class BeatLine extends Scene2D {
	start() {
		super.start();
		let graphics = new PIXI.Graphics();
		graphics.beginFill(0x000000, 0.01);
		this.container.addChild(graphics);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		var container = this.container;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				container.children[0].moveTo(Math.random() * windowWidth, Math.random() * windowHeight);
				container.children[0].bezierCurveTo(
					Math.random() * windowWidth, Math.random() * windowHeight,
					Math.random() * windowWidth, Math.random() * windowHeight,
					Math.random() * windowWidth, Math.random() * windowHeight
				);
			}
		}
	}
}

/** Soft circles sound reactive in center */
class CenteredCircles extends Scene2D {
	start() {
		super.start();
		let radius = 50;
		let test = new PIXI.Graphics();
		test.lineStyle(1, 0xaaaaaa, 1);
		test.drawCircle(0, 0, radius);
		test.drawCircle(0, 0, radius*2);
		test.drawCircle(0, 0, radius*3);
		test.drawCircle(0, 0, radius*4);
		this.container.x = windowWidth/2;
		this.container.y = windowHeight/2;
		this.container.pivot.x = (this.container.width / 2) - (this.container.width / 2);
		this.container.pivot.y = (this.container.height / 2) - (this.container.height / 2);
		test.filters = [blurFilter1];
		this.container.addChild(test);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.scale.x = 1 + (volume * 2);
				this.container.scale.y = 1 + (volume * 2);
			}
		}
	}
}

class RaysScene extends Scene2D {
	start() {
		super.start();
		let offset = 10;
		for(let row = 0; row < 5; row++) {
			for(let col = 0; col < 5; col++) {
				let graphics = new PIXI.Graphics();
				graphics.lineStyle(Math.random() * 4 + 0.2, 0xffffff, 0.7);
				graphics.drawRect(
					randomIntFromInterval(offset,windowWidth-offset),
					randomIntFromInterval(offset,windowHeight-offset),
					randomIntFromInterval(30,50),
					randomIntFromInterval(30,50));
				this.container.addChild(graphics);
			}
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 5 == 0) {
					child.position.y = 10 + volume * 15;
				}
				if(childrenArray.indexOf(child) %3 == 0) {
					child.position.x = 10 + volume * 15;
				}
				else {
					child.rotation = 0.001
				}
			})
		}
	}
}

class TallRectangles extends Scene2D {
	start() {
		super.start();
		let offset = 10;
		for(let row = 0; row < 5; row++) {
			for(let col = 0; col < 5; col++) {
				let graphics = new PIXI.Graphics();
				graphics.lineStyle(1 + 0.2, 0xffffff, 0.8);
				graphics.drawRect(
					randomIntFromInterval(offset,windowWidth-offset),
					randomIntFromInterval(offset,windowHeight-offset),
					randomIntFromInterval(10,30),
					randomIntFromInterval(100,150));
				graphics.filters = [blurFilter1]
				this.container.addChild(graphics);
			}
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 5 == 0) {
					child.position.y = 10 + volume * 15;
				}
				if(childrenArray.indexOf(child) %3 == 0) {
					child.position.x = 10 + volume * 15;
				}
			})
		}
	}
}

/** Triangles in a row in the center */
class CenteredPolygon extends Scene2D {
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
		this.container.addChild(thing);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.scale.x = 1 + (volume * 2);
				this.container.scale.y = 1 + (volume * 2);
			}
		}
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
		this.container.addChild(thing);
	}
}

// Create a list of scenes
let emptyScene = new Scene2D("empty");
let discoScene = new DiscoScene("disco");
let triangleScene = new TriangleScene("triangle");
let circlesArray = new CirclesArray("circlesArray");
let bubblesArray = new BubblesArray("bubbles");
let oneCircleScene = new OneCircleScene("square");
let beatLine = new BeatLine("beatLine");
let centeredCircles = new CenteredCircles("centered");
let rays = new RaysScene("rays");
let tallRectangles = new TallRectangles("tallRectangles");
let centeredPolygon = new CenteredPolygon("tallRectangles");
let fixedTriangles = new FixedTriangleRow("fixedTriangles");

// Start of code to randomly select the 2D scenes
let arrayOf2Dscenes = [
	emptyScene,
	emptyScene,
	emptyScene,
	emptyScene,
	discoScene,
	triangleScene,
	circlesArray,
	bubblesArray,
	oneCircleScene,
	triangleScene,
	beatLine,
	centeredCircles,
	rays,
	tallRectangles,
	centeredPolygon,
	fixedTriangles
];

// When the app loads, initially show a the disco scene
var current2Dscene = emptyScene;
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
	console.log('2D] Picked the scene with index: '
		+ idx + ' scene: ' + next2Dscene.sceneName);

	// Call this function again after the interval time.
	// Also update the display.
	let interval2D = randomIntFromInterval(scene2DintervalMin, scene2DintervalMax);
	scene2DtimerDisplay.innerText = millisToMinutesAndSeconds(interval2D) + current2Dscene.sceneName;
	console.log('2D] Will change 2D scene in ' + interval2D + ' ms');
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

/* Materials */
var whiteWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	wireframe: true
} );
var medGrayWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0xaaaaaa,
	wireframe: true
} );

var grayPurpleWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x666699,
	wireframe: true
} );
var grayWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x7f7f7f,
	wireframe: true
} );
var darkGrayWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x676767,
	wireframe: true
} );
var blackWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x000000,
	wireframe: true
} );

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

/** sphere */
class SphereScene extends Scene3D {
	start() {
		super.start();
		this.sphereColors = [{r:0,g:0,b:0},{r:100,g:100,b:100},{r:200,g:200,b:200},{r:255,g:255,b:255},{r:150,g:150,b:150}];
		this.activeColor = 0;	// Index of sphere colors
		let sphereRadius = 500;
		let sphereSegments = 24;
		let sphereRings = 24;
		let sphereMaterial = new THREE.MeshLambertMaterial({
			color: 0xCC0000,
			wireframe: true
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
			sphere.scale.x = .2 + (this.volume / 2);
			sphere.scale.y = .2 + (this.volume / 2);
			sphere.scale.z = .2 + (this.volume / 2);
		}
	}
}

/** Plane */
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

/** sticks */
class StickScene extends Scene3D {
	start() {
		super.start();
		let pivot;
		let stickEndWidth = 10;
		let stickLength = 500;
		let stickMaterial = new THREE.MeshBasicMaterial(grayWireframeMaterial);
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
		pivot.name = 'pivot';
		pivot.add(stickGroup);
		this.container.add(pivot);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children[0].children[0].children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.set(0, (Math.PI*i/4), 0);
				childrenArray[i].scale.x = volume * 70;
				childrenArray[i].scale.y = volume * 20;
			}
			this.container.rotateZ(0.001);
		}
	}
}

/** Torus*/
class TorusScene extends Scene3D {
	start() {
		super.start();
		var geometry = new THREE.TorusKnotGeometry( 300, 100, 20, 16 );
		var torusKnot = new THREE.Mesh( geometry, grayWireframeMaterial );
		this.container.add(torusKnot);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			this.container.rotateZ(-0.004);
			this.container.rotateY(0.002);
			if(isBeat) {
				this.container.scale.set(volumeFactor, volumeFactor, volumeFactor);
			}
		}
	}
}

/** Circle rotating */
class CircleRotatingScene extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TorusGeometry( 250, 10, 3, 50 );
		var geometry2 = new THREE.TorusGeometry( 200, 10, 3, 50 );
		var geometrySide1 = new THREE.TorusGeometry( 300, 3, 3, 50 );
		var mainCircle = new THREE.Mesh( geometry1, whiteWireframeMaterial );
		var mainCircle2 = new THREE.Mesh( geometry2, whiteWireframeMaterial );
		var sideCircle1 = new THREE.Mesh( geometrySide1, whiteWireframeMaterial );
		var sideCircle2 = new THREE.Mesh( geometrySide1, whiteWireframeMaterial );
		sideCircle1.position.x = 150;
		sideCircle2.position.x = -150;
		this.container.add(sideCircle1);
		this.container.add(sideCircle2);
		this.container.add(mainCircle);
		this.container.add(mainCircle2);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[0].rotateY(0.01);
				this.container.children[1].rotateY(0.01);
			}
			this.container.children[2].rotateY(0.02);
			this.container.children[3].rotateY(0.005);
		}
	}
}

/** 2 Loop knot */
class KnotScene extends Scene3D {
	start() {
		super.start();
		var geometry = new THREE.TorusKnotGeometry( 350, 30, 40, 16, 5, 4);
		var torusKnot = new THREE.Mesh( geometry, grayWireframeMaterial );
		this.container.add(torusKnot);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.rotateZ(0.002);
			}
			else {
				this.container.rotateX(0.002);
				this.container.rotateY(0.001);
			}
		}
	}
}

/** 2 octahedron */
class OctahedronScene extends Scene3D {
	start() {
		super.start();
		var geometry = new THREE.OctahedronGeometry(300);
		var geometry2 = new THREE.OctahedronGeometry(100);
		var octahedron = new THREE.Mesh( geometry, whiteWireframeMaterial );
		var octahedron2 = new THREE.Mesh( geometry2, whiteWireframeMaterial );
		this.container.add(octahedron);
		this.container.add(octahedron2);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[1].rotateZ(0.002);
			}
			else {
				this.container.rotateX(0.002);
				this.container.rotateY(0.001);
			}
		}
	}
}

/** Nested geometry*/
class NestedScene extends Scene3D {
	start() {
		super.start();
		let offset = 100;
		var geometry1 = new THREE.BoxGeometry( offset, offset, offset, );
		var geometry2 = new THREE.TetrahedronGeometry( offset * 2);
		var geometry3 = new THREE.DodecahedronGeometry( offset * 3);
		var mesh1 = new THREE.Mesh( geometry1, whiteWireframeMaterial );
		var mesh2 = new THREE.Mesh( geometry2, grayWireframeMaterial );
		var mesh3 = new THREE.Mesh( geometry3, grayPurpleWireframeMaterial );
		this.container.add(mesh1);
		this.container.add(mesh2);
		this.container.add(mesh3);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[0].rotateX(0.01);
				this.container.children[1].rotateX(0.01);
			}
			this.container.children[0].rotateY(0.02);
			this.container.children[1].rotateY(0.01);
			this.container.children[2].rotateY(0.005);
		}
	}
}

/** 2 icosahedrons */
class DarkIcosahedron extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.IcosahedronGeometry( 200);
		var geometry2 = new THREE.IcosahedronGeometry( 50);
		var mesh1 = new THREE.Mesh( geometry1, grayWireframeMaterial );
		var mesh2 = new THREE.Mesh( geometry2, grayWireframeMaterial );
		this.container.add(mesh1);
		this.container.add(mesh2);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[0].rotateX(0.001);
			}
			this.container.children[1].rotateY(-0.002);
		}
	}
}

/** moon around a planet, kind of.... */
class MoonScene extends Scene3D {
	start() {
		super.start();
		// parent
		let parent = new THREE.Object3D();
		this.container.add( parent );
		// pivots
		var pivot1 = new THREE.Object3D();
		var pivot2 = new THREE.Object3D();
		var pivot3 = new THREE.Object3D();
		pivot1.rotation.z = 0;
		pivot2.rotation.z = 2 * Math.PI / 3;
		pivot3.rotation.z = 4 * Math.PI / 3;
		parent.add( pivot1 );
		parent.add( pivot2 );
		parent.add( pivot3 );
		var geometry = new THREE.SphereGeometry(200);
		// mesh
		var mesh1 = new THREE.Mesh( geometry, grayPurpleWireframeMaterial );
		var mesh2 = new THREE.Mesh( geometry, medGrayWireframeMaterial );
		var mesh3 = new THREE.Mesh( geometry, medGrayWireframeMaterial );
		mesh1.position.y = 500;
		mesh2.position.x = 300;
		mesh3.position.z = 400;
		pivot1.add( mesh1 );
		pivot2.add( mesh2 );
		pivot3.add( mesh3 );
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[0].rotateX(0.001);
			}
			this.container.children[0].rotateY(-0.002);
		}
	}
}

/** HoopScene */
class HoopScene extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TorusGeometry( 250, 10, 3, 50 );
		var geometry2 = new THREE.TorusGeometry( 200, 10, 3, 50 );
		var geometrySide1 = new THREE.TorusGeometry( 300, 3, 3, 50 );
		var mainCircle = new THREE.Mesh( geometry1, whiteWireframeMaterial );
		var mainCircle2 = new THREE.Mesh( geometry2, whiteWireframeMaterial );
		var sideCircle1 = new THREE.Mesh( geometrySide1, whiteWireframeMaterial );
		var sideCircle2 = new THREE.Mesh( geometrySide1, whiteWireframeMaterial );
		this.container.add(sideCircle1);
		this.container.add(sideCircle2);
		this.container.add(mainCircle);
		this.container.add(mainCircle2);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			if(isBeat) {
				this.container.children[0].rotateX(0.01);
				this.container.children[1].rotateY(0.01);
			}
			this.container.children[2].rotateZ(0.02);
			this.container.children[3].rotateY(0.005);
		}
	}
}

/** Tetrahedrons */
class Tetrahedrons extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TetrahedronGeometry(200);
		var geometry2 = new THREE.TetrahedronGeometry(200);
		var geometry3 = new THREE.TetrahedronGeometry(200);
		var geometry4 = new THREE.TetrahedronGeometry(200);
		var tet1 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		var tet2 = new THREE.Mesh( geometry2, medGrayWireframeMaterial );
		var tet3 = new THREE.Mesh( geometry3, medGrayWireframeMaterial );
		var tet4 = new THREE.Mesh( geometry4, medGrayWireframeMaterial );
		tet1.position.x = randomIntFromInterval(0, 500);
		tet1.position.y = -1 * randomIntFromInterval(500, 0);
		tet1.position.z = randomIntFromInterval(0, 300);
		tet2.position.x = randomIntFromInterval(0, 500);
		tet2.position.y = randomIntFromInterval(500, 0);
		tet2.position.z = randomIntFromInterval(0, 300);
		tet3.position.x = -1 * randomIntFromInterval(0, 500);
		tet3.position.y = randomIntFromInterval(500, 0);
		tet3.position.z = randomIntFromInterval(0, 300);
		tet4.position.x = -1 * randomIntFromInterval(0, 500);
		tet4.position.y = -1 * randomIntFromInterval(500, 0);
		tet4.position.z = randomIntFromInterval(0, 300);
		this.container.add(tet1);
		this.container.add(tet2);
		this.container.add(tet3);
		this.container.add(tet4);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volumeFactor = this.volume * 20;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			this.container.rotateX(0.01);
			if(isBeat) {
				this.container.children[0].rotateX(0.01);
				this.container.children[1].rotateY(0.01);
			}
			this.container.children[2].rotateZ(0.02);
			this.container.children[3].rotateY(0.005);
		}
	}
}

/** DiscScene */
class DiskScene extends Scene3D {
	start() {
		super.start();
		super.start();
		var geometry1 = new THREE.CircleGeometry(200, 32);
		var disk1 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		var disk2 = new THREE.Mesh( geometry1, whiteWireframeMaterial );
		var disk3 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		disk1.position.x = -300;
		disk2.position.x = 0;
		disk3.position.x = 300;
		this.container.add(disk1);
		this.container.add(disk2);
		this.container.add(disk3);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
			}
		}
	}
}

/** ThreeTorusScene */
class ThreeTorusScene extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TorusGeometry( 200, 3, 16, 100 );
		var disk1 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		var disk2 = new THREE.Mesh( geometry1, whiteWireframeMaterial );
		var disk3 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		disk1.position.x = -300;
		disk2.position.x = 0;
		disk3.position.x = 300;
		this.container.add(disk1);
		this.container.add(disk2);
		this.container.add(disk3);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
			}
			this.container.rotation.x = 0.01
		}
	}
}

/** SynchronizedCones */
class SynchronizedCones extends Scene3D {
	start() {
		super.start();
		super.start();
		var geometry1 = new THREE.CylinderGeometry( 150, 100, 200, 32 );
		var disk1 = new THREE.Mesh( geometry1, darkGrayWireframeMaterial );
		var disk2 = new THREE.Mesh( geometry1, medGrayWireframeMaterial );
		var disk3 = new THREE.Mesh( geometry1, darkGrayWireframeMaterial );
		disk1.position.x = -300;
		disk2.position.x = 0;
		disk3.position.x = 300;
		disk1.position.z = 100;
		disk2.position.z = 100;
		disk3.position.z = 100;
		this.container.add(disk1);
		this.container.add(disk2);
		this.container.add(disk3);
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
				childrenArray[i].rotation.x += Math.PI/384;
			}
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
let torusScene = new TorusScene("torus");
let circleRotatingScene = new CircleRotatingScene("circleRotating");
let knotScene = new KnotScene("knot");
let octahedronScene = new OctahedronScene("octahedron");
let nestedScene = new NestedScene("nested");
let darkIcosahedron = new DarkIcosahedron("darkIcosohedron");
let hoopScene = new HoopScene("hoopScene");
let moonScene = new MoonScene("moonScene");
let tetras = new Tetrahedrons("tetras");
let diskScene = new DiskScene("tetras");
let threeTorus = new ThreeTorusScene("tetras");
let cones = new SynchronizedCones("cones");

// When app loads, initially show the sphere scene
var current3Dscene = empty3Dscene;
current3Dscene.start();

// Then start choosing random 3D scenes:
let arrayOf3Dscenes = [
	empty3Dscene,
	empty3Dscene,
	empty3Dscene,
	sphereScene,
	planeScene,
	stickScene,
	torusScene,
	circleRotatingScene,
	knotScene,
	octahedronScene,
	nestedScene,
	darkIcosahedron,
	hoopScene,
	moonScene,
	tetras,
	diskScene,
	threeTorus,
	cones,
	hoopScene
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
 */
export default function(audioData) {

	// 3D scenes
	if(sphereScene != null) {
		sphereScene.audioTick(audioData);
	}
	if(planeScene != null) {
		planeScene.audioTick(audioData);
	}
	if(torusScene != null) {
		torusScene.audioTick(audioData);
	}
	if(circleRotatingScene != null) {
		circleRotatingScene.audioTick(audioData);
	}
	if(knotScene != null) {
		knotScene.audioTick(audioData);
	}
	if(octahedronScene != null) {
		octahedronScene.audioTick(audioData);
	}
	if(nestedScene != null) {
		nestedScene.audioTick(audioData);
	}
	if(darkIcosahedron != null) {
		darkIcosahedron.audioTick(audioData);
	}
	if(hoopScene != null) {
		hoopScene.audioTick(audioData);
	}
	if(moonScene != null) {
		moonScene.audioTick(audioData);
	}
	if(tetras != null) {
		tetras.audioTick(audioData);
	}
	if(diskScene != null) {
		diskScene.audioTick(audioData);
	}
	if(threeTorus != null) {
		threeTorus.audioTick(audioData);
	}
	if(cones != null) {
		cones.audioTick(audioData);
	}

	// 2D scenes
	if(discoScene != null) {
		discoScene.audioTick(audioData);
	}
	if(triangleScene != null) {
		triangleScene.audioTick(audioData);
	}
	if(circlesArray != null) {
		circlesArray.audioTick(audioData);
	}
	if(stickScene != null) {
		stickScene.audioTick(audioData);
	}
	if(bubblesArray != null) {
		bubblesArray.audioTick(audioData);
	}
	if(oneCircleScene != null) {
		oneCircleScene.audioTick(audioData);
	}
	if(beatLine != null) {
		beatLine.audioTick(audioData);
	}
	if(centeredCircles != null) {
		centeredCircles.audioTick(audioData);
	}
	if(rays != null) {
		rays.audioTick(audioData);
	}
	if(tallRectangles != null) {
		tallRectangles.audioTick(audioData);
	}
	if(centeredPolygon != null) {
		centeredPolygon.audioTick(audioData);
	}

	// rerender scene every update
	renderer.render(app3D, camera);
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

