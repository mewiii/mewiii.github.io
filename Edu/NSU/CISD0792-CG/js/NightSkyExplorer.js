/**
 * Created by wilborne on 3/21/2015.
 */

// let's explore the Night Sky, simple sky map

/*  Course:  CISD 0792 Computer Graphics with Dr. Micahel Laszlo
 Title:  Final Project
 Description:  A simple night sky explorer
 Author:  Marvin Edward Wilborne, III
 */

/*
 Framework for this exercise based on work by Dr. Michael Laszlo
 Retrieved from:  http://scis.nova.edu/~mjl/threejs/js/closedPyramid2.js
 2015-01-21
 */

//---------------------------------------------------------------------------------------------------------------------

function createStarField() {
    var geometry = new THREE.SphereGeometry(50000, 256, 256);
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

function createScene() {
    var starField = createStarField();
    scene.add(starField);
}

//---------------------------------------------------------------------------------------------------------------------

function render() {
    var delta = clock.getDelta();

    cameraOrbitControls.update(delta);

    renderer.render(scene, camera);
}

//---------------------------------------------------------------------------------------------------------------------

function animate() {
    window.requestAnimationFrame(animate);
    render();
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

    camera = new THREE.PerspectiveCamera(40, canvasRatio, 1, 100000);
    camera.position.set(camX, camY, camZ);

    cameraOrbitControls = new THREE.OrbitControls(camera, renderer.domElement);

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

var camera, scene, renderer;
var cameraOrbitControls;
var clock = new THREE.Clock();

var camX = 100;
var camY = 0;
var camZ = 0;

//---------------------------------------------------------------------------------------------------------------------
// Let's GO!

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
