/**
 * Created by wilborne on 3/21/2015.
 */

// let's explore various Earth-Moon dynamics

/*  Course:  CISD 0792 Computer Graphics with Dr. Micahel Laszlo
 Title:  Final Project
 Description:  The Earth and the Moon, Barycenter Demonstration
 Author:  Deanna Marie Wilborne
 */

/*
 Framework for this exercise based on work by Dr. Michael Laszlo
 Retrieved from:  http://scis.nova.edu/~mjl/threejs/js/closedPyramid2.js
 2015-01-21
 */

//---------------------------------------------------------------------------------------------------------------------
// CREATE SUN OBJECT

// sun image retrieved 2015-02-26 from:
// http://en.wikipedia.org/wiki/Sun
function createSun2() {
    var geometry = new THREE.SphereGeometry(SunRadiusModel, 32, 32);
    THREE.ImageUtils.crossOrigin = '';
    var imageTexture = THREE.ImageUtils.loadTexture('js/Map_of_the_full_sun.jpg',THREE.SphericalRefractionMapping);
    imageTexture.minFilter = THREE.NearestFilter;
    var material = new THREE.MeshBasicMaterial({
        map: imageTexture,
        shininess : 0,
        specular : 0x000000,
        shading : THREE.SmoothShading,
        side: THREE.FrontSide
    });
    return new THREE.Mesh( geometry, material );
}

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

function createStarField() {
    var geometry = new THREE.SphereGeometry(150000, 256, 256);
    THREE.ImageUtils.crossOrigin = '';
    var material = new THREE.MeshBasicMaterial( {
        map: THREE.ImageUtils.loadTexture('js/nasa-spherical-space-map3.jpg', THREE.SphericalRefractionMapping),
        shininess: 0,
        specular : 0x000000,
        side: THREE.DoubleSide
    });
    return new THREE.Mesh(geometry, material);
}

//---------------------------------------------------------------------------------------------------------------------
var sun;
var sunOrbit = new THREE.Object3D(); // we're going to use a modified Ptolemaic system, the BaryCenter is the center of the Universe
var sunHolder = new THREE.Object3D(); // this will hold the sun object that rotates at a different rate than the orbit

var earth;
var baryCenter = new THREE.Object3D();
var earthHolder = new THREE.Object3D();

var moon;
var moonHolder = new THREE.Object3D();

var TwoPI = Math.PI * 2.0;

function createScene() {
    // let's create our star!
    sun = createSun2();
    sun.name = "SUN";
    sun.rotationDays = 24.47; // http://en.wikipedia.org/wiki/Solar_rotation
    sun.dailyRotation = 365.25 / sun.rotationDays;
    sun.rotationAngle = 0.0;

    // let's add our star to it's holder
    sunHolder.add(sun);
    sunHolder.translateZ(EarthOrbitTranslate);

    // now let's add our sun's holder to it's orbit geometry
    sunOrbit.add(sunHolder);
    sunOrbit.rotationAngle = 0.0;

    // now add the sun's completed geometry to the scene
    scene.add(sunOrbit);

    // let's create our home! (Our Pale Blue Dot)
    earth = createEarth2();
    earth.name = "EARTH";
    earth.rotation.x = 23.5/360.0*TwoPI; // ecliptic plane
    earth.rotationAngle = 0.0;
    earth.receiveShadow = true;
    earth.castShadow = true;

    earthHolder.add(earth);
    earthHolder.rotationAngle = 0.0;
    earthHolder.translateZ(baryCenterEarthOrbitTranslate);

    baryCenter.rotationAngle = 0.0;
    baryCenter.rotationDays = 27.3; // http://csep10.phys.utk.edu/astr161/lect/time/moonorbit.html
    baryCenter.dailyRotation = 365.25 / baryCenter.rotationDays;
    baryCenter.rotation.x = 5.145 / 360.0 * TwoPI; // Moon's orbital inclination to Ecliptic plane;

    baryCenter.add(earthHolder);


    // let's create our Moon...  we've got to return there someday (hopefully soon)
    moon = createMoon2();
    moon.name = "MOON";
    //moon.translateZ(-MoonOrbitTranslate); // original model for assignment 4
    //moon.translateZ(-20.0); // for testing
    moon.rotationAngle = 0.0; // the moon doesn't actually rotate from the Earth's point of view due to tidal lock
    moon.rotation.x = 6.687 / 360.0 * TwoPI; // the moon's axis is tilted on it's own orbital plane
    moon.receiveShadow = true;
    moon.castShadow = true;
    //moon.rotationDays = 27.3; // http://csep10.phys.utk.edu/astr161/lect/time/moonorbit.html
    //moon.dailyRotation = 365.25 / moon.rotationDays;

    //moonHolder.rotation.x = 5.145 / 360.0 * TwoPI; // Moon's orbital inclination to Ecliptic plane;
    moonHolder.translateZ(-MoonOrbitTranslate); // original model for assignment 4
    moonHolder.add(moon);

    baryCenter.add(moonHolder);

    scene.add(baryCenter);

    // now we're going to add the background stars
    var starField = createStarField();
    scene.add(starField);
}

