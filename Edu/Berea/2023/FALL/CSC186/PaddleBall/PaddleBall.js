/*

     Author:    Deanna Marie Wilborne
    Created:    2020-11-11
    Purpose:    Create 2D games using HTML Canvas.

    History:
                2020-11-11, initial version.
                2020-11-23, updated program comments.

*/

/*  Things to do...

    * Add variable speed paddle that changes the paddle width - faster == shorter, slower == longer

*/

// 2020-11-11, DMW, this code is based on:
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Drawing_graphics
// retrieved on 2020-11-09

// get a reference to the canvas object
const canvas = document.querySelector('.myCanvas');
// get and set the canvas width and height to match that of the display area of the web browser
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 2020-11-24, DMW, added game sounds
// game sounds
const paddleSound = document.getElementById("paddleAudio");
const borderSound = document.getElementById("borderAudio");

// define the keys we're going to track in our application
let keyDown = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyQ: false,
};

let runAnimation = true; // as long as this is true, we'll generate frames and run the game loop
let PI2 = 2.0 * Math.PI;

// 2020-11-23, DMW, we're going to allow the square to be a rectangle
let sizeX = 125; // width and height of square (rectangle)
let sizeY = 10; // rename these variables since they deal with the paddle
// set up a square and x and y to track the upper left corner of the square
let y = height - 4 * sizeY; // starting value for y
let x = (width - sizeX) / 2; // starting value for x
// 2020-11-23, DMW, size represents the ball size, now
let size = 25; // 2020-11-24, DMW, this is the size of the circle, probably rename this variable.
let stepSize = 35; // 2020-11-23, DMW, we're adding a step size for the rectangle (paddle speed)
let square_style = 'rgba(255, 0, 0, 1.0)'; // make the square red all the time
let ball_style = 'rgba(255, 255, 255, 1.0)'; // make the ball while
let verticalPaddleMotion = false; // if true, vertical paddle motion is enabled
//let horizontalWrapEnabled = false; // allow paddle to wrap around left and right borders

let Score = 0; // this is the game score

// 2020-11-12, DMW, added code to detect keydown events
// keyboard event listener based on code from:
// https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
document.addEventListener('keydown', downKey);

//--------------------------------------------------------- downKey()
function downKey(e) {
    //log.textContent += ` ${e.code}`;
    let myKey = `${e.code}`;
    console.log(myKey); // show the key pressed on the console -- use for debugging
    switch (myKey) {
        // 2020-11-23, DMW, removed up and down arrow movements for rectangle
        case 'ArrowUp':
            keyDown.ArrowUp = verticalPaddleMotion;
            break;
        case 'ArrowDown':
            keyDown.ArrowDown = verticalPaddleMotion;
            break;
        case 'ArrowLeft':
            keyDown.ArrowLeft = true;
            break;
        case 'ArrowRight':
            keyDown.ArrowRight = true;
            break;
        case 'KeyQ':
            keyDown.KeyQ = true;
            break;
        case 'KeyS':
            runAnimation = false;
            AnimationLoop();
            break;
        case 'KeyR':
            runAnimation = true;
            AnimationLoop();
            break;
        // 2020-11-17, DMW, added the Equal Key to speed up the ball
        case 'Equal':
            ballSpeed += 5;
            break;
        // 2020-11-17, DMW, added the Minus key to slow down the ball
        case 'Minus':
            ballSpeed -= 5;
            if (ballSpeed < 0) ballSpeed = 0;
            break;
        // 2020-11-18, DMW, change the ball's color randomly when the C key is pressed.
        case 'KeyC':
            ball_style = 'rgba(' + Math.random()*255 + ', ' + Math.random()*255 + ', ' + Math.random()*255 + ', 1.0)';
            break;
        // 2020-11-24, DMW, launch the ball, if it is not in flight
        case 'Space':
            if (ballInFlight) return;
            ballAngle = deg2rad(Math.random() * 60 + 230); // 60 degree wide launch window between 60 & 120 degrees
            ballInFlight = true;
            break;
  }
} // end of downKey()

