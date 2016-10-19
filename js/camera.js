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

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  camera.position.set(15, 15, 15);
  camera.lookAt(scene.position);

  light = new THREE.SpotLight();
  light.position.set(0, 100, 50);
  light.castShadow = true;
  scene.add(light);
  scene.add(new THREE.AxisHelper(100));

  initGui();
  initControls();
  initGeometry()
  render();
}

function initGui() {
  controls = new function() {
    this.sx = 0;
    this.sy = 0;
    this.sz = 0;
  };

  var gui = new dat.GUI();

  gui.add(controls, 'sx', -0.1, 0.1).onChange();
  gui.add(controls, 'sy', -0.1, 0.1);
  gui.add(controls, 'sz', -0.1, 0.1);
}

function initControls() {
  control = new THREE.OrbitControls(camera, renderer.domElement);
}

function initGeometry() {
  var sphere = new THREE.SphereGeometry(1.5, 20, 20);

  var mesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
  	color: '#C236F4',
  	specular: '#FF67E9',
  	shininess: 10,
  }))
  mesh.name = 'sphere';

  scene.add(mesh);
}
var theta = 0;
function render() {
  
  var s = scene.getObjectByName('sphere');
  theta += 0.03;
  camera.lookAt(s.position);0
  camera.updateProjectionMatrix();
  s.position.x = 10 * Math.cos(theta);
  s.position.z = 10 * Math.sin(theta);

  renderer.render(scene,camera);
  requestAnimationFrame(render);
}

init();