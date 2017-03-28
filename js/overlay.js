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

var renderer, camera, stats, camera, light, controls, control, loader = new THREE.TextureLoader();
var w = window.innerWidth, h = window.innerHeight;
var controls;
var perScene, perCamera;
var orthoScene, orthoCamera;

function init() {

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  renderer = new THREE.WebGLRenderer({canvas: document.getElementById('canvas')});
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000);
  renderer.autoClear = false;
  renderer.shadowMap.enabled = true;
  //document.body.appendChild(renderer.domElement);

  perScene = new THREE.Scene();
  perCamera = new THREE.PerspectiveCamera(60, w/h, 0.1, 10000);
  perCamera.position.set(350, 350, 350);
  perCamera.lookAt(perScene.position);

  perScene.add(new THREE.AxisHelper(500));

  var sphere = new THREE.SphereGeometry(30, 10, 10);
  var sphereMesh = new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({
    // map: loader.load('img/t3.jpg'),
    refractionRatio: 0.98,
  }))
  sphereMesh.name = 'sphere';
  sphereMesh.position.set(100, 30, 0);
  sphereMesh.material.refractionRatio = 0.98;
  sphereMesh.castShadow = true;
  perScene.add(sphereMesh);
  var cubeMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshLambertMaterial({
      color: 'green',
  }))
  perScene.add(cubeMesh);

  light = new THREE.AmbientLight();
  perScene.add(light);

  /*影子*/
  //directionLightShadow();
  /*2d元素*/
  //overlay2d();
  /*纹理地板*/
  addFloor()
  /*用动态的canvas做纹理*/
  //canvasTexture();
  /*用video做动态纹理*/
  //videoTexture();
  /*多种材质*/
  //multiMaterial();
  /*反射*/
  //cubeMap();
  /*类太阳光*/
  //hemiLight()
  /*粒子*/
  //particles();
  /*加载json模型*/
  //jsonLoader();
  //initControls();
  //render();
  renderer.render(perScene, perCamera);

}

function jsonLoader() {
  var jLoader = new THREE.JSONLoader();
  jLoader.load('assets/model/car.js', function(geometry, materials) {

    var material = new THREE.MultiMaterial(materials);
    car = new THREE.Mesh(geometry, material);
    car.name = 'car';

    perScene.add(car);
  })
}

function particles() {
  var go = new THREE.BoxGeometry(50, 50, 50, 20, 20, 20);
  var pm = new THREE.PointsMaterial({
    size: 3,
    color: Math.random() * 0xffffff,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  var mesh = new THREE.Points(go, pm);

  mesh.position.set(0, 50, 0);
  mesh.sizeAttenuation = true;
  mesh.sortParticles = true;
  mesh.name = 'pointMesh';
  perScene.add(mesh);

  go.vertices.forEach(function(v) {
    v.dx = Math.random() * 600 - 300;
    v.dy = Math.random() * 600 - 300;
    v.dz = Math.random() * 600 - 300;

    v.ox = v.x;
    v.oy = v.y;
    v.oz = v.z;

    /*v.x = v.dx;
    v.y = v.dy;
    v.z = v.dz;*/
    var tween = new TWEEN.Tween({x:v.x, y:v.y, z:v.z}).to({
      x:v.dx,
      y:v.dy,
      z:v.dz
    }, 2000)
    .easing(TWEEN.Easing.Bounce.InOut)
    .onUpdate(function(){
      v.x = this.x;
      v.y = this.y;
      v.z = this.z;
    }).repeat(Infinity)
    .yoyo(true)
    .delay(1000)
    .start();
  })


}

function directionLightShadow() {
  light = new THREE.DirectionalLight();
  light.position.set(700, 400, -500);
  light.castShadow = true;
  //light.lookAt(perScene.position);
  light.shadow.camera.near = 250;
  light.shadow.camera.far = 2000;
  light.shadow.camera.left = -500;
  light.shadow.camera.right = 500;
  light.shadow.camera.top = 500;
  light.shadow.camera.bottom = -500;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.name ='dlight';
  perScene.add(light);

  var lc = new THREE.CameraHelper(light.shadow.camera);
  lc.name = 'lightCamera';
  perScene.add(lc);
}

function hemiLight() {
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
  hemiLight.position.set(0, 500, 0);
  hemiLight.name = 'hemiLight';
  perScene.add(hemiLight);
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

function multiMaterial() {
  var g = new THREE.CylinderGeometry(10, 20, 50, 10);
  var materialL = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff,
    transparent: true,
    opacity: 0.5,
  });
  var materialP = new THREE.MeshLambertMaterial({
    wireframe: true,
    color: 'green',
  })
  var mesh = new THREE.SceneUtils.createMultiMaterialObject(g, [materialL, materialP]);
  //var mesh = new THREE.Mesh(g, new THREE.MultiMaterial([materialL, materialP]));
  mesh.position.set(-50, 50, 0);
  perScene.add(mesh);

  var s = new THREE.SphereGeometry(50, 10, 10);
  var materials = [];
  var count = 0;
  s.faces.forEach(function(f) {
    f.materialIndex = count++;
    var m = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    });
    if (count % 2 == 0) {
      m.transparent = true;
      m.opacity = 0.4;
    }
    m.side = THREE.DoubleSide;
    materials.push(m);
  })
  var sm = new THREE.Mesh(s, new THREE.MultiMaterial(materials));
  sm.position.set(-100, 100, 100);
  sm.name = 'separateMaterialMesh';
  perScene.add(sm);
}

