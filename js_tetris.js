/* JS Tetris Game */

/* ====================================================
    
    Variables
    -------------------------------
    - Initialise.
    - Prepare for start of game.

    Scoring System
    -------------------------------
    - Simple scoring is encouraged here, so there are
    no rewards for T-spin.
    - There is no level system.
    - Combos are not in this game.
    - Play until you have enough.

    Points Scored
    -------------------------------
    Single          100
    Double          300
    Triple          500
    Quad or more    185 x row

    Size of Tetris Grid Canvas
    -------------------------------
    Grid: 26 (height) x 11 (wide)
    Note: Rows 22 and are not shown.
          This is called the "Vanish Zone".
          If Tetris blocks stack into the
          Vanish Zone will end the game.
    
    The following will be done for this game:
    - Showing 22 Rows and 11 Columns.
    - Each grid square is 24px x 24px.
    - Total Row height is 528px.
    - Total Column width is 264px.

==================================================== */


/* Initialise Game Variables */

const fps = 7.5;
const W = 264;
const H = 528;
//const X = 0;
//const Y = 0;

let score = document.getElementById('score');
let m_score = document.getElementById('m_score');
let points = 0;

let ITER = 0;

var gameStatus = {
    points: points,
    fps: fps,
    boardW: W,
    boardH: H
};

var keyPresses = [ 0 ];
var storedFunctions = [];
var tetro = {
    position: { x:(W-24)/2, y:-96 },
    boundaryPoints: [ [ 18, 36, 54,{x:24, y:48},{x:48, y:48}], [ 48, 48, 48 ] ]
};

var rowsToClear = 0;

let gameTimer; // Start, pause or stop the game.
let gameRunning = false; // Check if game is running.
let gameReset; // On confirm, reset the game instance.
let gameOver = false; // Check if Player has lost.
let TetroArray;
let canvas, ctx, canvasData;
let canvas__next, ctx__next, canvasData__next;
let m_canvas__next, m_ctx__next, m_canvasData__next;
let randomTetro;
let currentTetro;
let nextTetro;


/* Tetrominos - Const (not to be changed) */

const O  = new Tetro("O", "images/tetro_o.png", 12, 48, 36, 48, 36, 48);
const T  = new Tetro("T", "images/tetro_t.png", 12, 48, 36, 48, 60, 48);
const T1 = new Tetro("T1", "images/tetro_t1.png", 12, 48, 36, 72, 36, 72);
const T2 = new Tetro("T2", "images/tetro_t2.png", 12, 24, 36, 48, 60, 24);
const T3 = new Tetro("T3", "images/tetro_t3.png", 12, 72, 36, 48, 36, 48);
const I  = new Tetro("I", "images/tetro_i.png", 12, 24, 36, 24, 84, 24);
const I1 = new Tetro("I1", "images/tetro_i1.png", 12, 96, 12, 96, 12, 96);
const J  = new Tetro("J", "images/tetro_j.png", 12, 48, 36, 48, 60, 48);
const J1 = new Tetro("J1", "images/tetro_j1.png", 12, 72, 36, 72, 12, 72);
const J2 = new Tetro("J2", "images/tetro_j2.png", 12, 24, 36, 24, 60, 48);
const J3 = new Tetro("J3", "images/tetro_j3.png", 12, 72, 36, 24, 36, 24);
const L  = new Tetro("L", "images/tetro_l.png", 12, 48, 36, 48, 60, 48);
const L1 = new Tetro("L1", "images/tetro_l1.png", 12, 24, 36, 72, 36, 72);
const L2 = new Tetro("L2", "images/tetro_l2.png", 12, 48, 36, 24, 60, 24);
const L3 = new Tetro("L3", "images/tetro_l3.png", 12, 72, 36, 72, 36, 72);
const Z  = new Tetro("Z", "images/tetro_z.png", 12, 24, 36, 48, 60, 48);
const Z1 = new Tetro("Z1", "images/tetro_z1.png", 12, 72, 36, 48, 36, 48);
const S  = new Tetro("S", "images/tetro_s.png", 12, 48, 36, 48, 60, 24);
const S1 = new Tetro("S1", "images/tetro_s1.png", 12, 48, 36, 72, 36, 72);

