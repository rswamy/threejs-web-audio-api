class Scene3D {
	constructor(sceneName) {
		this.container = new THREE.Object3D();
		this.sceneName = sceneName;
	}
	stop() {
		app3D.removeChild(this.container);
	}
	start() {
		app3D.addChild(this.container);
	}
}



export {
Scene3D
}