// get a context for the canvas that supports 2-D (two dimensional) graphics
const ctx = canvas.getContext('2d');

//--------------------------------------------------------- setCanvasBlack()
// set the color and fill the canvas with that color
// creates the function
function setCanvasBlack() {
    ctx.fillStyle = 'rgb(0, 0, 0)'; // black
    ctx.fillRect(0, 0, width, height); // coordinate pairs are (x1, y1) and (x2, y2)
}

//--------------------------------------------------------- handleKeyPress()
// this function handles key presses
function handleKeyPress() {
    if (keyDown.ArrowDown) {
        keyDown.ArrowDown = false;
        y += stepSize;
        if (y > height - sizeY) y = 0;
    }

    if (keyDown.ArrowUp) {
        keyDown.ArrowUp = false;
        y -= stepSize;
        if (y < 0) y = height - sizeY;
    }

    if (keyDown.ArrowRight) {
        keyDown.ArrowRight = false;
        x += stepSize;
        // 2020-11-23, DMW, don't allow right movement past right edge of canvas
        if (x > width - sizeX) x = width - sizeX; // 0;
    }

    if (keyDown.ArrowLeft) {
        keyDown.ArrowLeft = false;
        x -= stepSize;
        // 2020-11-23, restrict left movement to stop at left edge
        if (x < 0) x = 0; // width - sizeX;
    }

    if (keyDown.KeyQ) {
        keyDown.KeyQ = false;
        runAnimation = false;
    }
} // end of handleKeyPress()

//--------------------------------------------------------- ballCollisionDetect()
// 2020-11-23, DMW, added this method
// based on a series of articles found here:
// https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects
// 2020-11-24, DMW, made local variables local
function ballCollisionDetect() {
    // we'll start with an AABB (axis-aligned bounding box) algorithm
    let ballMinX = ballX - ballRadius;
    let ballMinY = ballY - ballRadius;

    let d1x = ballMinX - (x + sizeX);
    let d1y = ballMinY - (y + sizeY);
    if (d1x > 0 || d1y > 0) return false;

    let ballMaxX = ballX + ballRadius;
    let ballMaxY = ballY + ballRadius;

    let d2x = x - ballMaxX;
    let d2y = y - ballMaxY;
    return !(d2x > 0 || d2y > 0);
}

// --------------------------- radians to degrees
// 2020-11-17, DMW, created
//function rad2deg(angle) { return angle * 180.0 / Math.PI; }

// --------------------------- degrees to radians
// 2020-11-18, DMW, created
function deg2rad(angle) {
    return angle / 180.0 * Math.PI;
}

// set up ball characteristics
let ballX = width / 2;
let ballY = height / 2;
let ballRadius = size / 2;
let ballAngle = 2 * Math.PI * Math.random(); // set the starting angle
let ballSpeed = 10;
//let ballWobbleProbability = 0.01; // 2020-11-18, DMW, the probability of wobbling
//let ballWobbleDegrees = 5.0; // angle the ball will wobble slightly when it hits an edge
//let ballWobbleRadians = deg2rad(ballWobbleDegrees);
let bounceOffBottom = false; // 2020-11-24, DMW, be able to loose the ball
let ballInFlight = false; // 2020-11-24, DMW, be able to stop the ball
let soundEnabled = false; // 2020-11-24, DMW, flexibility to make the game quiet while working on it

//--------------------------------------------------------- wobble()
// return a wobble of +/- ballWobbleRadians / 2 degrees
// 2020-11-17, DMW, this is not well tested
/*
function wobble() {
    //return (Math.random() <= ballWobble) ? Math.random() * ballWobbleRadians + (-ballWobbleRadians / 2.0) : 0;
    return 0;
}
*/

