(function(){
  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var renderer, camera, stats, camera, light, controls, loader;
  var w = window.innerWidth, h = window.innerHeight;

  var loader = new THREE.TextureLoader();
  var loaderCube = new THREE.CubeTextureLoader();

  var targetRotation = 0;
  var targetRotationOnMouseDown = 0;

  var mouseX = 0;
  var mouseXOnMouseDown = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var group = new THREE.Group();
  var materials =[];
  var objects = [];

  var imgs = [
    'jing1.jpg',
    'jing2.jpg',
    'jing3.jpg',
    'jing4.jpg',
    'jing5.jpg',
    'jing6.jpg',
  ];

  /*圆柱半径，层数，每层的数量，层与层之间的间隔*/
  var r = 2000, layer = 3, layerNum = 20, blank = 80;
  var cw = 400, ch = 300, ct = 10;
  var clinderH = (ch * layer + (layer - 1) * blank);
  var vector = new THREE.Vector3();

  /*相机初始位置*/
  var cx = 0,
      cy = clinderH / 2,
      cz = 0;

  var mouse = new THREE.Vector2();

  var raycaster = new THREE.Raycaster();
  /*mousemove选中的、mouseclick选中的*/
  var checked, clicked;

  /*放大状态*/
  var singleShow = false;
  /*加载完毕*/
  var loadFinish = true;

  function initRender() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000);
    document.body.appendChild(renderer.domElement);
  }

  function initCamera() {
    camera = new THREE.PerspectiveCamera(60, w/h, 1, 10000);
    camera.position.set(cx, cy, cz);
  }

  function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  }

  function initScene() {
    scene = new THREE.Scene();
  }

  function initLight() {
    light = new THREE.AmbientLight();
    scene.add(light);
  }

  function draw() {
    box();
    cylinder();
    //scene.add(new THREE.AxisHelper(8000));

  }

  var size = 5000, seg = 7;
  var box;
  function box() {
  	/*var materials = [
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/px.jpg', function() { renderer.render(scene, camera)}),
        overdraw: 0.5,
      }),
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/nx.jpg', function() { renderer.render(scene, camera)}),
      }),
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/py.jpg', function() { renderer.render(scene, camera)}),
      }),
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/ny.jpg', function() { renderer.render(scene, camera)}),
      }),
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/pz.jpg', function() { renderer.render(scene, camera)}),
      }),
      new THREE.MeshLambertMaterial({
        map: loader.load('img/skypano/nz.jpg', function() { renderer.render(scene, camera)}),
      }),
      
    ];*/

    var path = 'earth';
    var urls = [
      'img/' + path + '/px.jpg',
      'img/' + path + '/nx.jpg',
      'img/' + path + '/py.jpg',
      'img/' + path + '/ny.jpg',
      'img/' + path + '/pz.jpg',
      'img/' + path + '/nz.jpg'
    ];

    var textureCube = loaderCube.load(urls);
    var sphere = new THREE.SphereGeometry(size, 100, 100)

    /*var cube = new THREE.CubeGeometry(size, size, size, seg, seg, seg);
    var shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = textureCube;

    var material = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide
    });*/

    box = new THREE.Mesh(sphere, 
      new THREE.MeshLambertMaterial({
        envMap: textureCube,
      })
    );
    box.scale.x = -1;
    scene.add(box);
  }

  function cylinder() {

    for (var j = 0; j < layer; j++) {
      for (var i = 0; i < layerNum; i++) {
        var index = j * layerNum + i + 1;
        var materials = [];
        for (var z = 1; z < 7; z++) {
          materials.push(new THREE.MeshLambertMaterial({
            color: 0xffffff,
          }));
        }
        materials[4] = new THREE.MeshLambertMaterial({
          map: loader.load('img/' + index + '.jpg', function() {
            renderer.render(scene, camera);
          }),
        })
        var object = new THREE.Mesh(
          new THREE.CubeGeometry(cw, ch, ct),
          new THREE.MultiMaterial(materials)
        );

        var theta = i * 2 * Math.PI/layerNum;

        object.position.x = r * Math.sin(theta);
        object.position.z = r * Math.cos(theta);
        object.position.y = j * (ch + blank);

        vector.x = 0;
        vector.y = object.position.y;
        vector.z = 0;
        object.lookAt( vector );

        group.add(object);
        objects.push(object);
        if (index == layer * layerNum) {
          loadFinish = true;
        }
      }
    }
    camera.lookAt(new THREE.Vector3(objects[0].position));
    scene.add(group);
  }

  var controls = {};
  function initGui() {
    var gui = new dat.GUI();
    controls.rotationSpeed = 0.005;
    gui.add(controls, 'rotationSpeed', 0.004, 0.1);
  }

  function animate() {

    box.rotation.z += 0.1;

    if (!singleShow && !checked) {
      group.rotation.y += ( targetRotation - group.rotation.y ) * 0.005;
      camera.position.x = camera.position.z = 0;
      camera.rotation.y += controls.rotationSpeed;
    }
    if (clicked && singleShow) {
      camera.lookAt(clicked.position);
    }

    TWEEN.update();
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  }

  function three() {
    initRender();
    initCamera();
    //initControls();
    initScene();
    initLight();
    initGui();
    draw();
    renderer.render(scene, camera);
  }

  var mDown = false;
  var ox, oy, nx, ny;

  function onDocumentMouseDown( event ) {
    mDown = true;

    ox = (event.clientX / window.innerWidth) * 2 - 1;
    oy = - ( event.clientY / window.innerHeight ) * 2 + 1;

    event.preventDefault();
    document.addEventListener( 'mouseup', onDocumentMouseUp, false );
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationOnMouseDown = targetRotation;
  }

  function onDocumentMouseMove( event ) {
    if (!mDown) {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      raycaster.setFromCamera( mouse, camera );

      var intersections = raycaster.intersectObjects( objects );

      if ( intersections.length > 0 ) {
        if (checked != intersections[0].object) {
          if (checked) {
            checked.scale.x = 1;
            checked.scale.y = 1;
          } 
          checked = intersections[0].object;
          checked.scale.x = 1.2;
          checked.scale.y = 1.2; 
        }
        document.body.style.cursor = 'pointer';
      }
      else if (checked) {
        checked.scale.x = 1;
        checked.scale.y = 1;
        checked = null;
        document.body.style.cursor = 'auto';
      }
    } else {
      if (!checked && !clicked) {
        mouseX = event.clientX - windowHalfX;
        targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
      }
    }
  }

  function onDocumentMouseUp( event ) {
    mDown = false;

    nx = (event.clientX / window.innerWidth) * 2 - 1;
    ny = - ( event.clientY / window.innerHeight ) * 2 + 1;
    if (nx == ox && ny == oy) {
       onDocumentMouseClick(event);
    } 

  }
  function onDocumentMouseOut( event ) {
    document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
    document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
    document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
  }

  function onDocumentMouseClick (event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    var intersections;

    intersections = raycaster.intersectObjects( objects );

    if (intersections.length > 0) {
      if (singleShow) {
        if (clicked == intersections[0].object) {
          new TWEEN.Tween( camera.position ).to( {
            x: cx,
            y: cy,
            z: cz, 
          }, 2000 )
          .easing( TWEEN.Easing.Elastic.Out).start();
          singleShow = false;
          //clicked = null;
        } else {
          clicked = intersections[0].object;
          new TWEEN.Tween( camera.position ).to( {
            x: clicked.position.x * 3/4,
            y: clicked.position.y,
            z: clicked.position.z * 3/4, 
          }, 2000 )
          .easing( TWEEN.Easing.Elastic.Out).start();
        }
      } else {
        clicked = intersections[0].object;
        new TWEEN.Tween( camera.position ).to( {
          x: clicked.position.x * 3/4,
          y: clicked.position.y,
          z: clicked.position.z * 3/4, 
        }, 2000 )
        .easing( TWEEN.Easing.Elastic.Out).start();
        singleShow = true;
      }
    }
  }

  three();
  window.onload = function () {
    if (loadFinish) {
      requestAnimationFrame(animate);
    }
  }
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
})()