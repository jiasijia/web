include('js/lib/clock.js');
include('js/lib/OrbitControls.js');

window.requestAnimationFrame = (function(){
return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
          window.setTimeout(callback, 1000 / 60);
        };
})();

var renderer, camera, stats, camera, light, controls, control, loader = new THREE.TextureLoader();
var w = window.innerWidth, h = window.innerHeight;
var controls;
var perScene, perCamera;
var orthoScene, orthoCamera;

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  perScene = new THREE.Scene();
  perCamera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  perCamera.position.set(150, 150, 150);
  perCamera.lookAt(perScene.position);

  light = new THREE.DirectionalLight();
  light.position.set(100, 500, 200);
  light.castShadow = true;
  perScene.add(light);
  perScene.add(new THREE.AxisHelper(500));

  var sphere = new THREE.SphereGeometry(30, 10, 10);
  var sphereMesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    map: loader.load('img/t3.jpg'),
    bumpScale: 2
  }))  
  sphereMesh.material.map.wrapT = sphereMesh.material.map.wrapS = THREE.RepeatWrapping;
  sphereMesh.material.map.repeat.set(4,4);
  sphereMesh.name = 'sphere';

  perScene.add(sphereMesh);

  /*2d元素*/
  //overlay2d();
  /*纹理地板*/
  addFloor()
  /*用动态的canvas做纹理*/
  canvasTexture();
  /*用video做动态纹理*/
  //videoTexture();
  initControls();
  render();
  
}


function overlay2d() {
  orthoScene = new THREE.Scene();
  orthoCamera = new THREE.OrthographicCamera(w/-2, w/2, h/2, h/-2, 0, 5000);
  orthoCamera.position.set(0, 0, 0);

  var spriteMaterial = new THREE.SpriteMaterial({
    map: loader.load('img/36.jpg'),
  });
  var sprite = new THREE.Sprite(spriteMaterial);
  sprite.position.set(w/-3,h/3,0);
  sprite.scale.set(w/3,h/4);
  orthoScene.add(sprite);
}


function canvasTexture() {
  var canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;

  clock(canvas);

  var canvasMesh = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshLambertMaterial({
      map: new THREE.Texture(canvas),
    })
  );
  canvasMesh.position.y = 40;
  canvasMesh.name = 'canvasMesh';
  perScene.add(canvasMesh);
}

function videoTexture() {
  var video = document.getElementById('video');
  videoTexture = new THREE.Texture(video);

  var videoMesh = new THREE.Mesh(new THREE.CubeGeometry(100, 60, 2),
    new THREE.MeshLambertMaterial({
      map: videoTexture,
    })
  )
  videoMesh.name = 'videoMesh';
  videoMesh.position.set(50, 50, 100);
  videoMesh.rotation.set(-Math.PI/3, Math.PI/8, 0);
  perScene.add(videoMesh);

}

function include(path) {
  var a=document.createElement("script");
  a.type = "text/javascript"; 
  a.src=path; 
  var head=document.getElementsByTagName("head")[0];
  head.appendChild(a);
}

function addFloor() {
  var floorGeometry = new THREE.PlaneGeometry(500, 500, 20, 20);
  var floorMaterial = new THREE.MeshPhongMaterial({
    bumpScale: 0
  });
  /*normalMap 法向贴图*/
  floorMaterial.map = loader.load('img/t1.jpg');
  floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
  floorMaterial.map.repeat.set(8, 8);

  var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI/2;
  perScene.add(floorMesh);
}

function initControls() {
  control = new THREE.OrbitControls(perCamera, renderer.domElement);
}

var theta = 0;
function render() {
  var s = perScene.getObjectByName('sphere');
  theta += 0.01;

  s.position.x = 100 * Math.cos(theta);
  s.position.y = 100 * Math.sin(theta);

  perScene.getObjectByName('canvasMesh').material.map.needsUpdate = true;
  //perScene.getObjectByName('videoMesh').material.map.needsUpdate = true;

  //perCamera.lookAt(s.position);
  renderer.clear();
  renderer.render(perScene, perCamera);
  //renderer.clearDepth();
  //renderer.render(orthoScene, orthoCamera);

  requestAnimationFrame(render);
}

window.onload = init;
window.addEventListener('resize', function() {
  perCamera.aspect = window.innerWidth / window.innerHeight;
  perCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false)