//--------------------------------------------------------- moveBall()
function moveBall() {
    // 2020-11-24, DMW, if the ball is not in flight, move it along with the paddle
    if (!ballInFlight) {
        ballX = x + sizeX / 2;
        ballY = y - ballRadius;
        return;
    }

    // the ball is in flight, move it!

    let deltaX = Math.cos(ballAngle); // 2020-11-23, DMW, updated to use var prefix to make these variables local to moveBall()
    let deltaY = Math.sin(ballAngle);

    // as long as x and y are both negative (i.e. decreasing), show the ball angle
    //if ((deltaX < 0) && (deltaY < 0)) console.log(rad2deg(ballAngle));

    // calculate new ball position
    ballX += ballSpeed * deltaX;
    ballY += ballSpeed * deltaY;

    // 2020-11-23, DMW, added collision detection in ball motion
    // fast collisions detection
    if(ballCollisionDetect()) { // if we have a collision, now we have to figure the closest side of the collision
        //console.log("boink!");

        // detect top of box collision (with bottom of ball)
        if ((y <= ballY + ballRadius) && (ballY - ballRadius <= y)) {
            ballAngle = (deltaX >= 0) ? PI2 - ballAngle : Math.PI - (ballAngle - Math.PI);
            ballY = y - ballRadius;
            if (soundEnabled) paddleSound.play();
            return;
        }

        // detect right side of ball collision with left side of rectangle
        if ((x <= ballX + ballRadius) && (ballX - ballRadius <= x)) {
            ballAngle = (deltaY >= 0) ? Math.PI - ballAngle : PI2 - ballAngle + Math.PI;
            ballX = x - ballRadius;
            if (soundEnabled) paddleSound.play();
            return;
        }

        // detect bottom of box collision (with top of ball)
        if ((ballY - ballRadius <= y + sizeY) && (ballY + ballRadius) > y + sizeY) {
            ballAngle = (deltaX >= 0) ? PI2 - ballAngle : Math.PI - (ballAngle - Math.PI);
            ballY = y + sizeY + ballRadius;
            if (soundEnabled) paddleSound.play();
            return;
        }

        // detect right edge of box collision with left side of ball
        if ((ballX - ballRadius <= x + sizeX) && (ballX + ballRadius > x + sizeX)) {
            ballAngle = (deltaY >= 0) ? Math.PI - ballAngle : PI2 - (ballAngle - Math.PI);
            ballX = x + sizeX + ballRadius;
            if (soundEnabled) paddleSound.play();
            return;
        }

    }

    // detect collisions with the walls (top, left, right, bottom)

    // right edge detection
    if (ballX >= width - ballRadius) { // edge of ball too far detection
        ballX = width - ballRadius; // 2020-11-18, DMW, added this line and updated if test above to prevent crossing edge
        // 2020-11-24, DMW, Q1->Q2 (x+, y+) : Q4->Q3 (x+, y-)
        ballAngle = (deltaY >= 0) ? Math.PI - ballAngle : PI2 - ballAngle + Math.PI;
        if (soundEnabled) borderSound.play();
        return; // 2020-11-18, DMW, short circuit (i.e. fast exit of method)
    }
    // left edge detection
    if (ballX <= ballRadius) { // 0 + ballRadius // makes the edge of the ball bounce
        ballX = ballRadius; // 2020-11-18, DMW, added this line and updated if test above to prevent crossing edge
        // 2020-11-24, DMW, Q2->Q1 (x-, y+) : Q3->Q4 (x-, y-)
        ballAngle = (deltaY >= 0) ? Math.PI - ballAngle : PI2 - (ballAngle - Math.PI);
        if (soundEnabled) borderSound.play();
        return; // 2020-11-18, DMW, short circuit (i.e. fast exit of method)
    }
    // y was decreasing detection (we hit the top edge, minimum y)
    if (ballY <= ballRadius) { // 0 + ballRadius
        ballY = ballRadius; // 2020-11-18, DMW, added this line and updated if test above to prevent crossing edge
        // 2020-11-24, DMW, (x+, y-) : (x-, y-)
        ballAngle = (deltaX >= 0) ? PI2 - ballAngle : Math.PI - (ballAngle - Math.PI);
        if (soundEnabled) borderSound.play();
        return; // 2020-11-18, DMW, short circuit (i.e. fast exit of method)
    }
    // y was increasing when we hit the bottom edge of screen (maximum y)
    if (ballY >= height - ballRadius) {
        if (!bounceOffBottom) {
            ballInFlight = false;
            ballX = x + sizeX / 2;
            ballY = y - ballRadius;
            return;
        }
        ballY = height - ballRadius; // 2020-11-18, DMW, added this line and updated if test above to prevent crossing edge
        /*
        if (deltaX >= 0) {
        // x+, y+
        // 2020-11-17, DMW, this direction is now correct
            ballAngle = PI2 - ballAngle; // + wobble();
            if (soundEnabled) borderSound.play(); // 2020-11-24, DMW, added bounce sound
        }
        else {
            // x-, y+ --> quadrant 2, need to move to x-, y- in quadrant 3
            // 2020-11-17, DMW, this direction is now correct
            ballAngle = Math.PI + (Math.PI - ballAngle); // + wobble();
            if (soundEnabled) borderSound.play(); // 2020-11-24, DMW, added bounce sound
        }
        */
        // (x+, y+) : (x-, y+) --> Q2 move to x-, y- in Q3
        ballAngle = (deltaX >= 0) ? PI2 - ballAngle : Math.PI + (Math.PI - ballAngle);
        if (soundEnabled) borderSound.play();
    }
} // end moveBall()