function cubeMap() {
  var path = 'earth';
  var urls = [
    'img/' + path + '/px.jpg',
    'img/' + path + '/nx.jpg',
    'img/' + path + '/py.jpg',
    'img/' + path + '/ny.jpg',
    'img/' + path + '/pz.jpg',
    'img/' + path + '/nz.jpg'
  ];
  var cubeLoader = new THREE.CubeTextureLoader();
  var cubeMap = new THREE.CubeTextureLoader().load(urls);

  perScene.getObjectByName('sphere').material.envMap = cubeMap;

}

function canvasTexture() {
  var canvas = document.createElement('canvas');
  clock(canvas);
  canvas.width = 512
  canvas.height = 512;


  var canvasMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshPhongMaterial({
      map: new THREE.Texture(canvas),
      //specular: 0xfffff,
    })
  );
  canvasMesh.castShadow = true;
  canvasMesh.position.set(-100, 100, -100);
  canvasMesh.rotation.y = - Math.PI / 4;
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
  var slight = new THREE.SpotLight();
  slight.position.set(0, 500, 0);
  //perScene.add(slight);

  var floorGeometry = new THREE.PlaneGeometry(800, 800, 40, 40);
  var floorMaterial = new THREE.MeshPhongMaterial({
    //bumpScale: 0,
    //transparent: true,
    //opacity: 1,
  });
  /*normalMap 法向贴图*/
  floorMaterial.map = loader.load('img/t1.jpg');
  floorMaterial.map.wrapS = floorMaterial.map.wrapT = THREE.RepeatWrapping;
  floorMaterial.map.repeat.set(8, 8);

  var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.receiveShadow = true;
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI/2;
  perScene.add(floorMesh);
}

function initControls() {
  control = new THREE.OrbitControls(perCamera, renderer.domElement);
}

var theta = 0;
var gama = 0;
var rv = 0.04;
var out = true;;
var st = 0, et;
function render() {
  var s = perScene.getObjectByName('sphere');
  var dl = perScene.getObjectByName('dlight');
  theta += rv;
  gama += 0.01

  s.position.x = 100 * Math.cos(theta);
  s.position.y = 25 + 50 * Math.sin(theta);

  //dl.position.x = 700 * Math.cos(gama);
  //dl.position.z = 700 * Math.sin(gama);
  if (theta > Math.PI || theta < 0) {
    rv = -rv;
  }

  /*explode gemotery*/
  // var em = perScene.getObjectByName('pointMesh');
  // em.geometry.vertices.forEach(function(v) {
    /*if (out) {
      v.x += (v.dx - v.x) / 10;
      v.y += (v.dy - v.y) / 10;
      v.z += (v.dz - v.z) / 10;

      if (Math.abs(v.dx - v.x) < 0.1 && Math.abs(v.dy - v.y) < 0.1 && Math.abs(v.dz - v.z) < 0.1) {
        v.x = v.dx;
        v.y = v.dy;
        v.z = v.dz;
        out = false;
      }
    } else {
      v.x += (v.ox - v.x) / 10;
      v.y += (v.oy - v.y) / 10;
      v.z += (v.oz - v.z) / 10;

      if (Math.abs(v.ox - v.x) < 0.1 && Math.abs(v.oy - v.y) < 0.1 && Math.abs(v.oz - v.z) < 0.1) {
        v.x = v.ox;
        v.y = v.oy;
        v.z = v.oz;

        st++;
      }
      if (st > 60 * em.geometry.vertices.length) {
        out = true;
        st = 0;
      }
    }*/



  // })

  // em.geometry.verticesNeedUpdate = true;

  // perScene.getObjectByName('canvasMesh').material.map.needsUpdate = true;
  //perScene.getObjectByName('videoMesh').material.map.needsUpdate = true;
  // perScene.getObjectByName('separateMaterialMesh').rotation.x +=0.01;
  //perScene.getObjectByName('lightCamera').updateProjectionMatrix();

  //perCamera.lookAt(s.position);
  //renderer.clear();
  renderer.render(perScene, perCamera);
  //renderer.clearDepth();
  //renderer.render(orthoScene, orthoCamera);

  stats.update();
  TWEEN.update();
  requestAnimationFrame(render);
}

window.onload = init;
window.addEventListener('resize', function() {
  perCamera.aspect = window.innerWidth / window.innerHeight;
  perCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false)
