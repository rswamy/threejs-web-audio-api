import * as THREE from 'three';
import axis from './Debug/axis';
import TWEEN from './Tween/Tween';
import * as PIXI from 'pixi.js';

/* KEYBOARD CONTROLS
 	Video controls are in the videoManager.
 	Keyboard tester:
 			window.addEventListener('keypress', function (e) {alert(e.keyCode)})

   2D   3D
   |    |
 [ 1 ][ 2 ] ----- restart
  [ Q ][ W ] ---- stop
   [ A ][ S ][ D ] --- random
     [ Z ][ X ] - empty room
 */
window.addEventListener('keypress', function (e) {
	switch(e.keyCode) {
		case 49: // 1
			current2Dscene.stop();
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
			current3Dscene.stop();
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
		// create disco ball flecks
		let fleckSpacing = 100;
		let numberOfFlecks = 30;
		// create many flecks
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0x000000, 0.5);
			discoFleck.drawCircle(0, 0, randomIntFromInterval(0.3 * fleckSpacing, 1.3 * fleckSpacing));
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
				child.scale.x = 1 + Math.cos(volume);
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
				var childrenArray = this.container.children;
				childrenArray.forEach(function (child) {
					child.scale.x = 1 + (volume * 2);
					child.scale.y = 1 + (volume * 2);
				});
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
				var childrenArray = this.container.children;
				childrenArray.forEach(function (child) {
					child.scale.x = 1 + (volume * 2);
					child.scale.y = 1 + (volume * 2);
				})

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
				graphics.filters = [blurFilter2]
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
				graphics.filters = [blurFilter2]
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
		thing.filters = [blurFilter2]
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
				var childrenArray = this.container.children;
				childrenArray.forEach(function (child) {
					child.scale.x = 1 + (volume * 2);
					child.scale.y = 1 + (volume * 2);
				})
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

/** Skinny rectangles blurred with volume */
class VerticalRectangles extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let numberOfFlecks = 50;
		// create many flecks
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0xffffff, 0.5);
			discoFleck.drawRect(
				randomIntFromInterval(0, windowWidth),
				randomIntFromInterval(0, windowHeight),
				10,
				randomIntFromInterval(30, 250)
			);
			discoFleck.endFill();
			this.container.addChild(discoFleck);
		}
		this.container.filters = [blurFilter1];
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		var count = this.count;
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
			});
			blurFilter1.blur = 30 * (volume);
		}
	}
}

/** these are actually vertical */
class HorizontalLines extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let numberOfFlecks = 12;
		// create many flecks
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0xaaaaaa, 0.5);
			discoFleck.drawRect(
				windowWidth/numberOfFlecks * i,
				0,
				5,
				windowHeight,
			);
			discoFleck.endFill();
			this.container.addChild(discoFleck);
		}
		this.container.filters = [blurFilter1];
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		var count = this.count;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 2 == 0) {
					child.scale.y = 1 + (volume * -1);
				}
				else {
					child.scale.x = 2 + (volume);
				}
			});
			blurFilter1.blur = 9 * (volume);
		}
	}
}

/** Skinny rectangles blurred with volume */
class CosineLines extends Scene2D {
	start() {
		super.start();
		// create disco ball flecks
		let numberOfFlecks = 16;
		// create many flecks
		for (let i = 0; i < numberOfFlecks; i++) {
			let discoFleck = new PIXI.Graphics();
			discoFleck.beginFill(0xffffff, 0.5);
			discoFleck.drawRect(
				0,
				windowHeight/numberOfFlecks * i,
				windowWidth,
				2
			);
			discoFleck.endFill();
			this.container.addChild(discoFleck);
		}
		this.container.filters = [blurFilter1];
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		var count = this.count;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray.forEach(function (child) {
				if(childrenArray.indexOf(child) % 3 == 0) {
					child.position.y += Math.cos(count) * 30  + 0.001;
				}
			});
			blurFilter1.blur = 8 * (volume);
		}
	}
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
var meshDepthMaterial = new THREE.MeshDepthMaterial();
var meshLambertWire = new THREE.MeshLambertMaterial({
	wireframe: true
});
var meshNormal = new THREE.MeshNormalMaterial({
	wireframe: true
});