// Create storage array
TetroArray = [ O, I, J, L, T, Z, S ];


/* Initialise Canvas */

// Game Canvas
function CreateCanvas() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvasData = ctx.getImageData(0,0,264,528);
    ctx.putImageData(canvasData,0,0);
}

// Next Canvas (Desktop)
function CreateCanvasNext() {
    canvas__next = document.getElementById("canvas__next");
    ctx__next = canvas__next.getContext("2d");
    canvasData__next = ctx__next.getImageData(0,0,144,96);
    ctx__next.putImageData(canvasData__next,0,0);
}

// Next Canvas (Mobile)
function m_CreateCanvasNext() {
    m_canvas__next = document.getElementById("m_canvas__next");
    m_ctx__next = m_canvas__next.getContext("2d");
    m_canvasData__next = m_ctx__next.getImageData(0,0,144,96);
    m_ctx__next.putImageData(m_canvasData__next,0,0);
}


/* Create & Manipulate Tetros */

// Generate Tetro on callback.
function Tetro(name, imgSrc, xBound1, yBound1, xBound2, yBound2, xBound3, yBound3) {
    this.image = new Image();
    this.image.src = imgSrc,
    this.image.alt = name,
    this.boundaryPoints = [ xBound1, yBound1, xBound2, yBound2, xBound3, yBound3 ],
    this.image.crossOrigin = "anonymous";
    return this;  
}

// Rotate current Tetrominos on Canvas.
function RotateTetro(tetro) {
    //console.log(tetro);
    switch(tetro.image.alt) {
        // O - Block rotations
        case "O": // Does not rotate
            break;
        // I - Block rotations
        case "I":  currentTetro = I1;
            break;
        case "I1": currentTetro = I;
            break;
        // J - Block rotations
        case "J":  currentTetro = J1;
            break;
        case "J1": currentTetro = J2;
            break;
        case "J2": currentTetro = J3;
            break;
        case "J3": currentTetro = J;
            break;
        // L - Block rotations
        case "L":  currentTetro = L1;
            break;
        case "L1": currentTetro = L2;
            break;
        case "L2": currentTetro = L3;
            break;
        case "L3": currentTetro = L;
            break;
        // T - Block rotations
        case "T":  currentTetro = T1;
            break;
        case "T1": currentTetro = T2;
            break;
        case "T2": currentTetro = T3;
            break;
        case "T3": currentTetro = T;
            break;
        // Z - Block rotations
        case "Z":  currentTetro = Z1;
            break;
        case "Z1": currentTetro = Z;
            break;
        // S - Block rotations
        case "S":  currentTetro = S1;
            break;
        case "S1": currentTetro = S;
            break;
        default: // Do nothing
    }
}

// Randomly select a Tetro.
function RandomizeTetro() {
    var random = Math.floor(Math.random() * 7);
    return TetroArray[random];
}

// Draw Tetro to Game Canvas.
function DrawTetro(tetro,xpos,ypos) {
    ctx.drawImage(tetro.image,xpos,ypos);
}

// Draw Tetro to Next Canvas.
function DrawTetroNext(tetro,xpos,ypos) {
    if (tetro.image.alt == "I") {
        ctx__next.drawImage(tetro.image,24,48);
        m_ctx__next.drawImage(tetro.image,24,48);
    } else {
        ctx__next.drawImage(tetro.image,xpos,ypos);
        m_ctx__next.drawImage(tetro.image,xpos,ypos);
    }
}


/* Game State and Actions */

// Detect collision of Tetros.
function DetectCollision() {
    GetHitInfo();
    if (tetro.position.y + currentTetro.image.height == H || (currentTetro.hit1.data[0] != 0 || currentTetro.hit2.data[1] != 0 || currentTetro.hit3.data[0] != 0)) {
        RowCheck();
        ResetTetro();
        canvasData = ctx.getImageData(0,0,264,528);
        ITER++;
    }
}

