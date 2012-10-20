$(function() {

    var scene = new THREE.Scene();


    var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );

    camera.position.z = 1200;

    camera.lookAt( new THREE.Vector3(0, 0, 0) );

    scene.add( camera );

    var cylGeo = new THREE.CylinderGeometry(
        100, // radiusTop
        100, // radiusBottom
        500, // height
        50, // radiusSegments
        50, // heightSegments
        false // openEnded
    );

    var material1 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/cylinder3.jpg' ) } );
    var material2 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/cylinder3.jpg' ) } );
    var material3 = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/cylinder3.jpg' ) } );


    var cylinder1 = new THREE.Mesh( cylGeo, material1 );
    var cylinder2 = new THREE.Mesh( cylGeo, material2 );
    var cylinder3 = new THREE.Mesh( cylGeo, material3 );

    cylinder1.position.x = -505;
    cylinder3.position.x = 505;

    cylinder1.rotation.z = Math.PI / 2;
    cylinder2.rotation.z = Math.PI / 2;
    cylinder3.rotation.z = Math.PI / 2;

    cylinder1.rotation.x = 0
    cylinder2.rotation.x = 0.1;
    cylinder3.rotation.x = 0.2;

    // Text
    var text3d = new THREE.TextGeometry( 'Immersive', {

        size: 50,
        height: 1,
        curveSegments: 2,
        font: 'helvetiker'

    });

    text3d.computeBoundingBox();

    console.log( text3d.boundingBox );

    var centerOffset = -0.5 * ( text3d.boundingBox.min.x - text3d.boundingBox.max.x );

    var textMaterial = new THREE.MeshBasicMaterial( { color: 0x111111, overdraw: true } );
    text = new THREE.Mesh( text3d, textMaterial );

    text.doubleSided = false;

    text.position.y = centerOffset;
    text.position.z = 100;

    text.rotation.z = -Math.PI / 2;

    cylinder2.add( text );



    scene.add( cylinder1 );
    scene.add( cylinder2 );
    scene.add( cylinder3 );

    var ambientLight = new THREE.AmbientLight( 0x333333 );
    scene.add( ambientLight );

    var spotlight = new THREE.SpotLight(0xFFFFFF, 0.5, 2000);
    spotlight.position.set( 0, 0, 2000 );
    spotlight.target.position.set( 0, 0, 0 );
    scene.add( spotlight );

    var renderer = new THREE.WebGLRenderer({antialias: false, clearColor: 0x000000});

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.clear();

    $('body').append( $(renderer.domElement) );

    var stats = new Stats();

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';

    $('body').append( stats.domElement );

    var animate = function() {

        requestAnimationFrame( animate );

        cylinder1.rotation.x += 0.1;
        cylinder2.rotation.x += 0.1;
        cylinder3.rotation.x += 0.1;

        renderer.render(scene, camera);

        stats.update();

    };

    animate();

});