/* JS Tetris Game */


/* ====================================================
    Variables
    - Initialise.
    - Prepare for start of game.
==================================================== */

const fps = 7.5;
const W = 264;
const H = 528;
const X = 0;
const Y = 0;

let ITER = 0;

let score = document.getElementById('score');
let points = 0;

var gameStatus = {
    points: points,
    fps: fps,
    boardW: W,
    boardH: H
};

var keyPresses = [ 0 ];
var storedFunctions = [];
var tetro = {
    position: { x:(W-48)/2,y:0 },
    boundaryPoints: [ [ 18, 36, 54,{x:24,y:48},{x:48,y:48}], [ 48, 48, 48 ] ]
};

/* ====================================================
    Size of Tetris Grid Canvas
    Grid: 40 (height) x 10 (wide)
    Note: Rows 21 and up are not normally shown.
          This is called the "Vanish Zone".
    
    The following will be done for this game:
    - Showing 22 Rows and 11 Columns.
    - Each grid square is 24px x 24px.
    - Total Row height is 528px.
    - Total Column width is 264px.
==================================================== */

/* Initialise Game Variables */
let gameTimer; // Start, pause or stop the game.
let gameRunning = false; // Check if game is running.
let gameReset; // On confirm, reset the game instance.
let TetroArray;
let canvas, ctx, canvasData;
let canvas__next, ctx__next, canvasData__next;
let randomTetro;
let currentTetro;
let nextTetro;

/* Tetrominos - Const (not to be changed) */
const O  = new Tetro("O", "images/tetro_o.png", 12, 48, 36, 48, 36, 48);
const T  = new Tetro("T", "images/tetro_t.png", 12, 48, 36, 48, 60, 48);
const T1 = new Tetro("T", "images/tetro_t1.png", 12, 48, 36, 72, 36, 72);
const T2 = new Tetro("T", "images/tetro_t2.png", 12, 24, 36, 48, 60, 24);
const T3 = new Tetro("T", "images/tetro_t3.png", 12, 72, 36, 48, 36, 48);
const I  = new Tetro("I", "images/tetro_i.png", 12, 96, 12, 96, 12, 96);
const I1 = new Tetro("I", "images/tetro_i1.png", 12, 24, 36, 24, 84, 24);
const J  = new Tetro("J", "images/tetro_j.png", 12, 48, 36, 48, 60, 48);
const J1 = new Tetro("J", "images/tetro_j1.png", 12, 72, 36, 72, 12, 72);
const J2 = new Tetro("J", "images/tetro_j2.png", 12, 24, 36, 24, 60, 48);
const J3 = new Tetro("J", "images/tetro_j3.png", 12, 72, 36, 24, 36, 24);
const L  = new Tetro("L", "images/tetro_l.png", 12, 48, 36, 48, 60, 48);
const L1 = new Tetro("L", "images/tetro_l1.png", 12, 24, 36, 72, 36, 72);
const L2 = new Tetro("L", "images/tetro_l2.png", 12, 48, 36, 24, 60, 24);
const L3 = new Tetro("L", "images/tetro_l3.png", 12, 72, 36, 72, 36, 72);
const Z  = new Tetro("Z", "images/tetro_z.png", 12, 24, 36, 48, 60, 48);
const Z1 = new Tetro("Z", "images/tetro_z1.png", 12, 72, 36, 48, 36, 48);
const S  = new Tetro("S", "images/tetro_s.png", 12, 48, 36, 48, 60, 24);
const S1 = new Tetro("S", "images/tetro_s1.png", 12, 48, 36, 72, 36, 72);

/* Create storage array */
TetroArray = [ O, I, J, L, T, Z, S ];
/*
    TetroArray = [  tetroO, tetroT, tetroT1, tetroT2, tetroT3, 
                    tetroI, tetroI1, tetroJ, tetroJ1, tetroJ2, 
                    tetroJ3, tetroL, tetroL1, tetroL2, tetroL3,
                    tetroZ, tetroZ1, tetroS, tetroS1 ];
*/

/* Initialise Game Canvas */
function createCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasData = ctx.getImageData(0,0,264,528);
    ctx.putImageData(canvasData,0,0);
}