//---------------------------------------------------------------------------------------------------------------------

function lighting() {
    //light = new THREE.SpotLight(0xFFFFFF, 1, 0.0, Math.PI/12); // too narrow
    //light = new THREE.SpotLight(0xFFFFFF, 1, 0.0, Math.PI/36); // too narrow
    light = new THREE.SpotLight(0xFFFFFF, 1, 0.0);
    //light = new THREE.DirectionalLight(0xFFFFFF, 1);
    //light.target = baryCenter; // interesting (when the shadow camera is visible) but not accurate
    light.target = earthHolder;
    light.castShadow = true;
    light.shadowDarkness = 0.75; // 1.0 = solid black
    light.shadowCameraVisible = false;
    light.shadowCameraNear = 10.0;
    //scene.add(light);

    //light.translateZ(EarthModelRadius / 2.0);
    light.translateZ(1350); // for use with SpotLight
    //light.translateZ(EarthModelRadius / 2.0); // put the directional light at the center of the Sun
    sunOrbit.add(light);
    //earthOrbit.add(light); // add the light to the orbit of Earth so it always points at the Earth
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

    if (fizzyText.rotateSystem) {
        var rotationRate = TwoPI * delta / fizzyText.secondsPerCycle;

        // Instead of rotating the Earth around the Sun, let's rotate the Sun around the Barycenter
        sunOrbit.rotationAngle = calculateRotation(sunOrbit.rotationAngle, rotationRate);
        sunOrbit.rotation.y = sunOrbit.rotationAngle;

        // rotate the earth once per day
        earth.rotationAngle = calculateRotation(earth.rotationAngle, 365.25 * rotationRate);
        earth.rotation.y = earth.rotationAngle;

        var baryCtrRot = rotationRate * baryCenter.dailyRotation;
        // Instead of spinning the moon around the baryCenter, let's rotate the baryCenter
        baryCenter.rotationAngle = calculateRotation(baryCenter.rotationAngle, baryCtrRot);
        baryCenter.rotation.y = baryCenter.rotationAngle;

        // counter rotate the Earth holder so that the north pole always points in the same direction
        earthHolder.rotationAngle = calculateRotation(earthHolder.rotationAngle, -baryCtrRot);
        earthHolder.rotation.y = earthHolder.rotationAngle;

        // spin the Sun at the appropriate rate
        sun.rotationAngle = calculateRotation(sun.rotationAngle, rotationRate * sun.dailyRotation);
        sun.rotation.y = sun.rotationAngle;
    }

    cameraOrbitControls.update(delta);

    renderer.render(scene, camera);
}


//---------------------------------------------------------------------------------------------------------------------

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

//---------------------------------------------------------------------------------------------------------------------

// var maxSecondsForYear = 2922.0; // 8 x 365.25
var maxSecondsForYear = 11688.0; // 32 x 365.25

var FizzyText = function() {
    function defaultValues(object) {
        object.secondsPerCycle = maxSecondsForYear; // 8 x 365.25;
        object.rotateSystem = true;
        object.runBackwards = false;
        object.showSunSpotCam = false;
        /*
        object.showSun = true;
        object.showSunSpotCam = false;
        //object.sunSpotCamNear = 75;
        object.showMoonSpotCam = false;
        //object.rotateSun = true;
        //object.sunWireframe = false;
        //object.ecliptic = true;
        object.earthLookFlag = false;
        */
    }

    defaultValues(this);

    this.Go = function() {
        if (this.showSunSpotCam) {
            light.shadowCameraVisible = true;
        }
        else {
            light.shadowCameraVisible = false;
        }
    };

    this.Help = function() {
        var helpWindow = window.open("",
            "_blank",
            "toolbar=no, scrollbars=yes, resizable=yes, top=250, left=500, width=400, height=400, location=no, menubar=no"
        );
        helpWindow.document.write("<h3>Brief Help</h3>");
        helpWindow.document.write("<p>");
        helpWindow.document.write("<ul>");
        helpWindow.document.write("<li>stepsPerCycle - the number of seconds for a simulated year of motion</li>");
        helpWindow.document.write("<li>rotateSystem - enable or disable the animation</li>");
        helpWindow.document.write("<li>runBackwards - the direction of the animation; useful for exploring eclipses</li>");
        helpWindow.document.write("<li>showSunSpotCamera - show the shadow camera detail; press go to activate change; which is useful for finding eclipses</li>");
        helpWindow.document.write("<li>Go - activate non dynamic features</li>");
        helpWindow.document.write("<li>Help - this limited information</li>");
        helpWindow.document.write("</ul>");
        helpWindow.document.write("</p>");
    };

    this.About = function() {
        var aboutWindow = window.open("",
            "_blank",
            "toolbar=no, scrollbars=yes, resizable=yes, top=250, left=500, width=400, height=400, location=no, menubar=no"
        );
        aboutWindow.document.write("<h3>About EarthMoonSimulation.js</h3>");
        aboutWindow.document.write("<h4>by Deanna M. Wilborne</h4>");
        aboutWindow.document.write("<p>");
        aboutWindow.document.write("A simple simulation of the Earth and Moon as they orbit the barycenter.  ");
        aboutWindow.document.write("Orbits are circular.  The motion of the barycenter towards and away from ");
        aboutWindow.document.write("the center of the Earth is not implemented due to the small motion at the ");
        aboutWindow.document.write("scale presented.  It is possible to find and view both lunar and solar ");
        aboutWindow.document.write("eclipses.<br /><br />Portions of the framework for this code were written ");
        aboutWindow.document.write("by Michael Laszlo.");
        aboutWindow.document.write("</p>");
    };
    /*
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
        if (this.showSun) {
            //sun.
        }
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
    */
};

