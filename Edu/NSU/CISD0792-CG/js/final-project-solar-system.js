/**
 * Created by wilborne on 2/24/2015.
 */

/*  Course:  CISD 0792 Computer Graphics with Dr. Micahel Laszlo
 Title:  Final Project
 Description:  Solar System, Mark II
 Author:  Deanna Marie Wilborne
 */

/*
 Framework for this exercise based on work by Dr. Michael Laszlo
 Retrieved from:  http://scis.nova.edu/~mjl/threejs/js/closedPyramid2.js
 2015-01-21
 */

var TwoPI = Math.PI * 2.0;
var sun;
var earth;
var moon;
var earthOrbit = new THREE.Object3D();
var earthMoonGroup = new THREE.Object3D(); // anchor point for earth object and moon's orbit independent of their rotations
var moonOrbit = new THREE.Object3D();

// based on work in assignment one, challenge OT.1
function spherePoint(radius) {
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    // based on information from:
    // http://mathworld.wolfram.com/SpherePointPicking.html

    function validTuple() {
        var ans = 1.0;
        var x1 = 0.0;
        var x2 = 0.0;
        while (ans >= 1.0) {
            x1 = getRandomArbitrary(-1, 1);
            x2 = getRandomArbitrary(-1, 1);
            ans = x1 * x1 + x2 * x2;
        }
        return [x1, x2];
    }

    // generate coordinates on the surface of a sphere with radius r
    function marsaglia(radius) {
        var tuple = validTuple();
        var x1 = tuple[0] * tuple[0];
        var x2 = tuple[1] * tuple[1];
        var t  = Math.sqrt(1.0 - x1 - x2);
        var x = (2.0 * tuple[0] * t) * radius;
        var y = (2.0 * tuple[1] * t) * radius;
        var z = (1.0 - 2.0 * (x1 + x2)) * radius;
        return [x, y, z];
    }

    var spherePoint = marsaglia(radius);
    return (new THREE.Vector3(spherePoint[0], spherePoint[1], spherePoint[2]));
}

// this function based on information retrieved 2015-02-26 from:
// http://aerotwist.com/tutorials/creating-particles-with-three-js/

function starField() {
// create the particle variables
    var particleCount = 1800,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xFFFFFF,
            size: 1
        });

// now create the individual particles
    for (var p = 0; p < particleCount; p++) {

        var particle = spherePoint(850);
        // add it to the geometry
        particles.vertices.push(particle);
    }

// create the particle system
    var particleSystem = new THREE.ParticleSystem(
        particles,
        pMaterial);

// add it to the scene
    scene.add(particleSystem);
}

// earth-mark2.jpg from:
// http://upload.wikimedia.org/wikipedia/commons/7/74/Mercator-projection.jpg
// earth-mark3.jpg from:
// http://en.academic.ru

var distanceScalingFactor = 0.2;

// ratios computed using data for the Earth and moon retrieved 2015-03-21 from:
// http://ssd.jpl.nasa.gov/?planet_phys_par
// http://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html

var EarthEquatorialRadius = 6378.14;
var EarthModelRadius = 2.0; // an arbitrary radius for the model in WebGL
var MoonModelRadius = EarthModelRadius * 1738.1 / EarthEquatorialRadius; // equatorial radius of moon divided by equatorial radius of Earth ~ 0.2725
console.log("MoonModelRadius=", MoonModelRadius);
// http://neo.jpl.nasa.gov/glossary/au.html
var EarthOrbitTranslate = 149597870.7 / EarthEquatorialRadius  * distanceScalingFactor * EarthModelRadius;
console.log("EarthOrbitTranslate=", EarthOrbitTranslate);

// more facts about the Moon, retrieved 2015-03-21 from:
// http://solarsystem.nasa.gov/planets/profile.cfm?Display=Facts&Object=Moon