var whitePointsMaterial = new THREE.PointsMaterial( {
	color: 0xffffff,
	size: Math.random()*20 + 0.02
} );

var whiteWireframeMaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	wireframe: true
} );
var whiteDashedLineMaterial = new THREE.LineDashedMaterial( {
	color: 0xffffff,
	dashSize: 2,
	gapSize: 0.5
} );
var randomMaterial = new THREE.LineDashedMaterial( {
	color: Math.random() * 0xffffff,
	dashSize: 1,
	gapSize: 0.5
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
		let sphere = new THREE.Points(sphereGeometry, whitePointsMaterial);
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

/** Plane */
class DotArray extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.CylinderGeometry( 250, 300, 16, 16 );
		var numberOfDisks = 13;
		var disk;
		for(var i = 0; i < numberOfDisks; i++) {
			disk = new THREE.LineSegments( geometry1, randomMaterial );
			disk.rotation.x = Math.PI/numberOfDisks * i;
			this.container.add(disk);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
				var color = Math.random();
				childrenArray[i].material.color = new THREE.Color( color, color, color );
				childrenArray[i].material.needsUpdate = true;
				childrenArray[i].rotation.x += 0.001 * i;
			}
			this.container.rotation.x = 0.1;
		}
	}
}

/** A group of long boxes slowly rotating and flashing */
class LongBoxes extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.BoxGeometry(
			100,
			1000,
			100
		);
		var numberOfBoxes = 7;
		var box;
		for(var i = 0; i < numberOfBoxes; i++) {
			box = new THREE.Mesh( geometry1, whiteWireframeMaterial );
			// box.rotation.x = Math.PI/numberOfBoxes * i;
			box.position.x = (100 * i)-numberOfBoxes*100/2
			this.container.add(box);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
				var color = Math.random();
				childrenArray[i].material.color = new THREE.Color( color, color, color );
				childrenArray[i].material.needsUpdate = true;
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.y -= 0.003
				}
			}
			// this.container.rotation.x = 0.1;
		}
	}
}

/** Dots slowly turning */
class GalaxyDots extends Scene3D {
	start() {
		super.start();
		var numberOfCircles = 6;
		var box;
		for(var i = 0; i < numberOfCircles; i++) {
			box = new THREE.Points(
				new THREE.CylinderGeometry(
					randomIntFromInterval(30, 600),
					randomIntFromInterval(30, 600),
					100, 16
				),
				whitePointsMaterial
			);
			box.rotation.x = Math.PI/2;
			this.container.add(box);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				var color = Math.random()-0.5;
				childrenArray[i].rotation.y -= 0.0001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].scale.x -= Math.random()*(0.003)+0.001
					this.container.children[selectedBox].scale.z += Math.random()*(0.003)+0.001
				}
			}
		}
	}
}

/** concentric cylinders flashing and turning on beat */
class FlashingTunnelCircles extends Scene3D {
	start() {
		super.start();
		var numberOfCircles = 4;
		var box;
		for(var i = 0; i < numberOfCircles; i++) {
			box = new THREE.Mesh(
				new THREE.CylinderGeometry(randomIntFromInterval(400,600), 500, 300, 16),
				whiteWireframeMaterial
			);
			box.rotation.x = Math.PI/2;
			this.container.add(box);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				var color = Math.random()-0.5;
				childrenArray[i].material.color = new THREE.Color( color, color, color );
				childrenArray[i].material.needsUpdate = true;
				childrenArray[i].rotation.y -= 0.0001 * i;

			}
			if(isBeat) {
				this.container.rotation.x = 0.1;
				var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
				this.container.children[selectedBox].rotation.y -= Math.random()*(0.003)+0.001
			}
		}
	}
}