//--------------------------------------------------------- drawBall()
function drawBall() {
    ctx.beginPath();
    ctx.fillStyle = ball_style;
    ctx.arc(ballX, ballY, ballRadius, 0, PI2, false);
    ctx.fill(); // fills the circle
    //ctx.stroke();
}

//--------------------------------------------------------- prepareFrame()
function prepareFrame() {
    setCanvasBlack(); // erase canvas on each loop/frame

    // 2020-11-23, experimental score text
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "yellow";
    ctx.fillText("Score: " + Score, 10, 50);
}

//--------------------------------------------------------- drawObjects()
function drawObjects() {
    // draw the square
    ctx.fillStyle = square_style;
    ctx.fillRect(x, y, sizeX, sizeY); // draw a square of size "size" at x, y

    drawBall();
}

//--------------------------------------------------------- moveObjects()
function moveObjects() {
    moveBall();    
    handleKeyPress();
}

//--------------------------------------------------------- AnimationLoop()
// this is the animation loop (the Game Loop)
function AnimationLoop() {

    // conceptual step 1: Start with a blank canvas (prepare the frame)
    prepareFrame();

    // conceptual step 2:  Render (draw) the objects on the canvas
    drawObjects();
    drawAllPoints();
    // conceptual step 3:  Detect events that affect our drawing/frame/canvas/game/application/collision

    // conceptual step 4:  update objects (i.e. move them, destroy them, etc.)
    // setup for next frame   
    moveObjects();

    // conceptual step 5: repeat

    if (runAnimation) requestAnimationFrame(AnimationLoop); // execute next frame
}

var mouseUpFlag = true;
var points = [];
var objects = [];

function drawPoints(p) {
    if (p.length == 0) return;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.moveTo(p[0][0], p[0][1]);
    for (let i = 1; i < p.length; i++) {
        ctx.lineTo(p[i][0], p[i][1]);
        ctx.stroke();
    }
}

function drawAllPoints() {
    if (objects.length == 0) return;

    //console.log("points");

    for (let j=0; j < objects.length; j++) {
        let p = objects[j];
        drawPoints(p);
    }
}

function mouseDown(e) {
    mouseUpFlag = false;
    console.log("Mouse button pressed!");
}

function mouseUp(e) {
    mouseUpFlag = true;
    console.log("Mouse button RELEASED!");
    objects.push(points);
    points = [];
}

function mouseMove(e) {
    let x = e.clientX;
    let y = e.clientY;
    //let coor = "Coordinates: (" + x + "," + y + ")";
    //console.log(coor);

    if (!mouseUpFlag) {
        points.push([x, y]);
        drawPoints(points);
    }
}

//--------------------------------------------------------- GO!
AnimationLoop();