var MoonPerigee = 363104.0;
var MoonApogee = 405696.0;
var MeanMoonDistance = (MoonApogee + MoonPerigee) / 2.0;
var MoonOrbitTranslate = MeanMoonDistance / EarthEquatorialRadius * EarthModelRadius * distanceScalingFactor; // way too big to be practical for this model
console.log("MoonOrbitTranslate=", MoonOrbitTranslate);

// retrieved 2015-03-21 from:
// http://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
var SunRadius = 696000.0;
var SunRadiusModel = SunRadius / EarthEquatorialRadius * EarthModelRadius;

//---------------------------------------------------------------------------------------------------------------------
// CREATE EARTH OBJECT

// Earth at night image, retrieved 2015-03-24, from:
// http://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg

function createEarth2() {
    var geometry = new THREE.SphereGeometry(EarthModelRadius, 32, 32); // 0.5,100,100);
    THREE.ImageUtils.crossOrigin = '';
    var material = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture('js/earth-mark3b.jpg', THREE.SphericalRefractionMapping),
        shininess : 70,
        specular : 0x222222, // 0x222222,
        shading : THREE.SmoothShading,
        opacity: 1.0,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh( geometry, material );
}

//---------------------------------------------------------------------------------------------------------------------
// CREATE MOON OBJECT