/* Initialise Next Canvas */
function createCanvasNext() {
    canvas__next = document.getElementById("canvas__next");
    ctx__next = canvas__next.getContext("2d");
    canvasData__next = ctx__next.getImageData(0,0,264,528);
    ctx__next.putImageData(canvasData__next,0,0);
}

/* Create Tetriminos */
function Tetro(name, imgSrc, xBound1, yBound1, xBound2, yBound2, xBound3, yBound3) {
    this.image = new Image();
    this.image.src = imgSrc,
    this.image.alt = name,
    this.boundaryPoints = [ xBound1, yBound1, xBound2, yBound2, xBound3, yBound3 ];
    return this;  
}

function rotateTetro(tetro) {
    console.log(tetro);
    switch(tetro.image.alt) {
        // O - Block rotations
        case "O": // Does not rotate
            break;
        // I - Block rotations
        case "I":  return I1;
            break;
        case "I1": return I;
            break;
        // J - Block rotations
        case "J":  return J1;
            break;
        case "J1": return J2;
            break;
        case "J2": return J3;
            break;
        case "J3": return J;
            break;
        // L - Block rotations
        case "L":  return L1;
            break;
        case "L1": return L2;
            break;
        case "L2": return L3;
            break;
        case "L3": return L;
            break;
        // T - Block rotations
        case "T":  return T1;
            break;
        case "T1": return T2;
            break;
        case "T2": return T3;
            break;
        case "T3": return T;
            break;
        // Z - Block rotations
        case "Z":  return Z1;
            break;
        case "Z1": return Z;
            break;
        // S - Block rotations
        case "S":  return S1;
            break;
        case "S1": return S;
            break;
        default: // Do nothing
    }
}

function randomizeTetro() {
    var random = Math.floor(Math.random() * 7);
    console.log(TetroArray[random]);
    return TetroArray[random];
}

function drawTetro(tetro,xpos,ypos) {
    ctx.drawImage(tetro.image,xpos,ypos);
}

function drawTetroNext(tetro,xpos,ypos) {
    console.log(tetro);
    if (tetro.image.alt == "I") {
        // Rotate image if L Tetro is selected
        tetro = rotateTetro(tetro);
        ctx__next.drawImage(tetro.image,24,48);
    } else {
        ctx__next.drawImage(tetro.image,xpos,ypos);
    }
}




function detectCollision() {
    getHitInfo();
    if (tetro.position.y + currentTetro.image.height == H || (currentTetro.hit1.data[0] != 0 || currentTetro.hit2.data[1] !=0 || currentTetro.hit3.data[0] != 0)) {
        rowCheck();
        resetTetro();
        copyCanvas();
        ITER++;
    }
}