/** concentric cylinders flashing and turning on beat */
class FlashingTunnelCircles2 extends Scene3D {
	start() {
		super.start();
		var numberOfCircles = 4;
		var box;
		for(var i = 0; i < numberOfCircles; i++) {
			box = new THREE.LineSegments(
				new THREE.CylinderGeometry(
					randomIntFromInterval(400,600),
					randomIntFromInterval(50,400),
					200, 16),
				whiteDashedLineMaterial
			);
			box.rotation.x = Math.PI/2;
			this.container.add(box);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				var color = Math.random()-0.5 + 0.001;
				childrenArray[i].rotation.y -= 0.0001 * i;
				if(i%2 == 0) {
					childrenArray[i].scale.x = 0.01 + 2 * Math.cos(this.count);
					childrenArray[i].scale.y = 0.01 + 2 * Math.cos(this.count);
				}
			}
			if(isBeat) {
				this.container.rotation.x = 0.1;
				var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
				this.container.children[selectedBox].rotation.y -= Math.random()*(0.03)+0.001
				childrenArray[i].material.color = new THREE.Color( color, color, color );
				childrenArray[i].material.needsUpdate = true;
			}
		}
	}
}

/** rotate torus arcs that look like macaroni around each other */
class RotateMacaroni extends Scene3D {
	start() {
		super.start();
		var macaroni0 = new THREE.Mesh(
			new THREE.TorusGeometry(
				1*100 + 200, // radius
				100,	// radius of tube
				8,		// radial segments
				8,		// tubular segments
				Math.PI/2	// arc
			), meshLambertWire
		);
		var macaroni1 = new THREE.Mesh(new THREE.TorusGeometry(2*100 + 200, 100, 8, 16, Math.PI), meshLambertWire);
		var macaroni2 = new THREE.Mesh(new THREE.TorusGeometry(3*100 + 200, 100, 8, 16, Math.PI), meshLambertWire);
		var macaroni3 = new THREE.Mesh(new THREE.TorusGeometry(4*100 + 200, 100, 8, 16, Math.PI), meshLambertWire);
		var macaroni4 = new THREE.Mesh(new THREE.TorusGeometry(5*100 + 200, 100, 8, 16, Math.PI), meshLambertWire);
		macaroni1.rotation.y = Math.PI/2;
		macaroni2.rotation.z = -Math.PI/2;
		macaroni3.rotation.x = Math.PI/3;
		macaroni4.rotation.y = -Math.PI/2;
		this.container.add(macaroni0);
		this.container.add(macaroni1);
		this.container.add(macaroni2);
		this.container.add(macaroni3);
		this.container.add(macaroni4);
		this.container.rotation.y = Math.PI/4;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.z -= Math.random()*(0.003)+0.005;
				childrenArray[i].rotation.y -= 0.0001 * Math.sin(this.count)  + 0.001;
			}
			if(isBeat) {
				var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
				childrenArray[selectedBox].rotation.x -= 0.005
				this.container.rotation.x = 0.1;
			}
		}
	}
}

/** concentric cylinders to look like a tunnel */
class TunnelAttempt extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.LineSegments(
					new THREE.TorusGeometry( 100 * (i + 1), 30, 3, 20 ),
					whiteDashedLineMaterial
				)
			);
		}
		this.container.position.z -= 600;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].position.z = 300 * Math.cos(this.count) * i + 0.001;
			}
			var sin = Math.sin(this.count)  + 0.001;
			this.container.rotation.y -= 0.01 * Math.cos(this.count) + 0.001;
			this.container.rotation.z -= 0.05 * sin + 0.001;
			this.container.rotation.x -= 0.01 * sin + 0.001;
		}
	}
}

/** concentric cylinders to look like a tunnel */
class TunnelAttempt2 extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.LineSegments(
					new THREE.TorusGeometry( 100 * (i + 1), 30, 3, 20 ),
					whiteDashedLineMaterial
				)
			);
		}
		this.container.position.z -= 600;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		var volume = this.volume;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			var sin = Math.sin(this.count) + 0.001;
			var cos = Math.cos(this.count) + 0.001;
			for(let i = 0; i < childrenArray.length; i++) {
				if(i % 2 == 0){
					childrenArray[i].rotation.z = -1 * cos/8;
				}
				else {
					childrenArray[i].rotation.z = cos/12;
					childrenArray[i].scale.z += 2*volume * cos;
					if(childrenArray[i].scale.z > 10) {
						childrenArray[i].scale.z = 1
					}
				}
			}

			this.container.rotation.y -= 0.005 * Math.cos(this.count) + 0.001;
			this.container.rotation.x -= 0.04 * sin;
			// this.container.rotation.x -= 0.01 * sin;
		}
	}
}