//---------------------------------------------------------------------------------------------------------------------
// based on code retrieved 2015-02-15, from this tutorial web site
// http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
function createDatGUI() {
    gui.add(fizzyText, 'secondsPerCycle', 60, maxSecondsForYear).step(10).listen();
    gui.add(fizzyText, 'rotateSystem').listen();
    gui.add(fizzyText, 'runBackwards').listen();
    gui.add(fizzyText, 'showSunSpotCam').listen();
    gui.add(fizzyText, 'Go');
    gui.add(fizzyText, 'Help');
    gui.add(fizzyText, 'About');
    /*
    gui.add(fizzyText, 'showSun').listen();
    gui.add(fizzyText, 'showSunSpotCam').listen();
    //gui.add(fizzyText, 'sunSpotCamNear', 0.1, 75).step(0.1).listen();
    gui.add(fizzyText, 'showMoonSpotCam').listen();
    //gui.add(fizzyText, 'sunWireframe').listen();
    //gui.add(fizzyText, 'ecliptic').listen();
    //gui.add(fizzyText, 'rotateSun').listen();
    gui.add(fizzyText, 'zLook');
    gui.add(fizzyText, 'yLook');
    gui.add(fizzyText, 'Reset');
    */
}

//---------------------------------------------------------------------------------------------------------------------
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

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 200000);
    camera.position.set(camX, camY, camZ);

    cameraOrbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    //cameraOrbitControls.target = moon;

    lighting(); // the sun has fire!
    createDatGUI();
}

//---------------------------------------------------------------------------------------------------------------------

function showGrids() {
//	Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
    Coordinates.drawAllAxes({axisLength:100, axisRadius:1.0 });
}

//---------------------------------------------------------------------------------------------------------------------

var container;

function createContainer() {
    container = document.getElementById('container');
}

//---------------------------------------------------------------------------------------------------------------------

function addToDOM() {
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}

//---------------------------------------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------------------------------------------------------
// scale the model

var distanceScalingFactor = 1.0;
var EarthEquatorialRadius = 6378.14;
var EarthModelRadius = 2.0; // an arbitrary radius for the model in WebGL
var MoonModelRadius = EarthModelRadius * 1738.1 / EarthEquatorialRadius; // equatorial radius of moon divided by equatorial radius of Earth ~ 0.2725
console.log("MoonModelRadius=", MoonModelRadius);
// http://neo.jpl.nasa.gov/glossary/au.html
var EarthOrbitTranslate = 149597870.7 / EarthEquatorialRadius  * distanceScalingFactor * EarthModelRadius;
console.log("EarthOrbitTranslate=", EarthOrbitTranslate);

// http://www.astronomycafe.net/qadir/q665.html
var baryCenterEarthOrbitTranslate = 4641.0 / EarthEquatorialRadius * EarthModelRadius;

// more facts about the Moon, retrieved 2015-03-21 from:
// http://solarsystem.nasa.gov/planets/profile.cfm?Display=Facts&Object=Moon

var MoonPerigee = 363104.0;
var MoonApogee = 405696.0;
var MeanMoonDistance = (MoonApogee + MoonPerigee) / 2.0;
//var MoonOrbitTranslate = MeanMoonDistance / EarthEquatorialRadius * EarthModelRadius * distanceScalingFactor; // way too big to be practical for this model
var MoonOrbitTranslate = MeanMoonDistance / EarthEquatorialRadius * distanceScalingFactor; // way too big to be practical for this model
console.log("MoonOrbitTranslate=", MoonOrbitTranslate);

// retrieved 2015-03-21 from:
// http://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
var SunRadius = 696000.0;
var SunRadiusModel = SunRadius / EarthEquatorialRadius * EarthModelRadius;
console.log("SunRadiusModel=", SunRadiusModel);

var fizzyText = new FizzyText();
var gui = new dat.GUI();

// try {
createContainer();
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