function rowCheck() {
    var imgDataArray = [ [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [] ];
    var positionArray = [ 516, 492, 468, 444, 420, 396, 372 ];
    for (var j=0; j<positionArray.length; j++) {
        for (var x=12; x<420; x+=24) {
            var imgData = ctx.getImageData(x,positionArray[j],1,1);
            imgDataArray[j].push(imgData);
        }
    }
    
    for (var m=0; m<imgDataArray.length; m++) {
        var rowChecked = checkRows(m,imgDataArray);
        if (rowChecked == true) {
            clearRow(m);
        }
    }
}
    
function checkRows(row, imgDataArray) {
    for (var i=0; i<imgDataArray[row].length; i++) {
        if (imgDataArray[row][i].data[0] == 0 && imgDataArray[row][i].data[1] == 0 && imgDataArray[row][i].data[2] == 0) {
            return false;
        }
    }
    return true;
}

function clearRow(row) {
    var arrayRow = [ 504, 480, 456, 432, 408, 384, 360 ];
    var savedCanvas = ctx.getImageData(0,0,W,arrayRow[row]);
    ctx.putImageData(savedCanvas,0,24);
    gameStatus.points+=100;
    var score = document.getElementById("score");
    score.innerHTML = "SCORE: " + gameStatus.points;
}

function resetTetro(){
    tetro.position.y = 0;
    currentTetro = randomizeTetro();
    tetro.position.x = (W-48)/2;
}

function getHitInfo() {
    currentTetro.hit1 = ctx.getImageData(tetro.position.x+currentTetro.boundaryPoints[0],tetro.position.y+currentTetro.boundaryPoints[1]+1,1,1);
    currentTetro.hit2 = ctx.getImageData(tetro.position.x+currentTetro.boundaryPoints[2],tetro.position.y+currentTetro.boundaryPoints[3]+1,1,1);
    currentTetro.hit3 = ctx.getImageData(tetro.position.x+currentTetro.boundaryPoints[4],tetro.position.y+currentTetro.boundaryPoints[5]+1,1,1)   
}

function moveX() {
    tetro.position.x+=keyPresses[0];
    tetro.position.x = Math.max(0, Math.min(tetro.position.x, (W - currentTetro.image.width)));
    keyPresses.unshift(0);
}

function dropDownTetro() {
    while (tetro.position.y != 0) {
        tetro.position.y+=12;
        getHitInfo();
        if (tetro.position.y + currentTetro.image.height == H || (currentTetro.hit1.data[0] != 0 || currentTetro.hit2.data[1] !=0 || currentTetro.hit3.data[0] != 0)) {
            drawCanvas();
            drawTetro(currentTetro.image,tetro.position.x,tetro.position.y);
            rowCheck();
            copyCanvas();
            resetTetro();
            ITER++;
        }
    }
}


/* Update Game Scoreboard */

function UpdateScore() {
    while( score.firstChild ) {
        score.removeChild( score.firstChild );
    }
    score.appendChild( document.createTextNode("400") );
}

function updateGameState() {
    canvasData = ctx.getImageData(0,0,264,528);
    ctx.putImageData(canvasData,0,0);
    tetro.position.y+=12;
    moveX();
    drawTetro(currentTetro,tetro.position.x,tetro.position.y);
    detectCollision();
}


/* UI Animations & Javascript */

// Add listener for button clicks
var start = document.getElementById("start");
var pause = document.getElementById("pause");
var quit = document.getElementById("quit");

// Read user input
document.addEventListener("keydown", function(event) {
    keyPressed = event.which;

    switch(keyPressed) {
        case 32: 
            //console.log("Space");
            dropDownTetro();
        break;
        case 37: 
        case 65: 
            console.log("Left");
            //moveX(-24);
            keyPresses.unshift(-24);
        break;
        case 38:
        case 87:
            //console.log("Up");
            rotateTetro();
        break;
        case 39: 
        case 68:
            console.log("Right");
            //moveX(24);
            keyPresses.unshift(24);
        break;
        case 40:
        case 83:
            //console.log("Down");
            tetro.position.y+=12;
        break;
        case 80: 
            // Pause Game
            console.log("Pause Game")
            //PauseGame();
        break;
    }
})

// Reset animations
function resetAnimation(el) {
    var me = el;
    el.style.webkitAnimation = 'none';
    setTimeout(function() {
        me.style.webkitAnimation = '';
    }, 10);
};

// Start or Resume the game.
function StartGame() {
    //gameTimer = setInterval(updateGameState, 1000 / fps);
    gameRunning = true;
    start.classList.add("hide");
    pause.classList.remove("hide");
}

// Pause the game in its current state.
function PauseGame() {
    //clearInterval(gameTimer);
    gameRunning = false;
    pause.classList.add("hide");
    start.classList.remove("hide");
}

// Exit the current game instance. Clear the board.
function QuitGame() {
    PauseGame();
    var gameReset = confirm("Quit the game?");
    if (gameReset === true) {
        // Code here to clear the board ending
        // the game and resetting the instance.
        pause.classList.add("hide");
        start.classList.remove("hide");

        // More to be added...
    } else {
        // Resume playing.
        StartGame();
    }
}

/* Button Animations */
// Start button animation
start.addEventListener("mousedown", function(event) {
        start.classList.remove("animate");
        resetAnimation(start);
        start.classList.add("animate");
});

// Pause button animation
pause.addEventListener("mousedown", function(event) {
        pause.classList.remove("animate");
        resetAnimation(pause);
        pause.classList.add("animate");
});

// Quit button animation
quit.addEventListener("mousedown", function(event) {
        quit.classList.remove("animate");
        resetAnimation(quit);
        quit.classList.add("animate");
});


/* On Load */
window.onload = function() {
    createCanvas();
    createCanvasNext();

    /*if (ITER == 0) {
        currentTetro = randomizeTetro();
    };
    nextTetro = randomizeTetro();
    drawTetro(currentTetro, 48, 48);
    drawTetroNext(nextTetro, 48, 24);
    ITER++; // Iterate to next round*/
}