/** dots in a crown shape rotating not reactive */
class DotsCrown extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.Points(
					new THREE.TorusGeometry( 100 * (i + 1), 3, 3, 20 ),
					whitePointsMaterial
				)
			);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			var cos = Math.cos(this.count);
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].scale.z = 30 * cos * i;
			}
			this.container.rotation.x -= 0.01 * cos;
			this.container.rotation.y += 0.005 * Math.sin(this.count) + 0.001;
		}
	}
}

/** same as DotsCrown except it's a line segment */
class LineCrown extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.LineSegments(
					new THREE.TorusGeometry( 100 * (i + 1), 3, 3, 20 ),
					whiteDashedLineMaterial
				)
			);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			var cos = Math.cos(this.count);
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].scale.z = 30 * cos * i + 0.001;
			}
			this.container.rotation.x -= 0.01 * cos;
			this.container.rotation.y += 0.005 * Math.sin(this.count) + 0.001;
		}
	}
}

/** Audio reactive toruses */
class AdvancedTorus extends Scene3D {
	start() {
		super.start();
		let numberOfCircles = 10;
		for(var i = 0; i < numberOfCircles; i++) {
			this.container.add(
				new THREE.Mesh(
					new THREE.TorusGeometry( 100 * (i + 1), 3, 3, 20 ),
					whiteWireframeMaterial
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
			if(isBeat) {
				childrenArray[randomIntFromInterval(0, childrenArray.length - 1)].scale.z = -30 * Math.cos(volume);
			}
			//this.container.rotation.x -= 0.01 * cos * volume;
			//this.container.rotation.y += 0.005 * Math.sin(this.count) * volume;
		}
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

/** Diagonal Rectagnels */
class DiagonalRectangles extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.BoxGeometry(
			100,
			2000,
			100
		);
		var numberOfBoxes = 5;
		var box;
		for(var i = 0; i < numberOfBoxes; i++) {
			box = new THREE.Mesh( geometry1, whiteWireframeMaterial );
			// box.rotation.x = Math.PI/numberOfBoxes * i;
			box.position.x = (100 * i)-numberOfBoxes*100/2
			this.container.add(box);
		}
		this.container.rotation.x = Math.PI/3;
		this.container.position.y = 200;
		this.container.position.z = -300;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var volume = this.volume;
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += Math.PI/384;
				var color = Math.random();
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].scale.x += 3
					if(this.container.children[selectedBox].scale.x > 30) {
						this.container.children[selectedBox].scale.x = 1
					}
				}
			}
			this.container.rotation.x = 3 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** Cubes on screen each warping in different ways */
class ArrayOfCubes extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.BoxGeometry(
			50,
			50,
			50
		);
		var boxSpacing = 100;
		var boxesAcross = 8;
		var boxesDown = 4;
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.Mesh( geometry1, meshLambertWire );
				box.rotation.x = Math.random() * Math.PI;
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.z = 300;
		this.container.position.x = -boxesAcross/2*50 - 150;
		this.container.position.y = -boxesDown/2*50 - 50;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.x += Math.PI/12;
					this.container.children[selectedBox].scale.x += 1;
					if(this.container.children[selectedBox].scale.x > 5) {
						this.container.children[selectedBox].scale.x = 1
					}
				}
			}
			// this.container.rotation.x = 6 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** Cubes on screen each warping in different ways */
class ArrayOfCubeDots extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.BoxGeometry(
			50,
			50,
			50
		);
		var boxSpacing = 100;
		var boxesAcross = 8;
		var boxesDown = 4;

		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				var cubePointsMat = new THREE.PointsMaterial( {
					color: 0xffffff,
					size: Math.random()*20
				} );
				let box = new THREE.Points( geometry1, cubePointsMat );
				box.rotation.x = Math.random() * Math.PI;
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.z = 300;
		this.container.position.x = -boxesAcross/2*50 - 150;
		this.container.position.y = -boxesDown/2*50 - 50;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.x += Math.PI/12;
					this.container.children[selectedBox].scale.x += 1;
					if(this.container.children[selectedBox].scale.x > 5) {
						this.container.children[selectedBox].scale.x = 1
					}
				}
			}
			// this.container.rotation.x = 6 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** Using three cylinders to look like laser beams */
