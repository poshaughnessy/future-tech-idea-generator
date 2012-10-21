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
        'Educational',
        'Touch-based'
    ];

    // Product adjectives
    var PHRASES_SET_2 = [
        'mobile',
        'social',
        'tablet',
        'mobile-first',
        'analysis',
        'recommendation',
        'smartphone',
        'smart-watch',
        'cloud',
        'learning',
        'Web',
        'Mobile Web',
        'geolocation',
        'gaming',
        'e-Reader',
        'iBook',
        'personalisation'
    ];

    // Product noun
    var PHRASES_SET_3 = [
        'app',
        'platform',
        'framework',
        'algorithm',
        'service',
        'network',
        'API'
    ];

    // Audience
    var PHRASES_SET_4 = [
        'life-long learners',
        'students',
        'teachers',
        'news readers',
        'book readers',
        'schools',
        'businesses',
        'business executives',
        'children',
        'parents',
        'tourists',
        'high-flyers',
        'employees'
    ];

    var MAX_SPEED = 0.8;
    var MIN_SPEED = 0.4;
    var DECELERATION = 0.003;

    var phraseTextMeshes1 = {};
    var phraseTextMeshes2 = {};
    var phraseTextMeshes3 = {};
    var phraseTextMeshes4 = {};

    var scene;
    var camera;
    var renderer;
    var stats;

    var spinner1;
    var spinner2;
    var spinner3;
    var spinner4;

    var spinner1Speed;
    var spinner2Speed;
    var spinner3Speed;
    var spinner4Speed;

    var set1Phrases;
    var set2Phrases;
    var set3Phrases;
    var set4Phrases;

    var lever;
    var leverHandle;
    var leverKnob;

    var leverRotationDelta;
    var leverRotationDownSpeed = 0.05;
    var leverRotationUpSpeed = 0.1;

    var spinning = false;

    var projector = new THREE.Projector();


    function init() {

        if( !Detector.webgl ) {

            // No WebGL support

            $('#noWebGL').show();
            $('#instructions').hide();
            return;

        }

        // Scene & camera

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 10, 10000 );
        camera.position.y = 100;
        camera.position.z = 2000;
        camera.lookAt( new THREE.Vector3(0, 0, 0) );

        scene.add( camera );

        // Spinners

        var spinnerCylinder = new THREE.CylinderGeometry(
            100,  // radiusTop
            100,  // radiusBottom
            500,  // height
            50,   // radiusSegments
            50,   // heightSegments
            false // openEnded
        );

        var spinnerMaterial = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( 'images/spinner-texture.jpg' ) } );

        spinner1 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );
        spinner2 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );
        spinner3 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );
        spinner4 = new THREE.Mesh( spinnerCylinder, spinnerMaterial );

        spinner1.position.x = -810;
        spinner2.position.x = -305;
        spinner3.position.x = 200;
        spinner4.position.x = 705;

        spinner1.rotation.z = Math.PI / 2;
        spinner2.rotation.z = Math.PI / 2;
        spinner3.rotation.z = Math.PI / 2;
        spinner4.rotation.z = Math.PI / 2;

        spinner1.rotation.x = 0
        spinner2.rotation.x = 0.1;
        spinner3.rotation.x = 0.2;
        spinner4.rotation.x = 0.3;

        generatePhrasesText();
        choosePhrases();

        scene.add( spinner1 );
        scene.add( spinner2 );
        scene.add( spinner3 );
        scene.add( spinner4 );

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

        leverHandle = new THREE.Mesh( leverCylinder, leverHandleMaterial );

        var leverSphere = new THREE.SphereGeometry(
            60, // radius
            50, // segmentsWidth
            50  // segmentsHeight
        );

        var leverKnobMaterial = new THREE.MeshLambertMaterial( {color: 0xff0000} );

        leverKnob = new THREE.Mesh( leverSphere, leverKnobMaterial );

        leverKnob.position.y = 200;

        // Parent object used to set rotation origin
        lever = new THREE.Object3D();
        lever.position.x = 1150;
        lever.position.y = -70;  // We want overall position of 140
        lever.position.z = -290; // We want overall position of -220

        leverHandle.add( leverKnob );

        lever.add( leverHandle );

        leverHandle.position.y = 210;
        leverHandle.position.z = 70;
        leverHandle.rotation.x = 0.5;

        scene.add( lever );

        // Lighting

        var spotlight1 = new THREE.SpotLight(0xFFFFFF, 0.4, 2500);
        spotlight1.position.set( -600, 0, 2500 );
        spotlight1.target.position.set( -600, 0, 0 );

        var spotlight2 = new THREE.SpotLight(0xFFFFFF, 0.3, 2500);
        spotlight2.position.set( -100, 0, 2500 );
        spotlight2.target.position.set( -100, 0, 0 );

        var spotlight3 = new THREE.SpotLight(0xFFFFFF, 0.3, 2500);
        spotlight3.position.set( 400, 0, 2500 );
        spotlight3.target.position.set( 300, 0, 0 );

        var spotlight4 = new THREE.SpotLight(0xFFFFFF, 0.4, 2500);
        spotlight4.position.set( 900, 0, 2500 );
        spotlight4.target.position.set( 900, 0, 0 );

        scene.add( spotlight1 );
        scene.add( spotlight2 );
        scene.add( spotlight3 );
        scene.add( spotlight4 );

        // Renderer

        renderer = new THREE.WebGLRenderer({antialias: true, clearColor: 0x111111});

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

        $('#close').click(function() {
            hideIdea();
            return false;
        });

        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener( 'keydown', onDocumentKeyDown, false );
        renderer.domElement.addEventListener( 'mousedown', onMouseDown, false );

    }

    /*
     * Thanks Kyle Cronin.
     * Using algorithm as described here: http://stackoverflow.com/questions/48087/
     */
    function chooseRandomFromArray(array, numberToChoose) {

        var chosen = [];
        var numberChosen = 0;

        for( var i=0, l=array.length; i < l; i++ ) {

            var probabilityOfChoosing = (numberToChoose - numberChosen) / (l-i);
            var random =  Math.random();

            if( random < probabilityOfChoosing ) {
                chosen.push( array[i] );
                numberChosen++;
            }

            if( chosen.length == numberToChoose ) break;

        }

        return chosen;

    }

    function animate() {

        requestAnimationFrame( animate );

        renderer.render(scene, camera);

        stats.update();

        if( spinning ) {

            spinner1.rotation.x += spinner1Speed;
            spinner2.rotation.x += spinner2Speed;
            spinner3.rotation.x += spinner3Speed;
            spinner4.rotation.x += spinner4Speed;

            if( spinner1Speed > 0 ) spinner1Speed -= Math.min(DECELERATION, spinner1Speed);
            if( spinner2Speed > 0 ) spinner2Speed -= Math.min(DECELERATION, spinner2Speed);
            if( spinner3Speed > 0 ) spinner3Speed -= Math.min(DECELERATION, spinner3Speed);
            if( spinner4Speed > 0 ) spinner4Speed -= Math.min(DECELERATION, spinner4Speed);

            if( spinner1Speed < DECELERATION &&
                spinner2Speed < DECELERATION &&
                spinner3Speed < DECELERATION &&
                spinner4Speed < DECELERATION ) {
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

    }

    function clearPhrases() {

        removePhrases( spinner1 );
        removePhrases( spinner2 );
        removePhrases( spinner3 );
        removePhrases( spinner4 );

    }

    function removePhrases( spinner ) {

        for( var i = spinner.children.length; i >= 0; i-- ) {
            var child = spinner.children[i];
            spinner.remove( child );
        }

    }

    function generatePhrasesText() {

        for( var i=0, l=PHRASES_SET_1.length; i<l; i++ ) {
            phraseTextMeshes1[PHRASES_SET_1[i]] = generateText(PHRASES_SET_1[i]);
        }

        for( var i=0, l=PHRASES_SET_2.length; i<l; i++) {
            phraseTextMeshes2[PHRASES_SET_2[i]] = generateText(PHRASES_SET_2[i]);
        }

        for( var i=0, l=PHRASES_SET_3.length; i<l; i++) {
            phraseTextMeshes3[PHRASES_SET_3[i]] = generateText(PHRASES_SET_3[i]);
        }

        for( var i=0, l=PHRASES_SET_4.length; i<l; i++) {
            phraseTextMeshes4[PHRASES_SET_4[i]] = generateText(PHRASES_SET_4[i]);
        }

    }

    function choosePhrases() {

        clearPhrases();

        set1Phrases = chooseRandomFromArray(PHRASES_SET_1, 5);
        set2Phrases = chooseRandomFromArray(PHRASES_SET_2, 5);
        set3Phrases = chooseRandomFromArray(PHRASES_SET_3, 5);
        set4Phrases = chooseRandomFromArray(PHRASES_SET_4, 5);

        addPhrases( spinner1, set1Phrases, phraseTextMeshes1 );
        addPhrases( spinner2, set2Phrases, phraseTextMeshes2 );
        addPhrases( spinner3, set3Phrases, phraseTextMeshes3 );
        addPhrases( spinner4, set4Phrases, phraseTextMeshes4 );

    }

    function addPhrases( spinner, phrases, phraseTextMeshes ) {

        for( var i=0; i < phrases.length; i++ ) {

            var mesh = phraseTextMeshes[ phrases[i] ];

            var rotation = Math.PI * 2 * i / 5;

            mesh.position.x = 100 * Math.sin( rotation );
            mesh.position.z = 100 * Math.cos( rotation );
            mesh.rotation.y = rotation;

            spinner.add( phraseTextMeshes[ phrases[i] ] );
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

            hideIdea();
            
            startLeverDownAnimation();

            choosePhrases();

            spinner1Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
            spinner2Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
            spinner3Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);
            spinner4Speed = Math.max( Math.random() * MAX_SPEED, MIN_SPEED);

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
            var phrase4 = getChosenPhrase( spinner4 );

            presentIdea( phrase1 + ' ' + phrase2 + ' ' + phrase3 + ' for ' + phrase4 );

        }

    }

    function hideIdea() {

        $('#idea').fadeOut();

    }

    function presentIdea(idea) {

        $('#idea .contents').html(
            '<h3>'+idea+'</h3>' +
            '<a href="https://twitter.com/share" class="twitter-share-button"' +
                'data-text="My next big idea is: ' + idea + '. Find out yours with the Future Technologies Idea Generator." ' +
                'data-size="large">Tweet</a>' +
            '<div class="retryContainer"></div>');

        var retryButton = $('<a href="#" class="retry">Retry</a>');
        retryButton.click(function() {spin(); return false;});

        $('.retryContainer').append(retryButton);

        $.getScript('http://platform.twitter.com/widgets.js');

        $('#idea').fadeIn();

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

    function generateText(string) {

        var text3d = new THREE.TextGeometry( string, {

            size: 30,
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

        text.position.y = centerOffset;

        text.rotation.z = -Math.PI / 2;

        return text;

    }

    function onWindowResize() {

        renderer.setSize( window.innerWidth, window.innerHeight );

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

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

    function onMouseDown( event ) {

        event.preventDefault();

        var clickX = event.clientX;
        var clickY = event.clientY;

        var vector = new THREE.Vector3( ( clickX / window.innerWidth ) * 2 - 1, - ( clickY / window.innerHeight ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

        var intersects = ray.intersectObjects( [leverHandle, leverKnob] );

        if ( intersects.length > 0 ) {
            // Clicked on the lever
            spin();

        }
    }

    init();

}

$(function() {
    Generator();
});