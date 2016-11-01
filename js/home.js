include('js/lib/clock.js');
include('js/lib/OrbitControls.js');
include('js/lib/OBJLoader.js');
include('js/lib/stats.js');
include('js/lib/tween.js');

window.requestAnimationFrame = (function(){
return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
})();

function include(path) {
  var a=document.createElement("script");
  a.type = "text/javascript"; 
  a.src=path; 
  var head=document.getElementsByTagName("head")[0];
  head.appendChild(a);
}

var renderer, camera, scene, stats, light, controls, control, loader = new THREE.TextureLoader();
var w = window.innerWidth, h = window.innerHeight;
var g = 9.8;

function init() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(w, h);
	renderer.setClearColor(0x000000);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(200));
	camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 10000);
	camera.position.set(0, 250, 500);
	camera.lookAt(scene.position);

	light = new THREE.SpotLight(0xffffff);
	light.angle = 45;
	light.decay = 1.5;
	//light.penumbra = 0.001;
	light.position.set(0, 500, 0);
	scene.add(light);

	addFloor();
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	renderer.render(scene, camera);

}
/*
 * 动作：球掉下来，点一下炸成小球/货物掉下来，点一下血光四射
 * 地板：银色之类的
 *
 *
 */
function ball() {
	this.x = x;
	this.y = y;
	this.z = z;

	this.r = r;

	this.life = 10;
}

function addFloor() {
	var floorGeometry = new THREE.PlaneGeometry(800, 800, 40, 40);
	var floorMaterial = new THREE.MeshPhongMaterial();
	/*normalMap 法向贴图*/
	floorMaterial.map = loader.load('img/t1.jpg');
	floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
	floorMaterial.map.repeat.set(8, 8);

	var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
	floorMesh.receiveShadow = true;
	floorMesh.receiveShadow = true;
	floorMesh.rotation.x = -Math.PI/2;
	scene.add(floorMesh);
}

function mouseMove(e) {
	console.log(e.clientX);
}

function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

window.onload = function() {
	init();
	render();
}
document.addEventListener('mousemove', mouseMove, false);



