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

    var spinner1Speed;
    var spinner2Speed;
    var spinner3Speed;

    var set1Phrases;
    var set2Phrases;
    var set3Phrases;

    var lever;
    var leverRotationDelta;
    var leverRotationDownSpeed = 0.05;
    var leverRotationUpSpeed = 0.1;

    var spinning = false;


    function init() {

        // Scene & camera

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );
        camera.position.y = 100;
        camera.position.z = 1800;
        camera.lookAt( new THREE.Vector3(0, 0, 0) );

        scene.add( camera );

        // Spinners

        var spinnerCylinder = new THREE.CylinderGeometry(
            100,  // radiusTop
            100,  // radiusBottom
            600,  // height
            50,   // radiusSegments
            50,   // heightSegments
            false // openEnded
        );

        var spinnerMaterial = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/cylinder4.jpg' ) } );

        spinner1 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );
        spinner2 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );
        spinner3 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );

        spinner1.position.x = -705;
        spinner2.position.x = -100;
        spinner3.position.x = 505;

        spinner1.rotation.z = Math.PI / 2;
        spinner2.rotation.z = Math.PI / 2;
        spinner3.rotation.z = Math.PI / 2;

        spinner1.rotation.x = 0
        spinner2.rotation.x = 0.1;
        spinner3.rotation.x = 0.2;

        setupPhrases();

        scene.add( spinner1 );
        scene.add( spinner2 );
        scene.add( spinner3 );

        // Lever

        var leverCylinder = new THREE.CylinderGeometry(
            20,   // radiusTop
            20,   // radiusBottom
            500,  // height
            50,   // radiusSegments
            50,   // heightSegments
            false // openEnded
        );

        var leverHandleMaterial = new THREE.MeshLambertMaterial( {color: 0xcccccc} );

        var leverHandle = new THREE.Mesh( leverCylinder, leverHandleMaterial );

        //leverHandle.position.x = 1105;
        //leverHandle.position.y = 140;
        //leverHandle.position.z = -220;

        var leverSphere = new THREE.SphereGeometry(
            60, // radius
            50, // segmentsWidth
            50  // segmentsHeight
        );

        var leverKnobMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000} );

        var leverKnob = new THREE.Mesh( leverSphere, leverKnobMaterial );

        leverKnob.position.y = 200;

        // Parent object used to set rotation origin
        lever = new THREE.Object3D();
        lever.position.x = 990;
        lever.position.y = -70;  // We want overall position of 140
        lever.position.z = -290; // We want overall position of -220

        leverHandle.add( leverKnob );

        lever.add( leverHandle );

        leverHandle.position.y = 210;
        leverHandle.position.z = 70;
        leverHandle.rotation.x = 0.5;

        scene.add( lever );

        // Lighting

        var ambientLight = new THREE.AmbientLight( 0x222222 );
        scene.add( ambientLight );

        var spotlight = new THREE.SpotLight(0xFFFFFF, 0.7, 2500);
        spotlight.position.set( 0, 0, 2500 );
        spotlight.target.position.set( 0, 0, 0 );
        scene.add( spotlight );

        // Renderer

        renderer = new THREE.WebGLRenderer({antialias: true, clearColor: 0x000000});

        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.clear();

        $('body').append( $(renderer.domElement) );

        // Stats

        stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';

        $('body').append( stats.domElement );

        animate();

        document.addEventListener( 'keydown', onDocumentKeyDown, false );

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

        requestAnimationFrame( animate );

        if( spinning ) {

            spinner1.rotation.x += spinner1Speed;
            spinner2.rotation.x += spinner2Speed;
            spinner3.rotation.x += spinner3Speed;

            if( spinner1Speed > 0 ) spinner1Speed -= Math.min(DECELERATION, spinner1Speed);
            if( spinner2Speed > 0 ) spinner2Speed -= Math.min(DECELERATION, spinner2Speed);
            if( spinner3Speed > 0 ) spinner3Speed -= Math.min(DECELERATION, spinner3Speed);

            if( spinner1Speed < DECELERATION && spinner2Speed < DECELERATION && spinner3Speed < DECELERATION ) {
                finish();
            }

        }

        if( leverRotationDelta > 0 ) {

            var rotationAmount = Math.min( leverRotationDelta, leverRotationDownSpeed );

            lever.rotation.x += rotationAmount;

            leverRotationDelta -= rotationAmount;

        } else if( leverRotationDelta < 0 ) {

            var rotationAmount = Math.min( Math.abs(leverRotationDelta), leverRotationUpSpeed );

            lever.rotation.x -= rotationAmount;

            leverRotationDelta += rotationAmount;

        }

        renderer.render(scene, camera);

        stats.update();

    }

    function clearPhrases() {

        removePhrases( spinner1 );
        removePhrases( spinner2 );
        removePhrases( spinner3 );

    }

    function removePhrases( spinner ) {

        for( var i = spinner.children.length; i >= 0; i-- ) {
            var child = spinner.children[i];
            spinner.remove( child );
        }

    }

    function setupPhrases() {

        clearPhrases();

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

    }

    function startLeverDownAnimation() {

        leverRotationDelta = Math.PI / 2;

    }

    function startLeverUpAnimation() {

        leverRotationDelta = -Math.PI / 2;

    }

    function spin() {

        if( !spinning ) {

            setupPhrases();

            startLeverDownAnimation();

            spinner1Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
            spinner2Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
            spinner3Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);

            spinning = true;

        }

    }

    function finish() {

        if( spinning ) {

            spinning = false;

            startLeverUpAnimation();

            var phrase1 = getChosenPhrase( spinner1 );
            var phrase2 = getChosenPhrase( spinner2 );
            var phrase3 = getChosenPhrase( spinner3 );

            alert( phrase1 + ' ' + phrase2 + ' ' + phrase3 );

        }

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

    function onDocumentKeyDown() {

        switch( event.keyCode ) {
            // Space key
            case 32:
                spin();
                event.preventDefault();
                break;
        }

    }

    init();

}

$(function() {
    Generator();
});