class FakeLasers extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.CylinderGeometry(
			250, // radius
			1,	// bottom radius
			400, // height
			32	// radial segments
		);
		let laser1 = new THREE.Mesh( geometry1, meshLambertWire );
		let laser2 = new THREE.Mesh( geometry1, meshLambertWire );
		let laser3 = new THREE.Mesh( geometry1, meshLambertWire );
		laser1.position.x = 200;
		laser3.position.x = -200;
		let pivot = new THREE.Object3D();
		pivot.add(laser1);
		pivot.add(laser2);
		pivot.add(laser3);
		pivot.position.y = 200;
		this.container.add(pivot);
		this.container.position.z = 300;
		this.container.position.y = 200;
		this.container.rotation.x = Math.PI/2;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children[0].children;
			childrenArray[0].rotation.x = Math.sin(this.count / Math.PI) + 0.001;
			childrenArray[0].rotation.z = Math.sin(this.count / Math.PI) + 0.001;
			childrenArray[2].rotation.x = Math.sin(this.count / Math.PI) + 0.001;
			childrenArray[2].rotation.z = -Math.sin(this.count / Math.PI) + 0.001;
			for(let i = 0; i < childrenArray.length; i++) {
				if(isBeat) {
					childrenArray[1].scale.x += this.volume * 3;
					if(childrenArray[1].scale.x > 5) {
						childrenArray[1].scale.x = 1
					}
				}
			}
			this.container.rotation.x = 12 * Math.sin(this.count) + 2 * Math.PI/2;
		}
	}
}

/** Tetrahedrons on screen each warping in different ways */
class ArrayOfTetrahedrons extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TetrahedronGeometry(
			50 // radius
		);
		var boxSpacing = 100;
		var boxesAcross = 8;
		var boxesDown = 4;
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.Mesh( geometry1, meshLambertWire );
				box.rotation.x = Math.random() * Math.PI;
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.z = 300;
		this.container.position.x = -boxesAcross/2*50 - 150;
		this.container.position.y = -boxesDown/2*50 - 50;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.x += Math.PI/12;
					this.container.children[selectedBox].scale.x += 1;
					if(this.container.children[selectedBox].scale.x > 5) {
						this.container.children[selectedBox].scale.x = 1
					}
				}
			}
			// this.container.rotation.x = 6 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** same as array of tetrahedrons except they dont scale */
class ArrayOfTetrahedrons2 extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.TetrahedronGeometry(
			50 // radius
		);
		var boxSpacing = 100;
		var boxesAcross = 8;
		var boxesDown = 4;
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.Mesh( geometry1, meshLambertWire );
				box.rotation.x = Math.random() * Math.PI;
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.z = 300;
		this.container.position.x = -boxesAcross/2*50 - 150;
		this.container.position.y = -boxesDown/2*50 - 50;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += 0.001 * i;
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.x += Math.PI/12;
					this.container.children[selectedBox].rotation.z += Math.PI/24;
					this.container.children[selectedBox].rotation.y += Math.PI/128;
				}
			}
			// this.container.rotation.x = 6 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** Not actually a shader...just ninja stars moving around */
class ShaderScene extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.RingGeometry(
			10, // innerradius
			70, 	// outer radius
			6,	// theta segments
			1	// phi segments
		);
		var boxSpacing = 100;
		var boxesAcross = 5;
		var boxesDown = 3;
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.Mesh( geometry1, meshLambertWire );
				box.rotation.x = Math.random() * Math.PI;
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.z = 300;
		this.container.position.x = -boxesAcross/2*50 - 150;
		this.container.position.y = -boxesDown/2*50 - 50;

	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				childrenArray[i].rotation.y += 0.002 * i;
				if(i%3 == 0) {
					childrenArray[i].rotation.x += 0.2 * this.volume;
				}
				if(isBeat) {
					var selectedBox = randomIntFromInterval(0, childrenArray.length - 1);
					this.container.children[selectedBox].rotation.x += Math.PI/12;
					this.container.children[selectedBox].scale.x += 1;
					if(this.container.children[selectedBox].scale.x > 5) {
						this.container.children[selectedBox].scale.x = 1
					}
				}
			}
			// this.container.rotation.x = 6 * Math.sin(this.count) + 2 * Math.PI;
		}
	}
}

