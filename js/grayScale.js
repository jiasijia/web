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
var scale = chroma.scale(['blue', 'green', 'red']).domain([0, 50]);

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, w/h, 1, 10000);
  camera.position.set(1000, 1000, 1000);
  camera.lookAt(scene.position);

  //light = new THREE.AmbientLight();
  light = new THREE.DirectionalLight();
  light.position.set(1200, 500, 500);
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

var width = 512,
	depth = 512,
	spacingX = 3,
	spacingZ = 3,
	canvas = document.createElement('canvas');
	canvas.width = 512,
	canvas.height = 512;
var	ctx = canvas.getContext('2d'),
	img = new Image();
	img.src = 'img/gray2.jpg';


function render() {
	var geometry = new THREE.Geometry;
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
		var pixel = ctx.getImageData(0, 0, width, depth)

		for (var x = 0; x < depth; x++) {
		  for(var z = 0; z < width; z++) {
		  	var yValue = pixel.data[z * 4 + depth * x * 4] / 5;
		  	var vertex = new THREE.Vector3(x * spacingX, yValue, z * spacingZ);

		  	geometry.vertices.push(vertex);
		  }
		}

		for (var x = 0; x < depth - 1; x++) {
		  for (var z = 0; z < width - 1; z++) {
		  	/*四个相邻的定点分成两个面*/
		  	var a = x * depth + z;
		  	var b = x * depth + (z + 1);
		  	var c = (x + 1) * depth + z;
		  	var d = (x + 1) * depth + (z + 1);

		  	var face1 = new THREE.Face3(a, b, d);
		  	var face2 = new THREE.Face3(d, c, a);

		  	face1.color = new THREE.Color(scale(getHighPoint(geometry, face1)).hex());
            face2.color = new THREE.Color(scale(getHighPoint(geometry, face2)).hex())
            geometry.faces.push(face1);
            geometry.faces.push(face2);
		  }
		}

		geometry.computeVertexNormals(true);
		geometry.computeFaceNormals();
		geometry.computeBoundingBox();

		var zMax = geometry.boundingBox.max.z;
        var xMax = geometry.boundingBox.max.x;

		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			color: 0xcccccc,
			vertexColors: THREE.FaceColors,
		}))
		mesh.translateX(-xMax / 2);
        mesh.translateZ(-zMax / 2);
		scene.add(mesh);
	};

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function getHighPoint(geometry, face) {

  var v1 = geometry.vertices[face.a].y;
  var v2 = geometry.vertices[face.b].y;
  var v3 = geometry.vertices[face.c].y;

  return Math.max(v1, v2, v3);
}

init();