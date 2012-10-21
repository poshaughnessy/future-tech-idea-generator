function Generator() {

    // Theme adjectives
    var PHRASES_SET_1 = [
        'Gesture-controlled',
        'Voice-controlled',
        'Adaptive',
        'Responsive',
        'Artificial intelligence',
        'Smart',
        'Context-aware',
        'Immersive',
        'Content-first',
        'Distributed',
        'Interactive',
        'Collaborative',
        'Cloud-based',
        'Machine-learning',
        '3D',
        'Embedded',
        'Machine-learning',
        'WebGL',
        'Big Data',
        'Wearable',
        'Location-based',
        'Educational'
    ];

    // Product adjectives
    var PHRASES_SET_2 = [
        'Mobile',
        'Social',
        'Tablet',
        'Mobile-first',
        'Analysis',
        'Recommendation',
        'Smartphone',
        'Smart-watch',
        'Cloud',
        'Learning',
        'Web',
        'Mobile Web',
        'Geolocation',
        'Gaming',
        'E-Reader',
        'iBook',
        'Personalisation'
    ];

    // Product noun
    var PHRASES_SET_3 = [
        'App',
        'Platform',
        'Network',
        'Framework',
        'Algorithm'
    ];

    var MAX_SPEED = 0.8;
    var MIN_SPEED = 0.4;
    var DECELERATION = 0.003;

    var scene;
    var camera;
    var renderer;
    var stats;

    var spinner1;
    var spinner2;
    var spinner3;

    var spinner1Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
    var spinner2Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
    var spinner3Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);

    var set1Phrases;
    var set2Phrases;
    var set3Phrases;

    var finished = false;


    function init() {

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

        set1Phrases = chooseRandomFromArray(PHRASES_SET_1, 5);

        for( var i=0; i < set1Phrases.length; i++ ) {

            var text = generateText(set1Phrases[i], (Math.PI * 2 * i / 5));
            spinner1.add( text );

        }

        set2Phrases = chooseRandomFromArray(PHRASES_SET_2, 5);

        for( var i=0; i < set2Phrases.length; i++ ) {

            var text = generateText(set2Phrases[i], (Math.PI * 2 * i / 5));
            spinner2.add( text );

        }

        set3Phrases = PHRASES_SET_3;
        set3Phrases.sort( function(){ return (Math.round(Math.random())-0.5); } ); // Randomise

        for( var i=0; i < set3Phrases.length; i++ ) {

            var text = generateText(set3Phrases[i], (Math.PI * 2 * i / set3Phrases.length));
            spinner3.add( text );

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

    function chooseRandomFromArray(array, numberToChoose) {

        var chosen = new Array();

        while( chosen.length < numberToChoose ) {

            var index = Math.floor(Math.random() * array.length);

            var choice = array[index];

            if( $.inArray( choice, chosen ) == -1 ) {
                chosen.push( choice );
            }

        }

        return chosen;

    }

    function animate() {

        if( !finished ) {

            requestAnimationFrame( animate );

            spinner1.rotation.x += spinner1Speed;
            spinner2.rotation.x += spinner2Speed;
            spinner3.rotation.x += spinner3Speed;

            if( spinner1Speed > 0 ) spinner1Speed -= Math.min(DECELERATION, spinner1Speed);
            if( spinner2Speed > 0 ) spinner2Speed -= Math.min(DECELERATION, spinner2Speed);
            if( spinner3Speed > 0 ) spinner3Speed -= Math.min(DECELERATION, spinner3Speed);

            if( spinner1Speed < DECELERATION && spinner2Speed < DECELERATION && spinner3Speed < DECELERATION ) {
                finish();
            }

            renderer.render(scene, camera);

            stats.update();

        }

    }

    function finish() {

        finished = true;

        var phrase1 = getChosenPhrase( spinner1 );
        var phrase2 = getChosenPhrase( spinner2 );
        var phrase3 = getChosenPhrase( spinner3 );

        alert( phrase1 + ' ' + phrase2 + ' ' + phrase3 );

    }

    function getChosenPhrase( spinner ) {

        var chosen;
        var zPosMax = 0;

        for( var i=0; i < spinner.children.length; i++ ) {

            var textMesh = spinner.children[i];

            // Need to calculate 'world position' of child
            var worldPos = textMesh.matrixWorld.multiplyVector3( new THREE.Vector3() );

            if( worldPos.z > zPosMax ) {
                chosen = textMesh.originalText;
                zPosMax = worldPos.z;
            }

        }

        return chosen;

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

        // Keep a reference to the text - useful for later
        text.originalText = string;

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