/** Bunch of circles in an array doing things */
class FlyingCircles extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.CircleGeometry(
			Math.random() * 100 + 75, // radius random 50 to 100
			16 // segments
		);
		var boxSpacing = 200;
		var boxesAcross = 6;
		var boxesDown = 4;
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.Mesh( geometry1, meshLambertWire );
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.x = -(boxesAcross-1)*100 + 100;
		this.container.position.y = -(boxesDown-1)*100 - 50;
		this.container.rotation.y = Math.PI/12;
		this.container.rotation.x = -Math.PI/24;
		this.container.rotation.z = Math.PI/24;
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			for(let i = 0; i < childrenArray.length; i++) {
				if(i%randomIntFromInterval(0,childrenArray.length) == 0) {
					childrenArray[i].rotation.y += 0.2 * this.volume;
				}
				if(i%2 == 0) {
					childrenArray[i].rotation.x += 0.2 * this.volume;
				}
				else {
					if(isBeat) {
						childrenArray[i].rotation.z += 0.2 * this.volume;
					}
				}
			}
		}
	}
}

/** Bunch of spheres in an array doing things */
class BunchOfSpheres extends Scene3D {
	start() {
		super.start();
		var geometry1 = new THREE.SphereGeometry(
			Math.random() * 100 + 75, // radius random 50 to 100
			8, // width segments
			6 // height segments
		);
		var boxSpacing = 200;
		var boxesAcross = 6;
		var boxesDown = 4;
		let box = new THREE.LineSegments(
			new THREE.SphereGeometry(
				200, 8, 6
			), whiteDashedLineMaterial );
		box.position.x = boxesAcross/2 * 100;
		box.position.y = boxesDown/2 * 100;
		this.container.add(box);
		for(let i = 0; i < boxesAcross; i++) {
			for(let j = 0; j < boxesDown; j++) {
				let box = new THREE.LineSegments( geometry1, whiteDashedLineMaterial );
				box.position.x = (boxSpacing * i);
				box.position.y = (boxSpacing * j);
				this.container.add(box);
			}
		}
		this.container.position.x = -(boxesAcross-1)*100;
		this.container.position.y = -(boxesDown-1)*100;

	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			childrenArray[0].scale.x += 0.2 * this.volume;
			childrenArray[0].scale.y += 0.2 * this.volume;
			if(childrenArray[0].scale.x > 5) {
				childrenArray[0].scale.x = 1
			}
			if(childrenArray[0].scale.y > 5) {
				childrenArray[0].scale.y = 1
			}

			for(let i = 1; i < childrenArray.length; i++) {
				if(i%3 == 0) {
					childrenArray[i].rotation.y += 0.2 * this.volume;
				}
				if(i%2 == 0) {
					childrenArray[i].rotation.x += 0.2 * this.volume;
				}
				else {
					if(isBeat) {
						childrenArray[i].rotation.z += 0.2 * this.volume;
					}
				}
			}
		}
	}
}

/** Tetrahedrons zoomed in the centered */
class CenteredTetrahedron extends Scene3D {
	start() {
		super.start();
		let numberOfTets = 10;
		for(let i = 0; i < numberOfTets; i++) {
			var geometry1 = new THREE.TetrahedronGeometry(
				Math.random() * 150 * i + 100 // radius
			);
			let tet = new THREE.LineSegments(geometry1, whiteDashedLineMaterial);
			this.container.add(tet);
		}
	}
	audioTick(audioData) {
		super.audioTick(audioData);
		var isBeat = this.isBeat;
		if((this.container != null) && (typeof this.container != 'undefined')) {
			var childrenArray = this.container.children;
			// childrenArray[0].scale.x += 0.2 * this.volume;
			// childrenArray[0].scale.y += 0.2 * this.volume;
			// if(childrenArray[0].scale.x > 5) {
			// 	childrenArray[0].scale.x = 1
			// }
			// if(childrenArray[0].scale.y > 5) {
			// 	childrenArray[0].scale.y = 1
			// }

			for(let i = childrenArray.length - 1; i > 0; i--) {
				childrenArray[i].rotation.z += 0.02 * this.volume * i;
				childrenArray[i].rotation.y += 0.01 * this.volume * i;
			}
		}
	}
}

