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

  camera = new THREE.PerspectiveCamera(60, w/h, 1, 10000);
  camera.position.set(1000, 1000, 1000);
  camera.lookAt(scene.position);

  light = new THREE.AmbientLight();
  scene.add(light);
  scene.add(new THREE.AxisHelper(5000));

  initGui();
  initControls();
  render();
}

function initGui() {
  controls = new function() {
    this.sx = 0;
    this.sy = 0;
    this.sz = 0;
  };

  var gui = new dat.GUI();

  gui.add(controls, 'sx', -0.1, 0.1);
  gui.add(controls, 'sy', -0.1, 0.1);
  gui.add(controls, 'sz', -0.1, 0.1);
}

function initControls() {
  control = new THREE.OrbitControls(camera, renderer.domElement);
}

function render() {
  var cubeGeometry = new THREE.BoxGeometry(200, 200, 200);
  var material = new THREE.MeshLambertMaterial({});

  /*同一面不同颜色*/
  /*material.vertexColors = THREE.FaceColors;

  cubeGeometry.faces.forEach(function(e) {
    e.color = new THREE.Color(Math.random() * 0xffffff);
  })*/

  var cube = new THREE.Mesh(cubeGeometry, material);
  cube.position.set(200, 0, 200);

  /****联动****/
  /*var pivot = new THREE.Object3D();
  pivot.name = 'pivot';
  cube.add(pivot);

  var box = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), 
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
    })
  );
  box.position.set(400, 0, 400);
  cube.add(box);*/

  scene.add(cube);
  cube.name = 'cube';
  renderer.render(scene, camera);
}

function animate() {

  var cube = scene.getObjectByName('cube');
  var pivot = scene.getObjectByName('pivot');
  cube.rotation.x += controls.sx;
  cube.rotation.y += controls.sy;
  cube.rotation.z += controls.sz;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onKeydownFoo(e) {
  e.preventDefault();

  switch(e.keyCode) {
  	case 37:
  	  cube.rotation.z += -0.05;
  	  break;
  	case 38:
  	  cube.rotation.x += 0.05;
  	  break;
  	case 39:
  	  cube.rotation.z += 0.05;
  	  break;
  	case 40:
  	  cube.rotation.x += -0.05;
  	  break;
  }
}

function setupDragDrop() {
  var holder = document.getElementById('holder');
    holder.ondragover = function() {
    this.className = 'hover';
    return false;
  };
  holder.ondragend = function() {
    this.className = '';
    return false;
  };
  holder.ondrop = function(e) {
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      holder.style.background = 'url(' + event.target.result + ') no-repeat center';
      holder.style.backgroundSize = '100%';

      var image = document.createElement('img');
      image.src = event.target.result;
      document.body.appendChild(image);
      var texture = new THREE.Texture(image);

      texture.needsUpdate = true;
      scene.getObjectByName('cube').material.map = texture;
    };

    reader.readAsDataURL(file);
    return false;
  }
}
//setupDragDrop()
init();

requestAnimationFrame(animate);
//document.addEventListener('keydown', onKeydownFoo);
