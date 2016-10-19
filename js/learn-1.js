(function(){
  var width = window.innerWidth,
      height = window.innerHeight;

  var stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';
  //document.body.appendChild(stats.domElement);

  //var camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 1, 10000),
  var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
  	  scene = new THREE.Scene(),
  	  renderer = new THREE.WebGLRenderer();
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  camera.position.set(0,0,1000);
  camera.lookAt(new THREE.Vector3(0,0,0));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000);
  document.body.appendChild(renderer.domElement);

  //立方体
  var g = new THREE.CubeGeometry(200, 200, 200);
  //球
  //var spg = new THREE.SphereGeometry(200, 100, 100);
  //甜甜圈
  //var g = new THREE.TorusGeometry(200, 50, 100, 100),
  //加载器
  var loader = new THREE.FontLoader();
  var url = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json';

  loader.load(url, function(font) {
  	 var g = new THREE.TextGeometry('Hello', {
  		font: font,
  		size: 100,
  		height: 40,
  		curveSegments: 20,
  	})
    //基本材质
  	/*var m = new THREE.MeshBasicMaterial({
	  	color: 0xff0000,
	  	wireframe: true,
	  });

	  var cube = new THREE.Mesh(g, m);
	  scene.add(camera);
	  scene.add(cube);

	  renderer.render(scene,camera);*/
  });

  /*var m = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: false,
    opacity: 1,
    visible: true,
    map: ''
  });*/
  
  //贴图
  var loader = new THREE.TextureLoader();
  var texture = loader.load('img/jing.jpg', function(){
    renderer.render(scene,camera);
  })

  //Lambert材质,有漫反射效果
  /*var m = new THREE.MeshLambertMaterial({
    //color: 0xff0000,
    //emissive: 0xffff00,
    map: texture,
  });*/
  var m = new THREE.MeshPhongMaterial({
    map: texture,
  });

  var cube = new THREE.Mesh(g, m);
  var sp = new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100),
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
      wireframe: true,
    })
  );
  scene.add(camera);
  //scene.add(sp);
  scene.add(cube);
  sp.position.set(-500, 200, 100);
  //环境光
  var light = new THREE.AmbientLight();
  //平行光
  //var light = new THREE.DirectionalLight();
  //点光源
  //var light = new THREE.PointLight()
  //light.position.set(500, 500, 500);
  scene.add(light);

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene,camera);
    controls.update();
    stats.update();
    requestAnimationFrame(animate);
  }
  

  renderer.render(scene,camera);
  requestAnimationFrame(animate);
  
})()