/** sticks */
class StickScene2 extends Scene3D {
	start() {
		super.start();
		let pivot;
		let stickEndWidth = 10;
		let stickLength = 500;
		const numberOfSticks = 10;
		let stickGapDistance = 100;
		let stickGroup = new THREE.Group();
		var stickMaterial = new THREE.PointsMaterial( {
			color: 0xffffff,
			size: Math.random()*40 + 20
		} );
		// create an assortment of sticks
		for(let i = 0; i < numberOfSticks; i++) {
			let stickGeometry = new THREE.BoxGeometry( stickLength, stickEndWidth, stickEndWidth );
			let stick = new THREE.Points( stickGeometry, stickMaterial );
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
			this.container.rotateZ(0.01);
			this.container.rotateX(-0.001);
			this.container.rotateY(0.1);
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
// new scenes
let dotScene = new DotArray("dotArray");
let longBoxScene = new LongBoxes("boxes");
let galaxyDots = new GalaxyDots("galaxyDogs");
let flashingTunnelCircles = new FlashingTunnelCircles("flashingTunnelCircles");
let rotateMacaroni = new RotateMacaroni("rotateMacaroni");
let tunnelAttempt = new TunnelAttempt("tunnelAttempt");
let dotsCrown = new DotsCrown("tunnelAttempt");
let advancedTorus = new AdvancedTorus("advancedTorus");
let lineCrown = new LineCrown("lineCrown");
let diagonalRectangles = new DiagonalRectangles("diagonalRectangles");
let arrayOfCubes = new ArrayOfCubes("arrayOfCubes");
let fakeLasers = new FakeLasers("fakeLasers");
let arrayOfTetrahedrons = new ArrayOfTetrahedrons("arrayOfTetrahedrons");
let shaderScene = new ShaderScene("shaderScene");
let flyingCircles = new FlyingCircles("flyingCircles");
let bunchOfSpheres = new BunchOfSpheres("bunchOfSpheres");
let centeredTets = new CenteredTetrahedron("bunchOfSpheres");
let stickScene2 = new StickScene2("stickScene2");
let tunnelAttempt2 = new TunnelAttempt2("tunnelAttempt2");
let arrayOfCubeDots = new ArrayOfCubeDots("arrayOfCubeDots");
let arrayOfTetrahedrons2 = new ArrayOfTetrahedrons2("arrayOfTetrahedrons2");
let flashingTunnelCircles2 = new FlashingTunnelCircles2("flashingTunnelCircles2");
let advancedTorusDots = new AdvancedTorusDots("advancedTorusDots");


// Create a list of 2D scenes
let emptyScene = new Scene2D("empty");
let discoScene = new DiscoScene("disco");
let triangleScene = new TriangleScene("triangle");
let circlesArray = new CirclesArray("circlesArray");
let bubblesArray = new BubblesArray("bubbles");
let centeredCircles = new CenteredCircles("centered");
let rays = new RaysScene("rays");
let tallRectangles = new TallRectangles("tallRectangles");
let centeredPolygon = new CenteredPolygon("audioTriangles");
let fixedTriangles = new FixedTriangleRow("fixedTriangles");
// new scenes
let verticalRectangles = new VerticalRectangles("verticalRectangles");
let horizontalLines = new HorizontalLines("horizontalLines");
let cosineLines = new CosineLines("cosineLines");


// When app loads, initially show empty 2D and 3D scenes.
var current3Dscene = empty3Dscene;
current3Dscene.start();

var current2Dscene = emptyScene;
current2Dscene.start();

// Array of 3D scenes to choose from
let arrayOf3Dscenes = [
	empty3Dscene,
	empty3Dscene,
	empty3Dscene,
	sphereScene,
	planeScene,
	stickScene,
	tetras,
	dotScene,
	longBoxScene,
	galaxyDots,
	rotateMacaroni,
	flashingTunnelCircles,
	tunnelAttempt,
	dotsCrown,
	advancedTorus,
	lineCrown,
	advancedTorus,
	arrayOfCubes,
	fakeLasers,
	arrayOfTetrahedrons,
	shaderScene,
	bunchOfSpheres,
	centeredTets,
	flyingCircles,
	stickScene2,
	tunnelAttempt2,
	arrayOfCubeDots,
	arrayOfTetrahedrons2,
	flashingTunnelCircles2,
	advancedTorusDots,
	diagonalRectangles
];

// Array of 2D scenes to choose from
let arrayOf2Dscenes = [
	emptyScene,
	emptyScene,
	emptyScene,
	emptyScene,
	discoScene,
	triangleScene,
	circlesArray,
	bubblesArray,
	//oneCircleScene,
	triangleScene,
	centeredCircles,
	rays,
	tallRectangles,
	centeredPolygon,
	verticalRectangles,
	horizontalLines,
	fixedTriangles,
	cosineLines
];

// Then start choosing a random 2D and random 3D scene
random2Dscene();
random3Dscene();

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

	// Only feed audio data into the scenes that are currently on screen (not null).

	// 3D scenes
	if(advancedTorusDots != null) {
		advancedTorusDots.audioTick(audioData);
	}
	if(flashingTunnelCircles2 != null) {
		flashingTunnelCircles2.audioTick(audioData);
	}
	if(arrayOfTetrahedrons2 != null) {
		arrayOfTetrahedrons2.audioTick(audioData);
	}
	if(arrayOfCubeDots != null) {
		arrayOfCubeDots.audioTick(audioData);
	}
	if(tunnelAttempt2 != null) {
		tunnelAttempt2.audioTick(audioData);
	}
	if(stickScene2 != null) {
		stickScene2.audioTick(audioData);
	}
	if(centeredTets != null) {
		centeredTets.audioTick(audioData);
	}
	if(bunchOfSpheres != null) {
		bunchOfSpheres.audioTick(audioData);
	}
	if(flyingCircles != null) {
		flyingCircles.audioTick(audioData);
	}
	if(shaderScene != null) {
		shaderScene.audioTick(audioData);
	}
	if(arrayOfTetrahedrons != null) {
		arrayOfTetrahedrons.audioTick(audioData);
	}
	if(fakeLasers != null) {
		fakeLasers.audioTick(audioData);
	}
	if(arrayOfCubes != null) {
		arrayOfCubes.audioTick(audioData);
	}
	if(diagonalRectangles != null) {
		diagonalRectangles.audioTick(audioData);
	}
	if(advancedTorus != null) {
		advancedTorus.audioTick(audioData);
	}
	if(lineCrown != null) {
		lineCrown.audioTick(audioData);
	}
	if(dotsCrown != null) {
		dotsCrown.audioTick(audioData);
	}
	if(tunnelAttempt != null) {
		tunnelAttempt.audioTick(audioData);
	}
	if(rotateMacaroni != null) {
		rotateMacaroni.audioTick(audioData);
	}
	if(flashingTunnelCircles != null) {
		flashingTunnelCircles.audioTick(audioData);
	}
	if(galaxyDots != null) {
		galaxyDots.audioTick(audioData);
	}
	if(longBoxScene != null) {
		longBoxScene.audioTick(audioData);
	}
	if(dotScene != null) {
		dotScene.audioTick(audioData);
	}
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

	if(cosineLines != null) {
		cosineLines.audioTick(audioData);
	}
	if(horizontalLines != null) {
		horizontalLines.audioTick(audioData);
	}
	if(verticalRectangles != null) {
		verticalRectangles.audioTick(audioData);
	}
	// 2D scenes
	if(fixedTriangles != null) {
		fixedTriangles.audioTick(audioData);
	}
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

