import AudioAnalyzer from './AudioAnalyzer/AudioAnalyzer';
import Debug from './Debug/Debug';
import datGui from './Debug/dat-gui';
import scene from './scene';
import './styles/appStyles.scss';
import './styles/themeColors.scss';
import videoManager from './Video/videoManager';

let audioAnalyzer = new AudioAnalyzer({
  volSens: 1,
  beatHoldTime: 45,
  beatDecayRate: .9,
  beatMin: .2
});
let debug = new Debug;

var startTime = Date.now();

// starts dat gui debug panel and videoManager when the window is loaded.
window.onload = function() {
  datGui(audioAnalyzer);
  videoManager();
};

/**
 *  Main render loop
 *  ----------------
 *  waveform - crazy jagged lines
 *  volume - average volume level
 *  levels - 16 levels, goes from bass to treble
 *  isBeat - when there's a beat
 *  beatCutOff - used to calculate when there's a beat, mainly used for debugger
 */
audioAnalyzer.start((audioData) => {
  // send data to canvas debugger
  debug.draw(audioData);
  // send data to scenes (both 2d and 3d)
  scene(audioData);
});

console.log('app loaded');
