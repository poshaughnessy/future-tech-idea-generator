function Generator() {

    console.log('Hello?');

    var scene;
    var camera;
    var renderer;
    var stats;

    var spinner1;
    var spinner2;
    var spinner3;

    var spinner1Phrases = [
        'Gesture-controlled',
        'Voice-controlled',
        'Adaptive',
        'Responsive'
    ];


    function init() {

        console.log('Init');

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );
        camera.position.z = 1500;
        camera.lookAt( new THREE.Vector3(0, 0, 0) );

        scene.add( camera );

        var cylinder = new THREE.CylinderGeometry(
            100, // radiusTop
            100, // radiusBottom
            600, // height
            50, // radiusSegments
            50, // heightSegments
            false // openEnded
        );

        var material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/cylinder3.jpg' ) } );

        spinner1 = new THREE.Mesh( cylinder, material );
        spinner2 = new THREE.Mesh( cylinder, material );
        spinner3 = new THREE.Mesh( cylinder, material );

        spinner1.position.x = -605;
        spinner3.position.x = 605;

        spinner1.rotation.z = Math.PI / 2;
        spinner2.rotation.z = Math.PI / 2;
        spinner3.rotation.z = Math.PI / 2;

        spinner1.rotation.x = 0
        spinner2.rotation.x = 0.1;
        spinner3.rotation.x = 0.2;

        for( var i=0; i < spinner1Phrases.length; i++ ) {

            console.log('rotation ' + i, (Math.PI * 2 * i / spinner1Phrases.length));

            var text = generateText(spinner1Phrases[i], (Math.PI * 2 * i / spinner1Phrases.length));
            spinner1.add( text );

        }

        scene.add( spinner1 );
        scene.add( spinner2 );
        scene.add( spinner3 );

        var ambientLight = new THREE.AmbientLight( 0x333333 );
        scene.add( ambientLight );

        var spotlight = new THREE.SpotLight(0xFFFFFF, 0.5, 2000);
        spotlight.position.set( 0, 0, 2000 );
        spotlight.target.position.set( 0, 0, 0 );
        scene.add( spotlight );

        renderer = new THREE.WebGLRenderer({antialias: false, clearColor: 0x000000});

        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.clear();

        $('body').append( $(renderer.domElement) );

        stats = new Stats();

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';

        $('body').append( stats.domElement );

        animate();

    }

    function animate() {

        requestAnimationFrame( animate );

        spinner1.rotation.x += 0.1;
        spinner2.rotation.x += 0.1;
        spinner3.rotation.x += 0.1;

        renderer.render(scene, camera);

        stats.update();

    }

    function generateText(string, rotation) {

        var text3d = new THREE.TextGeometry( string, {

            size: 40,
            height: 1,
            curveSegments: 10,
            font: 'helvetiker'

        });

        text3d.computeBoundingBox();

        var centerOffset = -0.5 * ( text3d.boundingBox.min.x - text3d.boundingBox.max.x );

        var textMaterial = new THREE.MeshBasicMaterial( { color: 0x111111, overdraw: true } );

        var text = new THREE.Mesh( text3d, textMaterial );

        text.doubleSided = false;

        text.position.x = 100 * Math.sin( rotation );
        text.position.y = centerOffset;
        text.position.z = 100 * Math.cos( rotation );

        text.rotation.y = rotation;

        text.rotation.z = -Math.PI / 2;

        return text;

    }

    init();

}

$(function() {
    new Generator();
});