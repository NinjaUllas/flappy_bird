const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// we will need  the game container to make it blurry
// when we display end-menu. 
const gameContainer = document.getElementById('game-content');

const flappyimg = new Image();
flappyimg.src = 'assets/flappy_dunk.png';

//game constants 

const FLAP_SPEED = -4;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//bird variables

let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

//pipe variables

let pipeX = 400;
let pipeY = canvas.height - 200;

//score and highscore variables

let scoreDiv = document.getElementById('score-display');
let score = 0;
let highscore = 0;

//add a bool variable, so that we check when the bird passes
// and increase the score by 1

let scored = false;

// control the bird with the space key

document.body.onkeyup = function (e) {
    if (e.code == "Space") {
        birdVelocity = FLAP_SPEED;
    }
}
// restart game using retry button

document.getElementById('retry').addEventListener('click', function () {
    HideEndMenu();
    resetGame();
    loop();
})

function increaseScore() {
    // Increase the score each time the bird passes the tubes

    if (birdX > pipeX + PIPE_WIDTH && 
        (birdY < pipeY + PIPE_GAP || 
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) && 
            !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    //reset the flag it bird passses the pipe

    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }

}

function collisionCheck() {
    // Create a bounding box to the bird and the pipes
    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT, 
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    //check for collision with upper pipe

    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
        return true;
    }

    //check for collision with bottom pipe

    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    //check if bird hits boundaries

    if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
        return true;
    }

    return false;

}

function HideEndMenu() {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu() {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    if (highscore < score) {
        highscore = score;
    }
    document.getElementById('best-score').innerHTML = highscore;
}

//reset the values to the begining

function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // reset the ctx after every loop iteration
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw flappy bird

    ctx.drawImage(flappyimg, birdX, birdY);

    //draw pipes 

    ctx.fillstyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);


    // the collision check will return as true if a collision has occured
    // and end the game

    if (collisionCheck()) {
        endGame();
        return;
    }

    pipeX -= 1.5;

    // if the pipe moves out of the frame need to reset the pipe 

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }


    //apply gravity to the bird

    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    increaseScore();
    requestAnimationFrame(loop);

}


loop();