function createMoon2() {
    var geometry = new THREE.SphereGeometry(MoonModelRadius, 32, 32); // 0.5,100,100);
    THREE.ImageUtils.crossOrigin = '';
    var imageTexture = THREE.ImageUtils.loadTexture('js/moon-surface.jpg', THREE.SphericalRefractionMapping);
    imageTexture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshPhongMaterial({
        //map: THREE.ImageUtils.loadTexture('js/moon-surface.jpg',THREE.SphericalRefractionMapping),
        map: imageTexture,
        shininess : 40,
        specular : 0x222222,
        shading : THREE.SmoothShading,
        opacity: 1.0,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh( geometry, material );
}

//---------------------------------------------------------------------------------------------------------------------
// CREATE SUN OBJECT

// sun image retrieved 2015-02-26 from:
// http://en.wikipedia.org/wiki/Sun
function createSun2() {
    var geometry = new THREE.SphereGeometry(5, 32, 32);
    //var geometry = new THREE.SphereGeometry(SunRadiusModel, 32, 32);
    THREE.ImageUtils.crossOrigin = '';
    var imageTexture = THREE.ImageUtils.loadTexture('js/Map_of_the_full_sun.jpg',THREE.SphericalRefractionMapping);
    imageTexture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial({
        //map: THREE.ImageUtils.loadTexture('js/Map_of_the_full_sun.jpg',THREE.SphericalRefractionMapping),
        map: imageTexture,
        shininess : 0,
        specular : 0x000000,
        shading : THREE.SmoothShading,
        side: THREE.FrontSide
    });
    return new THREE.Mesh( geometry, material );
}

//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------- Skybox/Skydome concept introduced in class

// SkyMap2.jpg, reverse of image obtained from:
// http://www.seti.net/archive/sky-map/sky-map.php
// retrieved 2015-03-19, MEW3, only used during testing of the final project

// SkySphericalMap2.png, reverse of image obtained from:
// http://th01.deviantart.net/fs70/PRE/i/2012/344/8/9/milky_way_galaxy_global_spherical_map_by_hellstormde-d5nnps8.png
// retrieved:  2015-03-19, MEW3

// tycho_cyl_glow2.png, reverse of image obtained from:
// http://www.geckzilla.com/apod/tycho_cyl_glow.png
// retrieved 2015-03-19, MEW3

// nasa-spherical-space-map3.jpg // even smaller jpg (image size 4kx2k)
// nasa-spherical-space-map2.jpg // smaller than png version
// nasa-spherical-space-map2.png, high resolution reverse of image obtained fro:
// http://svs.gsfc.nasa.gov/vis/a000000/a003800/a003895/starmap_8k.jpg
// retrieved 2015-03-19, MEW3

// It is assumed that the spherical space map is centered on the Earth.  However, since the Earth-Sun distance
// is so small compared to the distance to the background stars, the view should be relatively free of error.
// Some spherical anomalies are noted when viewing down the North or South axis of the solar pole.
// It is noted that my Macbook Pro does a better job of displaying this model than my Windows laptop.  The
// assumption here is that the Macbook Pro has either a better display a better GPU or some combination of both.
// Another interesting anomaly occurs when viewing this model on an iPhone or iPad.  Some have suggested lowering
// the resolution of the spherical space map by half.

function createStarField() {
    //var geometry = new THREE.SphereGeometry(300, 256, 256);
    var geometry = new THREE.SphereGeometry(50000, 256, 256);
    THREE.ImageUtils.crossOrigin = '';
    var material = new THREE.MeshBasicMaterial( {
        //map: THREE.ImageUtils.loadTexture('js/SkyMap2.png', THREE.SphericalRefractionMapping),
        //map: THREE.ImageUtils.loadTexture('js/SkySphericalMap2.png', THREE.SphericalRefractionMapping),
        //map: THREE.ImageUtils.loadTexture('js/tycho_cyl_glow2.png', THREE.SphericalRefractionMapping),
        //map: THREE.ImageUtils.loadTexture('js/nasa-spherical-space-map2.png', THREE.SphericalRefractionMapping),
        //map: THREE.ImageUtils.loadTexture('js/nasa-spherical-space-map2.jpg', THREE.SphericalRefractionMapping),
        map: THREE.ImageUtils.loadTexture('js/nasa-spherical-space-map3.jpg', THREE.SphericalRefractionMapping),
        shininess: 0,
        specular : 0x000000,
        //shading : THREE.SmoothShading,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
}

//---------------------------------------------------------------------------------------------------------------------

var earthShineLight;
function createEarthShine() {
    //earthShineLight = new THREE.PointLight(0xFFFFFF, 0.2, 20);
    //earthShineLight = new THREE.DirectionalLight(0x6495ED, 0.1); // blue
    earthShineLight = new THREE.DirectionalLight(0xFFFFFF, 0.1);
    earthShineLight.position.copy(earth.position);
    earthShineLight.target = moon;
    earth.add(earthShineLight);
}

//---------------------------------------------------------------------------------------------------------------------
// CREATE MOON SHINE

var moonShineLight;
function createMoonShine() {
    var moonLightPos = new THREE.Object3D();
    moonLightPos.translateZ(-11);
    //moonShineLight = new THREE.DirectionalLight(0xFFFFFF, 0.025);
    //moonShineLight = new THREE.SpotLight(0xFFFFFF, 0.015, 15, Math.PI/12);
    moonShineLight = new THREE.SpotLight(0xFFFFFF, 0.015, 15, Math.PI/12);
    moonShineLight.shadowCameraVisible = false;
    moonShineLight.castShadow = true;
    moonShineLight.position.copy(moon.position);
    moonShineLight.target = earth;
    moonShineLight.shadowCameraNear = 15;
    //moon.add(moonShineLight);
    moonLightPos.add(moonShineLight);
    moon.add(moonLightPos);
}

//---------------------------------------------------------------------------------------------------------------------

function createScene() {
    // create a Sun like object
    sun = createSun2();
    sun.name = "SUN";
    sun.rotationDays = 24.47; // http://en.wikipedia.org/wiki/Solar_rotation
    sun.dailyRotation = 365.25 / sun.rotationDays;
    sun.rotationAngle = 0.0;

    // create a blue marble Earth like object
    earth = createEarth2();
    earth.name = "EARTH";
    earth.rotation.x = 23.5/360.0*TwoPI; // ecliptic plane
    earth.rotationAngle = 0.0;
    earth.receiveShadow = true;
    earth.castShadow = true;

    // create a moon like object
    moon = createMoon2();
    moon.name = "MOON";
    moon.translateZ(10); // original model for assignment 4
    //moon.translateZ(MoonOrbitTranslate); // fun but too big for this model
    moon.rotationDays = 27.3; // http://csep10.phys.utk.edu/astr161/lect/time/moonorbit.html
    moon.dailyRotation = 365.25 / moon.rotationDays;
    moon.rotationAngle = 0.0; // the moon doesn't actually rotate from the Earth's point of view due to tidal lock
    moon.rotation.x = 6.687 / 360.0 * TwoPI; // the moon's axis is tilted on it's own orbital plane
    moon.receiveShadow = true;
    moon.castShadow = true;

    //createEarthShine();
    createMoonShine();

    moonOrbit.add(moon);
    moonOrbit.rotationAngle = 0.0;

    var earthCenter = new THREE.Object3D();
    earthCenter.rotation.x = 5.145 / 360.0 * TwoPI; // Moon's orbital inclination to Ecliptic plane;
    // source:  http://www.ruf.rice.edu/~few/Moon%20positions/Moon%27s%20Positions.pdf
    earthCenter.add(moonOrbit);

    earthMoonGroup.rotationAngle = 0.0;
    earthMoonGroup.translateZ(50);
    //earthMoonGroup.translateZ(EarthOrbitTranslate);
    //earth.add(moonOrbit);
    earthMoonGroup.add(earth);
    //earthMoonGroup.add(moonOrbit);
    earthMoonGroup.add(earthCenter);
    earthOrbit.add(earthMoonGroup);
    earthOrbit.rotationAngle = 0.0;

/*
    //var earthSpotLight = new THREE.PointLight(0xFFFFFF, 1.0, 1000);
    var earthSpotLight = new THREE.SpotLight(0xFFFFFF, 1.0);
    earthSpotLight.position.set(0, 0, 0);
    earthSpotLight.castShadow = true;
    earthOrbit.add(earthSpotLight);
*/
    scene.add(earthOrbit);

    scene.add(sun);

    //starField(); // we're going to replace the star field with some sort of skybox or skydome
    var starField = createStarField();
    scene.add(starField);
}

//---------------------------------------------------------------------------------------------------------------------

function lighting() {
    //light = new THREE.PointLight(0xFFFFFF, 1, 1000);
    //light = new THREE.DirectionalLight(0xFFFFFF, 1);
    //light.position.set(0, 0, 0); // the sun is the real source of light
    light = new THREE.SpotLight(0xFFFFFF, 1, 0.0, Math.PI/12);
    light.translateZ(6); // put the light just outside of the surface of the sun
    light.target = earthMoonGroup;
    light.castShadow = true;
    light.shadowDarkness = 0.75; // 1.0 = solid black
    light.shadowCameraVisible = false;
    light.shadowCameraNear = 10.0;
    //scene.add(light);
    earthOrbit.add(light); // add the light to the orbit of Earth so it always points at the Earth
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function checkKeys() {
    /*
    if (keyboard.pressed("o")) {
        useFlyControls = !useFlyControls; // toggle between orbit and fly controls
    }
    if (keyboard.pressed("7")) {
        console.log("7 pressed");
        pointAtEarth = true;
    }
    */
}

//---------------------------------------------------------------------------------------------------------------------
function calculateRotation(sourceAngle, rotRate) {
    var outAngle = sourceAngle;
    if (fizzyText.runBackwards) {
        outAngle -= rotRate;
        if (outAngle < 0.0) outAngle += TwoPI;
    }
    else {
        outAngle += rotRate;
        if (outAngle >= TwoPI) outAngle -= TwoPI;
    }
    return outAngle;
}

//---------------------------------------------------------------------------------------------------------------------
function render() {
    var delta = clock.getDelta();

    /*
    if (fizzyText.showSunSpotCam) {
        light.shadowCameraVisible = true;
    }
    else {
        light.shadowCameraVisible = false;
    }

    if (fizzyText.showMoonSpotCam) {
        moonShineLight.shadowCameraVisible = true;
    }
    else {
        moonShineLight.shadowCameraVisible = false;
    }
    */
    //light.shadowCameraNear = fizzyText.sunSpotCamNear;
    //light.needsUpdate();

    // allow the animation to be stopped, which is convenient for snapshots
    if (fizzyText.rotateSystem) {
        var rotationRate = TwoPI * delta / fizzyText.secondsPerCycle;

        // rotate earth orbit around the sun (actually, around the scene's absolute center)
        //earthOrbit.rotationAngle += rotationRate;
        //if (earthOrbit.rotationAngle >= TwoPI) earthOrbit.rotationAngle -= TwoPI;
        earthOrbit.rotationAngle = calculateRotation(earthOrbit.rotationAngle, rotationRate);
        earthOrbit.rotation.y = earthOrbit.rotationAngle;

        // rotate the earth once per day
        //earth.rotationAngle += 365.25 * rotationRate;
        //if (earth.rotationAngle >= TwoPI) earth.rotationAngle -= TwoPI;
        earth.rotationAngle = calculateRotation(earth.rotationAngle, 365.25 * rotationRate);
        earth.rotation.y = earth.rotationAngle;

        // moon orbit around the earth
        //moonOrbit.rotationAngle += rotationRate * moon.dailyRotation;
        //if (moonOrbit.rotationAngle >= TwoPI) moonOrbit.rotationAngle -= TwoPI;
        moonOrbit.rotationAngle = calculateRotation(moonOrbit.rotationAngle, rotationRate * moon.dailyRotation);
        moonOrbit.rotation.y = moonOrbit.rotationAngle;

        //if (fizzyText.rotateSun) {
        //sun.rotationAngle += rotationRate * sun.dailyRotation;
        //if (sun.rotationAngle >= TwoPI) sun.rotationAngle =- TwoPI;
        sun.rotationAngle = calculateRotation(sun.rotationAngle, rotationRate * sun.dailyRotation);
        sun.rotation.y = sun.rotationAngle;
    }

    /*
    if (fizzyText.earthLookFlag) {
        //camera.lookAt(new THREE.Vector3(earthMoonGroup.position.x, earthMoonGroup.position.y, earthMoonGroup.position.z));
        camera.lookAt(new THREE.Vector3(0,0,50));
    }
    */

    checkKeys();
    //if (useFlyControls)
    //    cameraControls.update(delta);
    //else {
        if (pointAtEarth) {
            scene.updateMatrixWorld();
            var vector = new THREE.Vector3();
            vector.setFromMatrixPosition(earthMoonGroup.matrixWorld);
            //console.log(vector);
            //camera.lookAt(vector);
            //cameraOrbitControls.target.set(vector);
            //cameraOrbitControls.center.set(vector);
            //cameraOrbitControls.center.set(new THREE.Vector3(1,1,1));
        }
        cameraOrbitControls.update(delta);
    //}

    renderer.render(scene, camera);
    //console.log(camera.position.x, camera.position.y, camera.position.z); // useful for determining a good starting position
    //console.log(earthMoonGroup.position.x, earthOrbit.position.x, earth.position.x);
}

var maxSecondsForYear = 2922.0; // 8 x 365.25

var FizzyText = function() {
    function defaultValues(object) {
        object.secondsPerCycle = maxSecondsForYear; // 8 x 365.25;
        object.rotateSystem = true;
        object.runBackwards = false;
        //object.showSun = true;
        object.showSunSpotCam = false;
        //object.sunSpotCamNear = 75;
        object.showMoonSpotCam = false;
        //object.rotateSun = true;
        //object.sunWireframe = false;
        //object.ecliptic = true;
        object.earthLookFlag = false;
    }

    defaultValues(this);


    this.Go = function() {
        //sun.material.wireframe = this.sunWireframe;
        //earth.rotation.x = this.ecliptic ? 23.5 / 360.0 * TwoPI : 0.0;
        if (this.showSunSpotCam) {
            light.shadowCameraVisible = true;
        }
        else {
            light.shadowCameraVisible = false;
        }
        if (this.showMoonSpotCam) {
            moonShineLight.shadowCameraVisible = true;
        }
        else {
            moonShineLight.shadowCameraVisible = false;
        }
        /*
        if (this.showSun) {
            //sun.
        }
        */
    };

    this.Reset = function() {
        defaultValues(this);
        pointAtEarth = false;
        //this.Go();
        camera.position.set(camX, camY, camZ);
        //cameraOrbitControls.center.set(new THREE.Vector3(0, 0, 0));
        //sun.material.visible = true;
    };

    this.zLook = function() {
        camera.position.set(0, 0, camX);
    };

    this.yLook = function() {
        camera.position.set(0, camX, 0);
    };
};

// based on code retrieved 2015-02-15, from this tutorial web site
// http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
function createDatGUI() {
    gui.add(fizzyText, 'secondsPerCycle', 60, maxSecondsForYear).step(10).listen();
    gui.add(fizzyText, 'rotateSystem').listen();
    gui.add(fizzyText, 'runBackwards').listen();
    //gui.add(fizzyText, 'showSun').listen();
    gui.add(fizzyText, 'showSunSpotCam').listen();
    //gui.add(fizzyText, 'sunSpotCamNear', 0.1, 75).step(0.1).listen();
    gui.add(fizzyText, 'showMoonSpotCam').listen();
    //gui.add(fizzyText, 'sunWireframe').listen();
    //gui.add(fizzyText, 'ecliptic').listen();
    //gui.add(fizzyText, 'rotateSun').listen();
    gui.add(fizzyText, 'zLook');
    gui.add(fizzyText, 'yLook');
    gui.add(fizzyText, 'Go');
    gui.add(fizzyText, 'Reset');
}

function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({antialias : true});
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(0x000000, 1.0);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 100000);
    //camera = new THREE.OrthographicCamera(-canvasWidth / 2, canvasWidth /2, -canvasHeight / 2, canvasHeight / 2, 1, 200);
    camera.position.set(camX, camY, camZ);
    //camera.lookAt(new THREE.Vector3(50, 50, 50));

    cameraOrbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    // fly controls based on information found here, 2015-03-22:
    // http://threejs.org/examples/webgl_lensflares.html

    /*
    cameraControls = new THREE.FlyControls(camera);
    cameraControls.movementSpeed = 25;
    cameraControls.domElement = container;
    cameraControls.rollSpeed = Math.PI / 12;
    cameraControls.autoForward = false;
    cameraControls.dragToLook = false;
    */
    lighting();
    createDatGUI();
}

function showGrids() {
//	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
    Coordinates.drawAllAxes({axisLength:100, axisRadius:1.0 });
}

var container;

function createContainer() {
    container = document.getElementById('container');
}

function addToDOM() {
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}

// more global variables

var camera, scene, renderer, light;
var cameraControls, cameraOrbitControls;
var useFlyControls = false;
var pointAtEarth = false;
var clock = new THREE.Clock();

var camX = 107.0; // 0.5; //-32;
//var camX = EarthOrbitTranslate * distanceScalingFactor * 2;
var camY = 0; // 24.5; //50;
var camZ = 0; // 215;

var fizzyText = new FizzyText();
var gui = new dat.GUI();

// try {
createContainer();
//var keyboard = new THREEx.KeyboardState(); // based on:  http://learningthreejs.com/blog/2011/09/12/lets-Make-a-3D-game-keyboard/
console.log("createContainer() completed.");
init();
//showGrids();
createScene();
addToDOM();
render();
animate();
/**
 } catch(e) {
    var errorMsg = "Error: " + e;
    document.getElementById("msg").innerHTML = errorMsg;
}
 **/


/*

    Interesting websites:

    http://threegraphs.com/charts/sample/world/
    http://bkcore.com/blog/3d/webgl-three-js-animated-selective-glow.html
    http://mgvez.github.io/jsorrery/
    http://threejs.org/examples/misc_controls_fly
 */
