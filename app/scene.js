/** Scene.js
 * Entry function for 2D and 3D displays.
 * Manages key presses.
 */

import * as scene2D from './scene2D';
import * as scene3D from './scene3D';
import * as video from './Video/videoManager'

/* KEYBOARD CONTROLS
 	Video controls are in the videoManager.
 	Keyboard tester:
 			window.addEventListener('keypress', function (e) {alert(e.keyCode)})

   2D  3D video
   |   |    |
 [ 2 ][ 3 ] ----- restart
  [ W ][ E ] ---- stop
   [ S ][ D ][ F ] --- random
     [ X ][ C ] - empty room
 */
var keypressed = null;
window.addEventListener('keydown', function (e) {
	keypressed = e.key;
	switch(keypressed) {
		case '2':
			scene2D.restart();
			break;
		case 'w':
			scene2D.stop();
			break;
		case 's':
			scene2D.random();
			break;
		case 'x':
			scene2D.empty();
			break;
		case '3':
			scene3D.restart();
			break;
		case 'e':
			scene3D.stop();
			break;
		case 'd':
			scene3D.random();
			break;
		case 'c':
			scene3D.empty()
			break;
		case 'f':
			video.random();
			break;
	}
}, false);
window.addEventListener('keyup', function (e) {
	keypressed = null;
})

/** * * * * * * * * * * Audio input function * * * * * * * * * * * * * * *
 * Fires every time new audio data is received.
 * Called from app.js.
 *
 * @param audioData
 */
export default function(audioData) {
	// Only feed audio data into the scenes that are currently on screen (not null).
	scene2D.audioReactive(audioData, keypressed);
	scene3D.audioReactive(audioData, keypressed);
}