// Check if row has been filled by Tetros.
function RowCheck() {
    var imgDataArray =  [  [],  [],  [],  [],  [],  [],  [],  [],  [],  [],
                           [],  [],  [],  [],  [],  [],  [],  [],
                           [],  [],  [],  [],  [],  [] ];
    var positionArray = [ 564, 540, 516, 492, 468, 444, 420, 396, 372, 348, 
                          324, 300, 276, 252, 228, 204, 180, 156,
                          132, 108,  84,  60,  36,  12 ];
    // Check for Tetro image data in each row.
    for (var j = 0; j < positionArray.length; j++) {
        for (var x = 12; x < 264; x += 24) {
            var imgData = ctx.getImageData(x,positionArray[j],1,1);
            imgDataArray[j].push(imgData);
        }
    }
    // Check for complete rows of Tetro image data.
    for (var m = 0; m < imgDataArray.length; m++) {
        var rowChecked = CheckRows(m,imgDataArray);
        if (rowChecked == true) {
            ClearRow(m);
        }
    }
}
 
// Callback function within rowCheck.  
function CheckRows(row, imgDataArray) {
    var imageData = false;
    for (var i = 0; i < imgDataArray[row].length; i++) {
        // Check for Game Over state.
        if (imgDataArray[row][i].data[0] > 0 ||  
            imgDataArray[row][i].data[1] > 0 || 
            imgDataArray[row][i].data[2] > 0 || 
            imgDataArray[row][i].data[3] > 0) {
            if (row >= 23) {
                // Timeout to let the game instance catch up.
                setTimeout(function() {
                    alert("Game over! Thanks for Playing");
                    gameOver = true;
                    PauseGame();
                }, 100);
                break;
            }
        }
        // Check for incomplete row.
        if (imgDataArray[row][i].data[0] == 0 && 
            imgDataArray[row][i].data[1] == 0 && 
            imgDataArray[row][i].data[2] == 0 && 
            imgDataArray[row][i].data[3] == 0) {
            // No image data found.
            imageData = false;
        }
    }
    if (imageData) {
        // Complete row found.
        rowsToClear++;
        return true;
    } else {
        return false
    }
}

// Clear complete row and score the Player.
function ClearRow(row) {
    var arrayRow = [ 504, 480, 456, 432, 408, 384, 360, 336, 
                     312, 288, 264, 240, 216, 196, 168, 144,  
                     120,  96,  72,  48,  24 ];
    var savedCanvas = ctx.getImageData(0,0,W,arrayRow[row]);
    ctx.putImageData(savedCanvas,0,24);
    ScorePlayer();
}

function ScorePlayer() {
    // Cleared one row.
    if (rowsToClear == 1) {
        gameStatus.points += 100;
    }
    // Cleared two rows.
    else if (rowsToClear == 2) {
        gameStatus.points += 300;
    }
    // Cleared three rows.
    else if (rowsToClear == 3) {
        gameStatus.points += 500;
    }
    // Cleared four rows or more
    else if (rowsToClear > 3) {
        gameStatus.points += (185 * rowsToClear);
    }

    // Update Player score.
    score.innerHTML = gameStatus.points;
    m_score.innerHTML = gameStatus.points;

    // Reset cleared rows for next frame cycle.
    rowsToClear = 0;
}

// Reset and call new Tetro.
function ResetTetro() {
    // Clear Next Canvas
    ctx__next.clearRect(0, 0, canvas__next.width, canvas__next.height);
    m_ctx__next.clearRect(0, 0, m_canvas__next.width, m_canvas__next.height);

    currentTetro = nextTetro;
    nextTetro = RandomizeTetro();
    tetro.position.y = -96;
    tetro.position.x = (W - 24)/2;
    DrawTetroNext(nextTetro, 48, 24);
}

// Get Hit confirmation for Tetro.
function GetHitInfo() {
    currentTetro.hit1 = ctx.getImageData(tetro.position.x + currentTetro.boundaryPoints[0],tetro.position.y + currentTetro.boundaryPoints[1] + 1, 1, 1);
    currentTetro.hit2 = ctx.getImageData(tetro.position.x + currentTetro.boundaryPoints[2],tetro.position.y + currentTetro.boundaryPoints[3] + 1, 1, 1);
    currentTetro.hit3 = ctx.getImageData(tetro.position.x + currentTetro.boundaryPoints[4],tetro.position.y + currentTetro.boundaryPoints[5] + 1, 1, 1);
}

