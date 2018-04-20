/* Video management.
 * Video sources are listed in the index.html.
 * This code parses the playlist for all the video names and randomly plays
 * them after a random length of time between intervalMin and intervalMin using
 * a setTimeout function.
 */

/* Variables */
var videoPlayer = document.getElementById( 'video-player' );
var video = videoPlayer.getElementsByClassName( 'fullscreen-bg__video' )[0];
var playlist = videoPlayer.getElementsByClassName( 'fullscreen-bg__playlist' )[0];
var source = video.getElementsByTagName( 'source' );
var linkList = [];
var videoDirectory = 'video/';
var currentVideo = 0;
var allLinks = playlist.children;
var linkNumber = allLinks.length;
var i;
var filename;
let intervalMax = 600000; // 10min
let intervalMin = 300000; // 5min

export default function () {
	/**
	 * Set up video timer display element
	 */
	let videoTimerDisplay = document.createElement("li");
	videoTimerDisplay.id = 'scene2Dtimer';
	let t = document.createTextNode("initVideo");
	videoTimerDisplay.appendChild(t);
	document.getElementById('timers').appendChild(videoTimerDisplay);

	/**
	 * Save all video sources from playlist
	 */
	for ( i = 0; i < linkNumber; i++ ) {
		filename = allLinks[i].href;
		// Regex to capture file name without extension like .mp4
		linkList[i] = filename.match( /([^\/]+)(?=\.\w+$)/ )[0];
	}
	/**
	 * Entry function to play a random video.
	 */
	randomVideo();

	/**
	 * Select a video at random from the list of all in the html fullscreen-bg__playlist.
	 */
	function randomVideo() {
		// Create an interval of time. The video starts after this length of time.
		let videoInterval = randomIntFromInterval(intervalMin, intervalMax);
		setTimeout(randomVideo, videoInterval);

		// Remove the 'current-video' class from the current video.
		allLinks[currentVideo].classList.remove( 'current-video' );
		let randomVideoIndex = randomIntFromInterval(0, linkList.length - 1);
		playVideo(randomVideoIndex);

		// Format the interval for display in the corner
		var minutes = Math.floor(videoInterval / 60000);
		var seconds = videoInterval % 60;
		videoTimerDisplay.innerText = minutes + ':' + seconds + ';' + linkList[randomVideoIndex];
		console.log('Video] Picked the VIDEO with name: ' + linkList[randomVideoIndex] + ' INTERVAL: ' + videoInterval + ' ms.');
	}

	/** Play a video from the allLinks list with a given index.
	 *
	 * @param index
	 */
	function playVideo( index ) {
		allLinks[index].classList.add( 'current-video' );
		currentVideo = index;
		source[0].src = videoDirectory + linkList[index] + '.mp4';
		video.load();
		video.play();
	}

	/** Video keyboard control events
	 * 
	 */
	window.addEventListener('keypress', function (e) {
		switch(e.keyCode) {
			case 100:	// d	play random video
				randomVideo();
				break;
		}
	});
}

function randomIntFromInterval(min,max)
{
	return Math.floor(Math.random() * ( max - min + 1 ) + min);
}