// Read Player inputs and move Tetro each frame cycle.
function MoveX() {
    tetro.position.x += keyPresses[0];
    tetro.position.x = Math.max(0, Math.min(tetro.position.x, (W - currentTetro.image.width)));
    keyPresses.unshift(0);
}

// Drop down Tetro to Canvas bottom.
function DropDownTetro() {
    while (tetro.position.y != 0) {
        tetro.position.y+=12;
        GetHitInfo();
        if (tetro.position.y + currentTetro.image.height == H || (currentTetro.hit1.data[0] != 0 || currentTetro.hit2.data[1] != 0 || currentTetro.hit3.data[0] != 0)) {
            ctx.putImageData(canvasData,0,0);
            DrawTetro(currentTetro,tetro.position.x,tetro.position.y);
            RowCheck();
            canvasData = ctx.getImageData(0,0,264,528);
            ResetTetro();
            ITER++;
        }
    }
}

// Update Game State.
function UpdateGameState() {
    ctx.putImageData(canvasData,0,0);
    tetro.position.y += 12;
    MoveX();
    DrawTetro(currentTetro,tetro.position.x,tetro.position.y);
    DetectCollision();
}


/* UI Animations & Javascript */

// Add listener for button clicks.
var start = document.getElementById("start");
var pause = document.getElementById("pause");
var quit = document.getElementById("quit");

// Read Player keypresses.
document.addEventListener("keydown", function(event) {
    action = event.which;

    switch(action) {
        case 32: 
            //console.log("Space");
            DropDownTetro();
        break;
        case 37: 
        case 65: 
            //console.log("Left");
            keyPresses.unshift(-24);
        break;
        case 38:
        case 87:
            //console.log("Up");
            RotateTetro(currentTetro);
        break;
        case 39: 
        case 68:
            //console.log("Right");
            keyPresses.unshift(24);
        break;
        case 40:
        case 83:
            //console.log("Down");
            tetro.position.y+=12;
        break;
        case 80: 
            //console.log("Pause Game")
            PauseGame();
        break;
    }
})

// Start or Resume the game.
function StartGame() {
    if (gameOver == false) {
        gameTimer = setInterval(UpdateGameState, 1000 / fps);
        gameRunning = true;
        start.classList.add("hide");
        pause.classList.remove("hide");
    } else {
        alert("You lost! Quit the game to start over.");
    }
}

// Pause the game in its current state.
function PauseGame() {
    clearInterval(gameTimer);
    gameRunning = false;
    pause.classList.add("hide");
    start.classList.remove("hide");
}

// Exit the current game instance.
function QuitGame() {
    PauseGame();
    var gameReset = confirm("Quit the game?");
    if (gameReset === true) {
        // Code here to clear the board ending
        // the game and resetting the instance.
        ResetGame();
        ResetTetro();
    } else {
        // Resume playing...
        StartGame();
    }
}

// Reset the game. Clear the board.
function ResetGame() {
    gameRunning = false;
    gameOver = false;
    pause.classList.add("hide");
    start.classList.remove("hide");
    // Clear the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Create new Game canvas.
    canvasData = ctx.getImageData(0,0,264,528);
    // Clear Current Tetro
    currentTetro = null;
    // Reset player score.
    score.innerHTML = 0;
    m_score.innerHTML = 0;
}


/* Button Animations */

// Reset animations.
function ResetAnimation(el) {
    var me = el;
    el.style.webkitAnimation = 'none';
    setTimeout(function() {
        me.style.webkitAnimation = '';
    }, 10);
};

// Start button animation.
start.addEventListener("mousedown", function(event) {
        start.classList.remove("animate");
        ResetAnimation(start);
        start.classList.add("animate");
});

// Pause button animation.
pause.addEventListener("mousedown", function(event) {
        pause.classList.remove("animate");
        ResetAnimation(pause);
        pause.classList.add("animate");
});

// Quit button animation.
quit.addEventListener("mousedown", function(event) {
        quit.classList.remove("animate");
        ResetAnimation(quit);
        quit.classList.add("animate");
});


/* On Load */
window.onload = function() {
    CreateCanvas();
    CreateCanvasNext();
    m_CreateCanvasNext();
    nextTetro = RandomizeTetro()
    ResetTetro();
}
